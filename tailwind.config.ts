import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				neu: {
					'bg': '#f0f0f3',
					'accent': '#4A90E2',
					'accent-hover': '#3A80D2',
					'text': '#333333',
					'text-secondary': '#666666',
					'border': '#C8C8C9',  // Added the missing neu-border color
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out'
			},
			boxShadow: {
				// Light mode neumorphic shadows
				'neu-flat': '5px 5px 10px #d1d1d4, -5px -5px 10px #ffffff',
				'neu-pressed': 'inset 3px 3px 7px #d1d1d4, inset -3px -3px 7px #ffffff',
				'neu-convex': '5px 5px 10px #d1d1d4, -5px -5px 10px #ffffff, inset 1px 1px 1px #ffffff, inset -1px -1px 1px #d1d1d4',
				// Enhanced tag shadows for better 3D effect
				'neu-tag': 'inset 2px 2px 5px #d1d1d4, inset -2px -2px 5px #ffffff, 1px 1px 3px rgba(255, 255, 255, 0.5)',
				// Dark mode neumorphic shadows - toned down
				'dark-neu-flat': '3px 3px 6px #181825, -3px -3px 6px #252533',
				'dark-neu-pressed': 'inset 2px 2px 5px #181825, inset -2px -2px 5px #252533',
				'dark-neu-convex': '3px 3px 6px #181825, -3px -3px 6px #252533, inset 1px 1px 1px #252533, inset -1px -1px 1px #181825',
				// Enhanced dark mode tag shadows with more contrast and depth
				'dark-neu-tag': 'inset 3px 3px 6px #151520, inset -2px -2px 5px #2a2a3a, 1px 1px 2px rgba(37, 37, 51, 0.7)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
