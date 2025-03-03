# Debugging Guide for Archimind Chrome Extension

This guide provides strategies and techniques for debugging the Archimind Chrome Extension during development.

## Chrome Extension Debugging Tools

### Inspecting the Background Script

1. Go to `chrome://extensions`
2. Find the Archimind extension and click "Details"
3. Find "Inspect views: Service Worker" and click on it
4. This opens DevTools for the background script

### Inspecting the Popup

1. Right-click on the extension icon in the Chrome toolbar
2. Click "Inspect Popup"
3. This opens DevTools for the popup

### Inspecting Content Scripts

1. Open the ChatGPT page
2. Right-click and select "Inspect" to open DevTools
3. Go to the "Sources" tab
4. Look for a section called "Content scripts" in the file tree
5. You should see files from the extension

## Debugging Techniques

### Console Logging

Use `console.log`, `console.error`, and `console.warn` to output debug information:

```typescript
console.log('Debug info:', someVariable);
console.error('Error occurred:', errorObject);
```

### React DevTools

1. Install the [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension
2. Open DevTools when inspecting the popup or content scripts
3. Switch to the "Components" or "Profiler" tab to inspect React components

### Using the Debugger Statement

Add a `debugger` statement in your code to pause execution:

```typescript
function myFunction() {
  debugger; // Execution will pause here when DevTools is open
  // Rest of your code
}
```

### Network Monitoring

To debug API calls:

1. Open DevTools
2. Go to the "Network" tab
3. Filter by "Fetch/XHR"
4. Look for requests to your API endpoints

## Common Issues and Solutions

### Extension Not Loading

If the extension isn't loading:

1. Check the console for errors in the background script
2. Verify the manifest.json is valid
3. Make sure all required files are being included in the build

### Content Script Not Injecting

If the content script isn't running on the page:

1. Check the `matches` pattern in manifest.json
2. Look for errors in the console
3. Verify the content script is being built correctly

### Authentication Issues

If authentication is failing:

1. Check the network requests for API calls
2. Verify the OAuth configuration in manifest.json
3. Check for CORS issues in the background script console

### UI Rendering Problems

If components aren't rendering correctly:

1. Inspect with React DevTools
2. Check for React key warnings
3. Verify CSS is being applied correctly

## Debugging Chrome Extension Specific Features

### Message Passing

To debug message passing between components:

```typescript
// Sender
chrome.runtime.sendMessage({ action: "someAction", data: someData }, (response) => {
  console.log("Message sent, response:", response);
  if (chrome.runtime.lastError) {
    console.error("Error:", chrome.runtime.lastError);
  }
});

// Receiver
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request, "from:", sender);
  // Process message
  sendResponse({ success: true });
});
```

### Storage

To debug chrome.storage issues:

```typescript
// Writing to storage
chrome.storage.local.set({ key: value }, () => {
  console.log("Value stored:", value);
  if (chrome.runtime.lastError) {
    console.error("Error:", chrome.runtime.lastError);
  }
});

// Reading from storage
chrome.storage.local.get(["key"], (result) => {
  console.log("Value retrieved:", result.key);
  if (chrome.runtime.lastError) {
    console.error("Error:", chrome.runtime.lastError);
  }
});
```

### Content Script Injection

To check if content scripts are injected properly:

```typescript
// At the top of your content script
console.log('Content script injected on:', window.location.href);
```

## Performance Debugging

### React Component Profiling

1. Open React DevTools
2. Go to the "Profiler" tab
3. Click "Start profiling"
4. Perform the actions you want to profile
5. Click "Stop profiling"
6. Analyze the results

### Memory Leaks

To check for memory leaks:

1. Open DevTools
2. Go to the "Memory" tab
3. Take a heap snapshot
4. Perform actions that might cause leaks
5. Take another snapshot
6. Compare the snapshots

## Recommended VSCode Extensions for Debugging

- **Debugger for Chrome**: Allows you to debug your JavaScript code in Chrome from VSCode
- **React Developer Tools**: Provides debugging tools for React applications
- **ESLint**: Helps catch problems in your code
- **Error Lens**: Shows errors and warnings inline in your code

## Additional Resources

- [Chrome Extension Development Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [React DevTools Documentation](https://react.dev/learn/react-developer-tools)
- [TypeScript Debugging Tips](https://code.visualstudio.com/docs/typescript/typescript-debugging)