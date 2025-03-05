# Developer Quick-Start Guide

Welcome to the Personal Portfolio Website project! This guide will help you get up and running quickly with development.

> **Related Documentation**:
> - [Main README](./README.md) - Project overview and features
> - [Technical Documentation](./DOCUMENTATION.md) - Detailed technical specifications
> - [Networking Guide](./NETWORKING-GUIDE.md) - API architecture guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-portfolio.git
cd personal-portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The development server will start at http://localhost:8080.

## 📝 Development Logging

**IMPORTANT**: All developers must maintain the [development log](./documents/FRONTEND-DEV-LOG.md) as you work. This practice is critical for:

- Documenting implementation decisions
- Tracking architectural changes
- Recording bug fixes and workarounds
- Noting API integrations
- Sharing knowledge with team members

When adding to the log, create a new dated entry with a brief title describing the change or decision, then provide relevant details and reasoning. For example:

```md
## 2023-05-15: Implemented Neumorphic Button Component

Created a reusable neumorphic button component with three variants:
- Primary
- Secondary
- Outline

Decision: Used compound components pattern to allow for flexible content and icons
Challenge: Fixed accessibility contrast issues by adjusting shadow intensity
```

## 📁 Project Structure Overview

```
src/
├── components/   # UI components organized by feature
├── pages/        # Top-level page components
├── data/         # Mock data files
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
└── utils/        # Additional utilities
```

For more detailed architecture information, see the [Technical Documentation](./DOCUMENTATION.md#architecture-overview).

### Key Files

- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - TailwindCSS and design system configuration

## 🛠️ Development Workflow

### Code Organization

1. **Components**: Create reusable components in the appropriate feature folder
2. **Pages**: Assemble components into full pages
3. **Data**: Mock data is in `src/data/` directory

For API integration, refer to the [Networking Guide](./NETWORKING-GUIDE.md).

### Design System

- The project uses a neumorphic design system
- Use the `NeumorphicCard` and `NeumorphicButton` components for consistent styling
- Pre-defined utility classes:
  - `neu-flat`
  - `neu-pressed`
  - `neu-convex`

For more details on the design system, see the [Technical Documentation](./DOCUMENTATION.md#design-system).

### Adding New Features

1. Create needed components in the appropriate directories
2. Update or add pages if needed
3. Add routes in App.tsx if creating new pages
4. Update mock data if necessary
5. **Document your changes** in the [development log](./documents/FRONTEND-DEV-LOG.md)

## 🧪 Testing

Current testing tools:
- ESLint for static code analysis

Run linting:
```bash
npm run lint
# or
yarn lint
```

## 🏗️ Building for Production

```bash
npm run build
# or
yarn build
```

The production build will be in the `dist` directory.

## 🔑 Common Tasks

### Modifying Personal Information

1. Update name and title in `src/components/home/Hero.tsx`
2. Update about information in `src/components/about/AboutMe.tsx`

### Adding a New Project

1. Add project data to the projects data file
2. Create project images in the public directory

### Adding a Blog Post

1. Add blog post data to the blog data file
2. Add blog images to the public directory

### Customizing Styling

1. Edit colors and shadows in `tailwind.config.ts`
2. Modify component styles in their respective files

## 🚧 Common Issues & Solutions

### Styling Issues

**Problem**: Component styling doesn't match the neumorphic design
**Solution**: Make sure to use the neumorphic utility classes (`neu-flat`, `neu-pressed`, `neu-convex`)

### TypeScript Errors

**Problem**: Type errors when working with component props
**Solution**: Check the interface definitions and make sure props match expected types

### Path Import Issues

**Problem**: Import errors with `@/` paths
**Solution**: The `@/` alias resolves to the `src/` directory. Make sure paths are relative to src.

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contribution Guidelines

1. Create a branch for your feature or fix
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Get approval from at least one other team member
6. **Document your contribution** in the [development log](./documents/FRONTEND-DEV-LOG.md)

---

Happy coding! If you have any questions, please reach out to the project maintainers. 