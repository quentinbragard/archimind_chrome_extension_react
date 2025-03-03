#!/usr/bin/env node

/**
 * Utility script to find and replace Tailwind class references across the project
 */

const fs = require('fs');
const path = require('path');

// Define replacements
const classReplacements = {
  // Text color replacements
  'text-text': 'text-gray-800',
  'text-text-default': 'text-gray-800',
  'text-text-secondary': 'text-gray-600',
  
  // Background opacity pattern replacements
  'bg-primary bg-opacity-5': 'bg-primary/5',
  'bg-primary bg-opacity-10': 'bg-primary/10',
  'bg-primary bg-opacity-20': 'bg-primary/20',
  'bg-white bg-opacity-20': 'bg-white/20',
  'bg-white bg-opacity-30': 'bg-white/30',
  'bg-black bg-opacity-50': 'bg-black/50',
  
  // Border opacity pattern replacements
  'border-primary border-opacity-15': 'border-primary/15',
  
  // Hover pattern replacements
  'hover:bg-primary hover:bg-opacity-10': 'hover:bg-primary/10',
  'hover:bg-primary hover:text-white': 'hover:bg-primary hover:text-white',
  'hover:bg-white hover:bg-opacity-20': 'hover:bg-white/20',
};

// Define directories to search
const searchDirectories = [
  path.resolve(__dirname, 'src/components'),
  path.resolve(__dirname, 'src/popup'),
  path.resolve(__dirname, 'src/options'),
  path.resolve(__dirname, 'src/welcome'),
  path.resolve(__dirname, 'src/content')
];

// Function to handle replacement in a file
function processFile(filePath) {
  // Only process TypeScript/JavaScript/TSX/JSX/CSS files
  if (!/\.(ts|js|tsx|jsx|css)$/.test(filePath)) {
    return;
  }

  console.log(`Processing: ${filePath}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Perform replacements
  Object.entries(classReplacements).forEach(([oldClass, newClass]) => {
    if (content.includes(oldClass)) {
      content = content.replace(new RegExp(oldClass, 'g'), newClass);
      hasChanges = true;
      console.log(`  Replaced: ${oldClass} → ${newClass}`);
    }
  });
  
  // Write changes if any were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated: ${filePath}`);
  }
}

// Function to recursively process directories
function processDirectory(directoryPath) {
  const items = fs.readdirSync(directoryPath);
  
  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (stat.isFile()) {
      processFile(itemPath);
    }
  });
}

// Run the script
console.log('Starting class replacement...');
searchDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  } else {
    console.log(`Directory not found: ${dir}`);
  }
});
console.log('Replacement complete!');