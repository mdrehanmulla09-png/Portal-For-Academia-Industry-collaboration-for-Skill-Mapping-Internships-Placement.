/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Redesigned human-centered public sector palette
        brand: {
          teal: '#245C56',
          tealDark: '#1B4742',
          tealLight: '#EBF2F1',
          terracotta: '#B96D4D',
          terracottaDark: '#A35D3F',
          terracottaLight: '#F8F1EE',
          navy: '#162332',
          navyLight: '#223246',
        },
        surface: {
          canvas: '#F7F6F2',
          card: '#FFFFFF',
          subtle: '#F2EFE9',
          border: '#E5E1D9',
          borderDark: '#D0CBC0',
        },
        content: {
          primary: '#252B32',
          secondary: '#667085',
          muted: '#8C95A6',
        },
        status: {
          success: '#2E6B4A',
          successBg: '#F0F5F2',
          successBorder: '#D1E3D8',
          warning: '#965814',
          warningBg: '#FCF6EC',
          warningBorder: '#F0DFBE',
          error: '#9E2A2B',
          errorBg: '#FDF2F2',
          errorBorder: '#F5D0D0',
          info: '#2C4A6F',
          infoBg: '#F0F4F8',
          infoBorder: '#D3DFEE',
        },
        // Backward-compatibility aliases
        gov: {
          navy: '#162332',
          navyLight: '#223246',
          saffron: '#B96D4D',
          saffronLight: '#F8F1EE',
          green: '#2E6B4A',
          greenLight: '#F0F5F2',
          gold: '#965814',
          grayBg: '#F7F6F2',
          cardBorder: '#E5E1D9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
      }
    },
  },
  plugins: [],
}
