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

This project uses Cursor's Rules for AI feature to maintain consistent coding standards, architecture, and development practices. The rules are structured in the following way:

- Root-level `.cursor` file: Contains high-level project guidelines and references to component-specific rules
- `/frontend/.cursor`: Contains detailed frontend development rules
- `/backend/.cursor`: Contains detailed backend development rules

These rules help guide AI assistants to follow project-specific conventions and ensure consistency across the codebase.

### How Cursor Rules Work

Rules for AI contain guidelines, patterns, and instructions for AI to follow when generating or modifying code. These rules help ensure:

- Consistent code style and formatting
- Adherence to project architecture
- Following best practices for specific technologies
- Implementing proper design patterns

### Frontend-Specific Rules

The frontend rules in this project cover:

- React component structure and organization
- TypeScript best practices
- Neumorphic design implementation with Tailwind CSS
- Performance optimization
- Accessibility compliance
- API integration patterns
- Error handling strategies

### Backend-Specific Rules

The backend rules cover:

- Express.js and Node.js best practices
- Sequelize ORM usage
- API endpoint design
- Authentication and security
- Error handling
- Database interactions

### Project-Wide Rules

The root-level rules address:

- Cross-cutting concerns
- API integration between frontend and backend
- Deployment considerations
- Security guidelines
- Performance considerations
- Git workflow guidelines

For more information, check out the [Cursor Rules for AI Documentation](https://docs.cursor.com/context/rules-for-ai).

## 🙏 Acknowledgements
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Cursor](https://cursor.com/)

---

Created with ❤️ by [Steve Moon]
