# Personal Portfolio Website MVP Catalyst by Clever Coding (Steve Moon)

- [Clever Coding](https://clevercoding.com/)


A modern, responsive personal portfolio website built with React, TypeScript, and Neumorphic design principles. This portfolio showcases your projects, blog posts, and personal information in an elegant, soft-touch interface.

## 🌟 Features

- **Modern Design**: Clean, neumorphic UI with soft shadows and elegant transitions
- **Responsive Layout**: Fully responsive design that works on all devices
- **Portfolio Showcase**: Display your projects with detailed project pages
- **Blog System**: Share your thoughts and expertise with a built-in blog feature
- **Admin Dashboard**: Manage content through an intuitive admin interface
- **Contact Form**: Allow visitors to get in touch with you
- **SEO Friendly**: Optimized structure for better search engine visibility

## 📋 Pages

- **Home**: Featuring a hero section, skills overview, and introduction
- **About**: Detailed information about your experience, education, and skills
- **Projects**: Gallery of your work with filterable categories
- **Project Detail**: In-depth view of individual projects with image galleries
- **Blog**: List of your articles and insights
- **Blog Detail**: Full article view with related posts
- **Contact**: Contact form and information
- **Admin**: Protected area for content management (projects and blog posts)

## 🛠️ Technology Stack

- **Frontend**:
  - React 18+
  - TypeScript
  - React Router for navigation
  - TailwindCSS for styling
  - shadcn/ui components
  - Lucide React for icons

- **Build & Development**:
  - Vite for fast builds and development
  - SWC for compilation

- **UI/UX**:
  - Custom neumorphic design system
  - Responsive design principles
  - Smooth animations and transitions

## 📚 Documentation

This project includes comprehensive documentation to help you get started and understand the codebase:

- [Developer Guide](./DEVELOPER-GUIDE.md) - Quick start guide for developers
- [Technical Documentation](./DOCUMENTATION.md) - Detailed technical documentation
- [Networking Guide](./NETWORKING-GUIDE.md) - Guide for using and extending the API architecture
- [Development Log](./documents/FRONTEND-DEV-LOG.md) - Ongoing development log

## 📝 Development Logging

**IMPORTANT**: All developers must maintain the development log in [FRONTEND-DEV-LOG.md](./documents/FRONTEND-DEV-LOG.md). This log serves as a critical record of:

- Key implementation decisions
- Major changes to architecture or design
- Bug fixes and their root causes
- Feature additions or modifications
- Problems encountered and their solutions
- Performance improvements

Update the log with dated entries as you make changes. This practice helps with knowledge sharing, onboarding new developers, and troubleshooting.

## 📋 Git Commit Conventions

When contributing to the frontend portion of this project, please use the following commit message format to maintain consistency and clarity in the git history.

```
<type>(<scope>): <subject>
// blank line
<body>
// blank line
<footer>
```

### Commit Structure

- **Header** is mandatory, while **Body** and **Footer** are optional
- No line should exceed 72 characters to avoid automatic line breaks

### Types

- `feat`: New feature (e.g., new component, page or functionality)
- `fix`: Bug fix (e.g., visual glitch, responsive issue, state management bug)
- `docs`: Documentation changes (e.g., component docs, comments)
- `style`: Visual styling changes, CSS/Tailwind updates
- `refactor`: Code refactoring (e.g., component restructuring)
- `perf`: Performance improvements
- `test`: Adding/updating tests (e.g., component tests, E2E tests)
- `chore`: Build process, dependency or tool changes (e.g., Vite config)
- `ui`: UI component updates or Neumorphic design improvements
- `a11y`: Accessibility improvements

### Scopes (Frontend-Specific)

- `components`: Reusable UI components
- `pages`: Page components
- `hooks`: Custom React hooks
- `store`: State management
- `api`: API integration or service functions
- `styles`: CSS/Tailwind styles
- `utils`: Utility functions
- `types`: TypeScript types/interfaces
- `assets`: Images, icons, or other static assets
- `config`: Configuration files
- `deps`: Dependencies
- `routes`: Routing related changes
- `auth`: Authentication-related code

### Examples

```
feat(components): Add NeumorphicCard component

Create a reusable neumorphic card component with customizable shadow depth,
radius, and hover states. Implemented component uses compound pattern 
to provide:
- CardHeader
- CardContent
- CardFooter subcomponents

Addresses #45
```

```
fix(pages): Resolve project gallery layout on mobile devices

Fixed the grid layout issues on the Projects page that caused overflow 
on mobile screens under 375px width. Updated responsive breakpoints and
adjusted card sizing.
```

```
refactor(hooks): Convert useProjects to use React Query

Migrated the custom useProjects hook from manual fetch implementation
to React Query for better caching, refetching, and error handling.
Added loading states and error feedback.
```

## 🚀 Getting Started

For installation instructions and development workflow, see the [Developer Guide](./DEVELOPER-GUIDE.md).

## 🔧 Configuration

- Update the personal information in `src/data/` directory
- Replace placeholder images with your own in `public/`
- Customize colors and styling in `tailwind.config.ts`

### Environment Variables

The application supports the following environment variables:

- `VITE_USE_MOCK_DATA`: Set to `true` to use mock API data instead of real API endpoints (defaults to `true`)

To set up environment variables:

1. Create a `.env` file in the frontend directory (you can copy from `.env.example`)
2. Set the variables according to your needs

For detailed customization options, refer to the [Technical Documentation](./DOCUMENTATION.md#customization-guide).

## 📦 Deployment

Build the project for production:

```bash
npm run build
# or
yarn build
```

Deploy the `dist` directory to your hosting provider of choice.

## 💡 Customization

For detailed customization options, see the [Technical Documentation](./DOCUMENTATION.md#customization-guide).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 AI Tools Used
- [Lovable](https://lovable.dev/)
- [Cursor](https://cursor.com/)
- [Midjourney](https://midjourney.com/)
- [ChatGPT](https://chatgpt.com/)

## 🤖 Cursor Rules for AI

This project uses Cursor's Rules for AI feature to maintain consistent coding standards. For details, see the [.cursor file](./.cursorrules).

## 🙏 Acknowledgements
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Cursor](https://cursor.com/)

---

Created with ❤️ by [Steve Moon]
