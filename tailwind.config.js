/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Template-aware colors
        'template-primary': "rgb(var(--color-primary) / <alpha-value>)",
        'template-primary-hover': "rgb(var(--color-primary-hover) / <alpha-value>)",
        'template-primary-light': "rgb(var(--color-primary-light) / <alpha-value>)",
        'template-secondary': "rgb(var(--color-secondary) / <alpha-value>)",
        'template-secondary-hover': "rgb(var(--color-secondary-hover) / <alpha-value>)",
        'template-secondary-light': "rgb(var(--color-secondary-light) / <alpha-value>)",
        'template-background': "rgb(var(--color-background) / <alpha-value>)",
        'template-background-secondary': "rgb(var(--color-background-secondary) / <alpha-value>)",
        'template-background-accent': "rgb(var(--color-background-accent) / <alpha-value>)",
        'template-text-primary': "rgb(var(--color-text-primary) / <alpha-value>)",
        'template-text-secondary': "rgb(var(--color-text-secondary) / <alpha-value>)",
        'template-text-muted': "rgb(var(--color-text-muted) / <alpha-value>)",
        'template-border': "rgb(var(--color-border) / <alpha-value>)",
        'template-border-light': "rgb(var(--color-border-light) / <alpha-value>)",
      },
      fontFamily: {
        'template-primary': "var(--font-primary)",
        'template-secondary': "var(--font-secondary)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'template-card': "var(--card-border-radius)",
        'template-button': "var(--button-border-radius)",
      },
      spacing: {
        'template-section': "var(--section-padding)",
        'template-container': "var(--container-padding)",
        'template-element': "var(--element-spacing)",
      },
      boxShadow: {
        'template-sm': "var(--shadow-small)",
        'template-md': "var(--shadow-medium)",
        'template-lg': "var(--shadow-large)",
      },
    },
  },
  plugins: [],
}