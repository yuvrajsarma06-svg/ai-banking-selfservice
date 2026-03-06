# Contributing Guidelines

## Welcome!

Thank you for your interest in contributing to the AI Banking Self-Service Platform! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

**Expected Behavior:**
- Use welcoming and inclusive language
- Be respectful of differing opinions
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### 1. Fork the Repository

```bash
# Create your own fork on GitHub
# Clone your fork locally
git clone https://github.com/YOUR_USERNAME/ai-banking-selfservice.git
cd ai-banking-selfservice

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-banking-selfservice.git
```

### 2. Create a Development Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# Or for bug fixes
git checkout -b bugfix/issue-description
# Or for documentation
git checkout -b docs/description
```

### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Setup pre-commit hooks
npx husky install

# Run tests
npm test

# Run linting
npm run lint
```

## Development Workflow

### Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test addition/modification
- `chore` - Build/dependency updates

**Examples:**
```
feat(auth): add biometric authentication support

fix(conversation): resolve null pointer in NLU processing

docs(api): update authentication endpoint documentation

test(transaction): add test cases for large transfers
```

### Code Style Guide

#### TypeScript/JavaScript

```typescript
// Use descriptive variable names
const userAuthenticationToken = generateJWT(user);

// Use const by default, let if needed
const immutableValue = 42;
let mutableValue = 0;

// Use arrow functions
const greet = (name: string) => `Hello, ${name}`;

// Use async/await
const fetchUser = async (id: string) => {
  try {
    const user = await database.getUser(id);
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    throw error;
  }
};

// Use template literals
const message = `User ${name} logged in at ${timestamp}`;

// Comment complex logic
// Implement exponential backoff for API retries
const calculateDelay = (attempt: number) => 1000 * Math.pow(2, attempt);

// Use type annotations
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Document public functions
/**
 * Authenticate user with credentials
 * @param email - User email
 * @param password - User password
 * @returns JWT token
 * @throws Error if authentication fails
 */
const authenticate = (email: string, password: string): string => {
  // implementation
};
```

#### Python

```python
# Follow PEP 8
def authenticate_user(email: str, password: str) -> str:
    """
    Authenticate user with email and password.
    
    Args:
        email: User email address
        password: User password
        
    Returns:
        JWT authentication token
        
    Raises:
        ValueError: If authentication fails
    """
    user = get_user_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")
    
    return generate_jwt(user)

# Use type hints
from typing import Dict, List, Optional

def process_transactions(
    transactions: List[Dict[str, Any]]
) -> Optional[Dict[str, Any]]:
    pass
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# Format code with Prettier
npm run format

# Run all code quality checks
npm run quality
```

### Testing

**Test Coverage Requirements:**
- Minimum 80% code coverage
- All public functions tested
- Happy path and error cases

```typescript
// Example test structure
describe('AuthService', () => {
  describe('authenticate', () => {
    it('should return JWT token for valid credentials', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      const token = await authService.authenticate(user.email, user.password);
      expect(token).toBeDefined();
      expect(token).toMatch(/^eyJ/); // JWT pattern
    });

    it('should throw error for invalid credentials', async () => {
      expect(
        authService.authenticate('test@example.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should log authentication attempts', async () => {
      const spy = jest.spyOn(logger, 'info');
      await authService.authenticate('test@example.com', 'password');
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('authentication attempt')
      );
    });
  });
});
```

**Run Tests:**
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test auth.test.ts

# Watch mode
npm test -- --watch
```

### Building & Testing Locally

```bash
# Build TypeScript
npm run build

# Start service locally
npm run dev

# Build Docker image
docker build -t banking-ai/api-gateway:latest .

# Run Docker container
docker run -p 5000:5000 banking-ai/api-gateway:latest
```

## Submitting Changes

### Before Submitting a Pull Request

```bash
# Update your branch with latest upstream changes
git fetch upstream
git rebase upstream/main

# Ensure all tests pass
npm test

# Check code coverage
npm run test:coverage

# Run linting
npm run lint

# Build the project
npm run build

# Test in Docker
docker-compose up -d
npm run test:integration
```

### Pull Request Process

1. **Create Pull Request**
   - Click "New Pull Request" on GitHub
   - Select `main` branch as target
   - Fill in the template with:
     - Clear description of changes
     - Related issue(s) (if any)
     - Type of change (feature, fix, docs)
     - Testing performed
     - Checklist items

2. **PR Description Template**
   ```markdown
   ## Description
   Brief description of your changes

   ## Related Issues
   Fixes #123
   Related to #456

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Breaking change

   ## Testing
   Describe testing performed

   ## Checklist
   - [ ] Tests pass locally
   - [ ] Code linting passes
   - [ ] Documentation updated
   - [ ] Commit messages follow convention
   - [ ] No new warnings generated
   ```

3. **Code Review**
   - Address reviewer comments
   - Update code as requested
   - Re-request review when ready

4. **Merge**
   - Ensure all checks pass
   - Squash commits if many small fixes
   - Merge with "Squash and merge"

## Reporting Issues

### Issue Template

```markdown
## Bug Report / Feature Request

### Description
Clear description of the issue

### Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. Step 3

### Expected vs Actual Behavior
**Expected:** What should happen
**Actual:** What actually happens

### Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.0.0]
- Service: [e.g., api-gateway]

### Additional Context
Any additional information that helps

### Logs/Screenshots
Include relevant logs or screenshots
```

## Documentation

### Adding Documentation

- All new features must have corresponding documentation
- Update README.md if user-facing changes
- Update API.md for API changes
- Add code comments for complex logic
- Use JSDoc/TSDoc for public functions

### Documentation Standards

```typescript
/**
 * Processes a bank transaction
 * 
 * @param transaction - The transaction to process
 * @param options - Processing options
 * @returns Promise resolving to transaction result
 * @throws {ValidationError} If transaction is invalid
 * @throws {InsufficientFundsError} If account lacks funds
 * 
 * @example
 * const result = await processTransaction(transaction, { 
 *   requireApproval: true 
 * });
 */
async function processTransaction(
  transaction: Transaction,
  options?: TransactionOptions
): Promise<TransactionResult> {
  // implementation
}
```

## Performance Considerations

When contributing code:

1. **Database Queries**
   - Use indexes for frequently queried columns
   - Avoid N+1 queries (use joins)
   - Implement pagination for large result sets

2. **API Performance**
   - Implement caching where appropriate
   - Use compression for responses
   - Optimize response payloads

3. **Memory Usage**
   - Avoid memory leaks with proper cleanup
   - Use streams for large data
   - Profile memory usage

## Security Considerations

When contributing code:

1. **Input Validation**
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize output

2. **Authentication/Authorization**
   - Verify permissions on every action
   - Use secure password hashing
   - Implement rate limiting

3. **Data Protection**
   - Encrypt sensitive data
   - Don't log sensitive information
   - Use environment variables for secrets

4. **Dependencies**
   - Check for vulnerabilities: `npm audit`
   - Update dependencies regularly
   - Avoid dependencies with security issues

## Helpful Resources

- [Project Boards](https://github.com/orgs/banking-ai/projects)
- [Discussions](https://github.com/banking-ai/ai-banking-selfservice/discussions)
- [Wiki Documentation](https://github.com/banking-ai/ai-banking-selfservice/wiki)
- [Issue Templates](.github/ISSUE_TEMPLATE/)

## Questions?

- Check existing documentation first
- Search open/closed issues
- Ask in GitHub Discussions
- Contact maintainers: maintainers@banking-ai.com

## Thank You!

Your contributions make this project better for everyone. Thank you for helping!
