# Contributing to ZADMIN Video Downloader

Thank you for considering contributing to ZADMIN Video Downloader! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been requested
- Provide a clear use case
- Explain why this feature would be useful
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test your changes**: Ensure the app builds and works
5. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/zgr2575/ZADMIN-Downloader.git
cd ZADMIN-Downloader

# Install dependencies
npm install

# Install yt-dlp
pip install yt-dlp

# Run development server
npm run dev
```

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

Before submitting:
- Test the build: `npm run build`
- Test in development: `npm run dev`
- Test the demo mode
- Verify no console errors

### Areas for Contribution

We especially welcome contributions in:

1. **UI/UX Improvements**
   - Better mobile responsiveness
   - Accessibility improvements
   - Animation and transitions
   - Dark mode enhancements

2. **Features**
   - Playlist download support
   - Batch download functionality
   - Download history
   - Progress tracking
   - Resume interrupted downloads

3. **Performance**
   - Caching mechanisms
   - Optimized video processing
   - Better error handling
   - Load time improvements

4. **Documentation**
   - Improve README
   - Add code comments
   - Create tutorials
   - Add examples

5. **Backend**
   - Alternative file hosting options
   - Database integration
   - User authentication
   - Rate limiting

6. **SEO**
   - Content optimization
   - Additional metadata
   - Schema.org enhancements

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add playlist download support
Fix video info parsing error
Update README with deployment instructions
Improve mobile UI responsiveness
```

### Questions?

Feel free to open an issue with the "question" label if you need help!

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
