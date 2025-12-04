# Contributing to APS Performance Assistant

Thank you for your interest in contributing! We are dedicated to building a high-quality, evidence-based tool for the APS.

## Code of Conduct

Please interact with respect and professionalism. We follow the standard [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## How to Contribute

1.  **Fork the repository**.
2.  **Create a feature branch**: `git checkout -b feature/amazing-feature`
3.  **Commit your changes**: `git commit -m 'Add some amazing feature'`
4.  **Push to the branch**: `git push origin feature/amazing-feature`
5.  **Open a Pull Request**.

## Development Guidelines

### Code Style
-   **Frontend**: We use Prettier and ESLint. Run `npm run lint` before committing.
-   **Backend**: We follow PEP 8. Use `black` for formatting and `ruff` for linting.
-   **Types**: TypeScript strict mode is enabled. Avoid `any`. Python type hints are required for all functions.

### Design System
-   Follow the `VISUAL_DESIGN_SYSTEM.md`.
-   Use Tailwind utility classes over custom CSS where possible.
-   Ensure all new components support both Light and Dark modes.

### Testing
-   Write unit tests for new utility functions.
-   Write integration tests for new API endpoints.
-   Ensure `npm test` and `pytest` pass before pushing.

## Reporting Bugs

Please open an Issue on GitHub with:
1.  A clear title.
2.  Steps to reproduce.
3.  Expected vs. actual behavior.
4.  Screenshots if applicable.
