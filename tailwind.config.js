/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500 - matches mobile
          dark: '#059669',    // Emerald 600
          light: '#34D399',   // Emerald 400
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue 500 - matches mobile
          dark: '#2563EB',    // Blue 600
          light: '#60A5FA',   // Blue 400
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber 500 - matches mobile
          dark: '#D97706',    // Amber 600
          light: '#FCD34D',   // Amber 300
        },
        background: '#FFFFFF',      // White background - LIGHT THEME
        surface: '#F9FAFB',        // Light gray surface - matches mobile
        'surface-light': '#FFFFFF', // White for cards
        'surface-hover': '#F3F4F6', // Subtle hover
        border: '#E5E7EB',         // Light border - matches mobile
        'text-primary': '#111827',  // Dark text - LIGHT THEME
        'text-secondary': '#6B7280',// Gray text - matches mobile
        'text-muted': '#9CA3AF',    // Muted text - matches mobile
        success: '#10B981',     // Emerald 500
        warning: '#F59E0B',     // Amber 500
        error: '#EF4444',       // Red 500
        info: '#3B82F6',        // Blue 500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
