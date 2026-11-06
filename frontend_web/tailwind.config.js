/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cps: {
          primary: '#007B6D',          // Verde Institucional CPS (RGB: 0, 123, 109)
          'primary-dark': '#006459',   // Hover y fondos oscuros
          'primary-darker': '#004D44', // Sombras y bordes profundos
          'primary-light': '#009688',  // Variantes activas
          secondary: '#4DB6AC',        // Teal claro / Acento
          accent: '#80CBC4',           // Acento suave
          bg: '#F0F4F3',              // Gris-verde sutil de fondo
          text: '#1A2332',            // Texto principal oscuro
          danger: '#EF4444',          // Rojo alertas / vencimientos
          warning: '#F59E0B',         // Ámbar precaución
          surface: '#FFFFFF',         // Superficies blancas
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 123, 109, 0.06), 0 1px 2px -1px rgba(0, 123, 109, 0.06)',
        'card-hover': '0 8px 25px -5px rgba(0, 123, 109, 0.12), 0 4px 12px -2px rgba(0, 123, 109, 0.08)',
        'sidebar': '4px 0 24px -2px rgba(0, 77, 68, 0.3)',
      },
    },
  },
  plugins: [],
}
