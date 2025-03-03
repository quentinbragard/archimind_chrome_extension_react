const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readlineSync = require('readline-sync');

// Configuration
const config = {
  buildDir: 'dist',
  zipName: 'archimind-extension.zip',
  manifestPath: 'src/manifest.json',
  changelogPath: 'CHANGELOG.md',
};

console.log(chalk.blue('\n🚀 Archimind Extension Release Script\n'));

// Read current version
const manifest = JSON.parse(fs.readFileSync(config.manifestPath, 'utf8'));
const currentVersion = manifest.version;
console.log(chalk.cyan(`Current version: ${currentVersion}`));

// Ask for confirmation
const shouldContinue = readlineSync.keyInYN(
  chalk.yellow('Do you want to prepare a new release?')
);

if (!shouldContinue) {
  console.log(chalk.gray('Release process canceled.'));
  process.exit(0);
}

// Get new version
console.log('');
console.log(chalk.cyan('Select version increment:'));
console.log(chalk.gray('1) Patch (x.x.X) - Bug fixes'));
console.log(chalk.gray('2) Minor (x.X.0) - New features, backward compatible'));
console.log(chalk.gray('3) Major (X.0.0) - Breaking changes'));
console.log('');

const versionType = readlineSync.keyIn(chalk.yellow('Enter your choice (1-3): '), {
  limit: '123',
});

// Calculate new version
const versionParts = currentVersion.split('.').map(Number);
if (versionType === '1') {
  versionParts[2] += 1;
} else if (versionType === '2') {
  versionParts[1] += 1;
  versionParts[2] = 0;
} else if (versionType === '3') {
  versionParts[0] += 1;
  versionParts[1] = 0;
  versionParts[2] = 0;
}

const newVersion = versionParts.join('.');
console.log(chalk.green(`\nNew version will be: ${newVersion}`));

// Get release notes
console.log(chalk.cyan('\nEnter release notes (press Enter twice to finish):'));
let releaseNotes = '';
let line;
while ((line = readlineSync.prompt()) !== '') {
  releaseNotes += line + '\n';
}

// Confirm release
console.log(chalk.yellow('\nReady to prepare release with the following details:'));
console.log(`Version: ${newVersion}`);
console.log('Release notes:');
console.log(chalk.gray(releaseNotes));

const confirmRelease = readlineSync.keyInYN(chalk.yellow('\nContinue with release?'));
if (!confirmRelease) {
  console.log(chalk.gray('Release process canceled.'));
  process.exit(0);
}

try {
  // Update version in manifest
  console.log(chalk.cyan('\n1. Updating version in manifest.json...'));
  manifest.version = newVersion;
  fs.writeFileSync(config.manifestPath, JSON.stringify(manifest, null, 2));
  
  // Update changelog
  console.log(chalk.cyan('2. Updating CHANGELOG.md...'));
  const changelog = fs.existsSync(config.changelogPath)
    ? fs.readFileSync(config.changelogPath, 'utf8')
    : '# Changelog\n\n';
  
  const today = new Date().toISOString().split('T')[0];
  const newChangelog = 
    `# Changelog\n\n` +
    `## [${newVersion}] - ${today}\n\n` +
    `${releaseNotes}\n` +
    changelog.replace('# Changelog\n\n', '');
  
  fs.writeFileSync(config.changelogPath, newChangelog);
  
  // Commit changes
  console.log(chalk.cyan('3. Committing version and changelog changes...'));
  execSync('git add src/manifest.json CHANGELOG.md');
  execSync(`git commit -m "chore: Bump version to ${newVersion}"`);
  
  // Create a tag
  console.log(chalk.cyan(`4. Creating git tag v${newVersion}...`));
  execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
  
  // Build production version
  console.log(chalk.cyan('5. Building production version...'));
  execSync('npm run build', { stdio: 'inherit' });
  
  // Success
  console.log(chalk.green('\n✅ Release preparation completed successfully!'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log(`1. Push the changes: git push && git push --tags`);
  console.log(`2. Upload ${config.zipName} to the Chrome Web Store`);
  console.log(`3. Submit for review\n`);
  
} catch (error) {
  console.error(chalk.red(`\n❌ Release preparation failed: ${error.message}\n`));
  console.error(error);
  process.exit(1);
}