# Archimind Chrome Extension

A Chrome extension that enhances the ChatGPT experience by tracking conversations, managing templates, optimizing prompts, and providing valuable insights.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
  - [Getting Started](#getting-started)
  - [Commands](#commands)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
- [Build and Release](#build-and-release)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

Archimind is a Chrome extension designed to work with ChatGPT. It provides a variety of features to enhance the user experience, collect analytics, and improve productivity with AI tools.

## Features

- **Template Management**: Save and organize prompt templates for quick access
- **Prompt Enhancement**: Get AI-powered suggestions to improve your prompts
- **Analytics**: Track usage statistics and conversation quality
- **Message Capture**: Automatically save your conversations for later reference
- **Notifications**: Receive insights and updates about your AI usage
- **Quick Actions**: Perform common tasks with a single click

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Webpack
- **Testing**: Jest & React Testing Library
- **Code Quality**: ESLint, Prettier
- **Authentication**: OAuth 2.0 (Google) and email/password

## Project Structure

```
archimind-react/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── assets/              # Assets that need processing
│   ├── background/          # Background service worker
│   ├── components/          # Reusable React components
│   │   ├── common/          # Common components
│   │   └── features/        # Feature-specific components
│   ├── content/             # Content scripts
│   │   ├── components/      # Content-specific React components
│   │   ├── hooks/           # Content script React hooks
│   │   └── index.tsx        # Entry point for content script
│   ├── hooks/               # Shared React hooks
│   ├── popup/               # Popup UI
│   ├── options/             # Options page
│   ├── welcome/             # Welcome page
│   ├── services/            # Service layer for API calls
│   ├── types/               # TypeScript types and interfaces
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   └── manifest.json        # Extension manifest file
├── scripts/                 # Build and release scripts
├── tests/                   # Test setup and utilities
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── webpack.config.js        # Webpack configuration
└── README.md                # Project documentation
```

## Installation

### For Users

1. Visit the Chrome Web Store and search for "Archimind" or follow [this link](#)
2. Click "Add to Chrome"
3. After installation, you'll be taken to the welcome page
4. Sign in with your Google account or create an account
5. Start using ChatGPT with enhanced features

### For Developers

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/archimind-react.git
   cd archimind-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build:dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle at the top right)
   - Click "Load unpacked" and select the `dist` directory

## Development

### Getting Started

1. Start the development server with auto-reloading:
   ```bash
   npm run dev
   ```

2. Open Chrome and load the extension from the `dist` directory as described above

3. As you make changes, the extension will be rebuilt automatically
   - You'll need to reload the extension in Chrome to see the changes
   - Click the refresh icon on the extension card in `chrome://extensions`

### Commands

- `npm run dev` - Start development server with auto-reloading
- `npm run build` - Build the extension for production
- `npm run build:dev` - Build the extension for development
- `npm test` - Run tests
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm run release` - Prepare a new release

### Testing

We use Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- Button.test.tsx

# Generate coverage report
npm test -- --coverage
```

See [TESTING.md](TESTING.md) for more details on our testing strategy.

### Code Quality

We use ESLint and Prettier to ensure code quality:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Build and Release

### Building for Development

```bash
npm run build:dev
```

### Building for Production

```bash
npm run build
```

This will:
1. Clean the `dist` directory
2. Bundle all assets with Webpack in production mode
3. Copy static files
4. Create a ZIP file for submission to the Chrome Web Store

### Releasing a New Version

```bash
npm run release
```

This script will:
1. Prompt for the version increment type (patch, minor, major)
2. Update the version in `manifest.json`
3. Update `CHANGELOG.md` with release notes
4. Commit and tag the changes
5. Build the extension for production

## Architecture

### Core Components

1. **Background Script**: Handles authentication, message passing, and background tasks
2. **Content Script**: Injects UI components into the ChatGPT page and observes the DOM for changes
3. **Popup**: Provides a quick interface for accessing templates and settings

### State Management

We use React hooks for state management, with service modules to handle API calls and business logic.

### Communication Flow

1. **Content Script ↔ Background Script**: Communication via Chrome's `runtime.sendMessage` API
2. **React Components ↔ Services**: Components use hooks to interact with services
3. **Services ↔ Backend API**: Services make HTTP requests to the Archimind backend

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.