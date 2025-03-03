# Contributing to Archimind Chrome Extension

Thank you for considering contributing to the Archimind Chrome Extension! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We want to maintain a welcoming and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue on the GitHub repository with the following information:

- **Title**: Clear and descriptive title
- **Description**: Detailed steps to reproduce the bug
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots to help explain the problem
- **Environment**: Browser version, extension version, operating system

### Suggesting Enhancements

If you have ideas for enhancing the extension, please create an issue with:

- **Title**: Clear and descriptive title
- **Description**: Detailed explanation of the enhancement
- **Rationale**: Why this enhancement would be useful
- **Implementation ideas**: If you have any ideas on how to implement it

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Add or update tests as needed
5. Ensure all tests pass with `npm test`
6. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification
7. Push to your fork
8. Create a pull request to the `main` branch

## Development Setup

See the [README.md](README.md) file for detailed setup instructions.

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for complex objects
- Use proper typing for function parameters and return values

```typescript
// Good
function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

// Bad
function calculateTotal(prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}
```

### React

- Use functional components with hooks
- Split complex components into smaller ones
- Use the appropriate hooks for different use cases

```typescript
// Good
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <UserDetails user={user} />
    </div>
  );
};

// Bad
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <div>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Address: {user.address}</p>
        {/* Too many details in one component */}
      </div>
    </div>
  );
};
```

### Tailwind CSS

- Use Tailwind utility classes directly in components
- For complex or repeated styles, consider extracting them to the `globals.css` file

```jsx
// Good
<button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
  Submit
</button>

// If repeated, add to globals.css
// .btn-primary { @apply px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark; }
// Then use:
<button className="btn-primary">Submit</button>
```

### Testing

- Write tests for all new features
- Test component rendering, user interactions, and any logic
- Use mock functions and data as needed

## Git Workflow

1. Create a feature branch from `main` with a descriptive name:
   ```
   git checkout -b feature/add-template-export
   ```

2. Make your changes, commit them with descriptive messages:
   ```
   git commit -m "feat: add template export functionality"
   ```

3. Keep your branch updated with the latest changes from `main`:
   ```
   git fetch origin
   git rebase origin/main
   ```

4. Push your changes to your fork:
   ```
   git push origin feature/add-template-export
   ```

5. Create a pull request to the `main` branch of the original repository

## Release Process

The release process is handled by the maintainers using the release script. See the [README.md](README.md) for details.

## Questions?

If you have any questions or need help with the contribution process, please open an issue or contact the maintainers.

Thank you for contributing to Archimind Chrome Extension!