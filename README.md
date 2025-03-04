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

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-portfolio.git
   cd personal-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## 🔧 Configuration

- Update the personal information in `src/data/` directory
- Replace placeholder images with your own in `public/`
- Customize colors and styling in `tailwind.config.ts`

## 📦 Deployment

Build the project for production:

```bash
npm run build
# or
yarn build
```

Deploy the `dist` directory to your hosting provider of choice.

## 🧩 Project Structure

```
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── about/        # About page components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── blog/         # Blog related components
│   │   ├── contact/      # Contact form components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components (navbar, footer)
│   │   ├── projects/     # Project related components
│   │   └── ui/           # Generic UI components
│   ├── data/             # Mock data and content
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 💡 Customization

### Changing Content

- Edit personal information in `src/data/` files
- Update projects in the projects data file
- Modify blog posts in the blog data file

### Styling Changes

- The project uses a custom neumorphic design system
- Adjust the color scheme in `tailwind.config.ts`
- Modify the neumorphic shadows in `tailwind.config.ts`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 AI Tools Used
- [Lovable](https://lovable.dev/)
- [Cursor](https://cursor.com/)
- [Midjourney](https://midjourney.com/)
- [ChatGPT](https://chatgpt.com/)

## 🤖 Cursor Rules for AI

This project uses Cursor's Rules for AI feature to maintain consistent coding standards, architecture, and development practices. Rules are located in the `.cursor/rules` directory and help guide AI assistants to follow project-specific conventions.

### How Cursor Rules Work

Rules for AI are markdown files (`.mdc`) that contain guidelines, patterns, and instructions for AI to follow when generating or modifying code. These rules help ensure:

- Consistent code style and formatting
- Adherence to project architecture
- Following best practices for specific technologies
- Implementing proper design patterns

Rules can be applied to specific file patterns using glob patterns and can be set to always apply or only when relevant.

### Example Rules in This Project

1. **General Rules** - Overall coding standards for the project:
   ```
   # Description: General coding guidelines for the Personal Portfolio MVP
   # Globs: *.*

   ## General Project Guidelines
   - This is a React 18+ TypeScript project built with Vite, TailwindCSS, and shadcn/ui components
   - Follow modern React practices using functional components and hooks
   - Use TypeScript for type safety
   ...
   ```

2. **Tailwind Rules** - Styling guidelines for consistency:
   ```
   # Description: Tailwind CSS and styling guidelines for the Personal Portfolio MVP
   # Globs: **/*.tsx, **/*.css

   ## Tailwind Usage
   - Use Tailwind utility classes for styling
   - Follow the mobile-first responsive design approach
   - Use Tailwind's color system consistently
   ...
   ```

3. **Component Rules** - React component architecture and patterns:
   ```
   # Description: Guidelines for React components in the Personal Portfolio MVP
   # Globs: src/components/**/*.tsx, src/pages/**/*.tsx

   ## Component Structure
   - Follow a consistent folder structure for components
   - Group related components in the same directory
   - Keep component files small and focused
   ...
   ```

### Creating Your Own Rules

To create or modify rules manually:

1. Create a `.mdc` file in the `.cursor/rules` directory using this command

```
echo "# Description: Guidelines for maintaining Cursor rules" > .cursor/rules/rule_maintenance.mdc && echo "# Globs: .cursor/rules/**/*.mdc" >> .cursor/rules/rule_maintenance.mdc && echo "" >> .cursor/rules/rule_maintenance.mdc && echo "## Rule Maintenance Guidelines" >> .cursor/rules/rule_maintenance.mdc && echo "- Keep Cursor rules up to date with project changes" >> .cursor/rules/rule_maintenance.mdc && echo "- Review and update rules periodically" >> .cursor/rules/rule_maintenance.mdc && echo "- Update rules when adding new technologies or patterns" >> .cursor/
```

2. Write guidelines as markdown sections and bullet points
3. Restart Cursor or reload the rules

For more information, check out the [Cursor Rules for AI Documentation](https://docs.cursor.com/context/rules-for-ai).

## 🙏 Acknowledgements
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)

---

Created with ❤️ by [Your Name]
