const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');

// Configuration
const config = {
  buildDir: 'dist',
  zipName: 'archimind-extension.zip',
  manifestPath: 'src/manifest.json',
  environments: ['development', 'staging', 'production'],
};

// Parse command line arguments
const args = process.argv.slice(2);
const env = args[0] || 'production';
const verbose = args.includes('--verbose');

// Validate environment
if (!config.environments.includes(env)) {
  console.error(chalk.red(`Invalid environment: ${env}`));
  console.log(chalk.yellow(`Available environments: ${config.environments.join(', ')}`));
  process.exit(1);
}

console.log(chalk.blue(`\n🔧 Building Archimind extension for ${chalk.bold(env)} environment\n`));

try {
  // Clear previous build
  console.log(chalk.cyan('1. Cleaning previous build...'));
  if (fs.existsSync(config.buildDir)) {
    fs.rmSync(config.buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(config.buildDir, { recursive: true });
  
  // Update manifest version for production
  if (env === 'production') {
    console.log(chalk.cyan('2. Updating manifest version...'));
    const manifest = JSON.parse(fs.readFileSync(config.manifestPath, 'utf8'));
    
    // Increment the version (simple patch version increment)
    const versionParts = manifest.version.split('.');
    versionParts[2] = parseInt(versionParts[2], 10) + 1;
    manifest.version = versionParts.join('.');
    
    console.log(chalk.green(`   Version updated to ${manifest.version}`));
    
    // Write updated manifest
    fs.writeFileSync(config.manifestPath, JSON.stringify(manifest, null, 2));
  }
  
  // Run webpack build
  console.log(chalk.cyan(`3. Running webpack build for ${env}...`));
  const webpackCommand = `webpack --mode=${env === 'production' ? 'production' : 'development'} ${verbose ? '--progress' : ''}`;
  execSync(webpackCommand, { stdio: verbose ? 'inherit' : 'ignore' });
  
  // Copy additional files
  console.log(chalk.cyan('4. Copying additional files...'));
  fs.cpSync('public', config.buildDir, { recursive: true });
  
  // Create zip file for production
  if (env === 'production') {
    console.log(chalk.cyan('5. Creating extension zip file...'));
    
    // Delete previous zip if exists
    const zipPath = path.join(config.buildDir, '..', config.zipName);
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(config.buildDir, false);
    
    await archive.finalize();
    
    console.log(chalk.green(`   Zip file created: ${config.zipName}`));
  }
  
  // Success message
  console.log(chalk.green(`\n✅ Build completed successfully for ${env} environment!\n`));
  
  if (env === 'development') {
    console.log(chalk.yellow('To load the extension in Chrome:'));
    console.log('1. Go to chrome://extensions');
    console.log('2. Enable Developer Mode');
    console.log(`3. Click "Load unpacked" and select the "${config.buildDir}" directory\n`);
  } else if (env === 'production') {
    console.log(chalk.yellow('To publish the extension:'));
    console.log(`1. Use the generated ${config.zipName} file`);
    console.log('2. Upload to the Chrome Web Store Developer Dashboard\n');
  }
  
} catch (error) {
  console.error(chalk.red(`\n❌ Build failed: ${error.message}\n`));
  if (verbose) {
    console.error(error);
  }
  process.exit(1);
}