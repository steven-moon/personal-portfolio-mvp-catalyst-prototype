export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

// Blog posts data
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React in 2023",
    excerpt: "A comprehensive guide to modern React development practices, state management, and component patterns for beginners and experienced developers alike.",
    content: `
      <p>React has evolved significantly since its release, and staying up to date with best practices is essential for any developer working with this library. In this article, we'll explore the most important concepts and tools in the React ecosystem in 2023.</p>
      
      <h2>Embracing Functional Components</h2>
      <p>Class components are now considered legacy code in many React projects. Functional components, combined with Hooks, provide a more concise and maintainable way to write React applications.</p>
      
      <pre><code>// Modern React component
const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};</code></pre>

      <h2>State Management in 2023</h2>
      <p>While Redux remains popular, many developers are now choosing alternatives like React Query for server state, and simpler solutions like Context API or Zustand for client state.</p>
      
      <h2>React 18 and Concurrent Features</h2>
      <p>React 18 introduced several new features, including automatic batching, concurrent rendering, and transitions. These features help improve the performance and user experience of React applications.</p>
      
      <h2>Conclusion</h2>
      <p>Modern React development is all about embracing functional programming concepts, leveraging the powerful Hook system, and using the right tools for state management. By following these principles, you can build maintainable and performant applications.</p>
    `,
    date: "May 15, 2023",
    author: "Jane Doe",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "The Future of UI Design: Neumorphism Explained",
    excerpt: "Explore the evolution of Neumorphism as a design trend, its principles, best practices, and how to implement it in your web projects.",
    content: `
      <p>Neumorphism (or Soft UI) is a visual style that combines elements of skeuomorphism and flat design. It creates soft, extruded plastic-like interfaces that appear to be connected to the background.</p>
      
      <h2>Key Principles of Neumorphism</h2>
      <p>The main characteristics of neumorphic design include:</p>
      <ul>
        <li>Subtle shadows and highlights to create the illusion of extrusion</li>
        <li>Monochromatic color schemes with low contrast</li>
        <li>Soft edges and rounded corners</li>
        <li>Minimal use of colors and gradients</li>
      </ul>
      
      <h2>Implementing Neumorphism with CSS</h2>
      <p>Creating the neumorphic effect primarily relies on cleverly implemented box-shadows:</p>
      
      <pre><code>.neumorphic {
  border-radius: 50px;
  background: #e0e0e0;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
}</code></pre>

      <h2>Accessibility Considerations</h2>
      <p>While visually appealing, neumorphic designs often struggle with accessibility due to low contrast. It's important to ensure sufficient contrast between elements for users with visual impairments.</p>
      
      <h2>When to Use Neumorphism</h2>
      <p>Neumorphism works best for specific UI components rather than entire interfaces. Consider using it for buttons, cards, and form elements to create visual interest without overwhelming the user.</p>
      
      <h2>The Future of Neumorphism</h2>
      <p>As with any design trend, neumorphism continues to evolve. We're seeing it combined with other styles and adapted to improve accessibility while maintaining its distinct aesthetic appeal.</p>
    `,
    date: "June 22, 2023",
    author: "Jane Doe",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "TypeScript Tips for Better Code Quality",
    excerpt: "Learn advanced TypeScript techniques to improve your code quality, catch bugs early, and enhance developer experience in large-scale applications.",
    content: `
      <p>TypeScript has become the standard for building robust JavaScript applications. In this article, we'll explore advanced techniques to leverage TypeScript's type system for better code quality.</p>
      
      <h2>Strict Type Checking</h2>
      <p>Always enable strict mode in your TypeScript configuration to catch more potential issues:</p>
      
      <pre><code>// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    // Other options...
  }
}</code></pre>

      <h2>Discriminated Unions</h2>
      <p>Discriminated unions are a powerful pattern for modeling state in TypeScript:</p>
      
      <pre><code>type LoadingState = { status: 'loading' };
type SuccessState = { 
  status: 'success';
  data: User[];
};
type ErrorState = { 
  status: 'error';
  error: Error;
};

type State = LoadingState | SuccessState | ErrorState;

function handleState(state: State) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserList users={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}</code></pre>

      <h2>Utility Types</h2>
      <p>TypeScript provides several utility types that can help make your code more maintainable:</p>
      
      <pre><code>interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Create a type with only some properties
type UserCredentials = Pick<User, 'email' | 'role'>;

// Create a type with certain properties removed
type PublicUser = Omit<User, 'id'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Extract the type of an array element
type Users = User[];
type SingleUser = Users[number];</code></pre>

      <h2>Using Generic Constraints</h2>
      <p>Generic constraints allow you to write more flexible yet type-safe functions:</p>
      
      <pre><code>interface Entity {
  id: number;
}

function findById<T extends Entity>(
  entities: T[],
  id: number
): T | undefined {
  return entities.find(entity => entity.id === id);
}</code></pre>

      <h2>Conclusion</h2>
      <p>By leveraging TypeScript's advanced features, you can significantly improve the reliability and maintainability of your codebase while enhancing the developer experience.</p>
    `,
    date: "July 8, 2023",
    author: "Jane Doe",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Building Responsive Layouts with Tailwind CSS",
    excerpt: "A deep dive into creating modern, responsive layouts using Tailwind CSS. From basic grids to complex components, all with minimal custom CSS.",
    content: `
      <p>Tailwind CSS has revolutionized the way developers approach CSS by providing a utility-first framework that makes it easy to build custom designs without leaving your HTML.</p>
      
      <h2>The Power of Utility Classes</h2>
      <p>Unlike traditional CSS frameworks, Tailwind doesn't provide pre-built components. Instead, it gives you low-level utility classes that let you build completely custom designs:</p>
      
      <pre><code>&lt;button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"&gt;
  Button
&lt;/button&gt;</code></pre>

      <h2>Responsive Design Made Easy</h2>
      <p>Tailwind makes responsive design intuitive with responsive variants that let you apply different styles at different breakpoints:</p>
      
      <pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
  &lt;!-- Content --&gt;
&lt;/div&gt;</code></pre>

      <h2>Creating a Responsive Navigation Bar</h2>
      <p>Here's how you can create a responsive navigation bar with Tailwind:</p>
      
      <pre><code>&lt;nav class="bg-white shadow"&gt;
  &lt;div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"&gt;
    &lt;div class="flex justify-between h-16"&gt;
      &lt;div class="flex"&gt;
        &lt;div class="flex-shrink-0 flex items-center"&gt;
          &lt;img class="h-8 w-auto" src="/logo.svg" alt="Logo"&gt;
        &lt;/div&gt;
        &lt;div class="hidden sm:ml-6 sm:flex sm:space-x-8"&gt;
          &lt;a href="#" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"&gt;
            Home
          &lt;/a&gt;
          &lt;!-- More links --&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="sm:hidden"&gt;
        &lt;!-- Mobile menu button --&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/nav&gt;</code></pre>

      <h2>Customizing Your Theme</h2>
      <p>Tailwind is highly customizable through its configuration file:</p>
      
      <pre><code>// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': '#3490dc',
        'brand-dark': '#2779bd',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
}</code></pre>

      <h2>Conclusion</h2>
      <p>Tailwind CSS offers a powerful approach to styling that can dramatically improve your development workflow. By embracing its utility-first philosophy, you can build complex, responsive layouts more efficiently than ever before.</p>
    `,
    date: "August 14, 2023",
    author: "Jane Doe",
    category: "CSS",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
  }
];
