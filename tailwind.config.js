/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'], // Sci-fi font
                sans: ['Inter', 'sans-serif'], // Modern UI font
                display: ['"ABC ROM Black"', 'sans-serif'], // Hero font (simulated with Inter Black Italic)
            },
            colors: {
                multivac: {
                    black: '#10151A',
                    green: '#DBFF00',
                    gray: '#1A1F26',
                },
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    900: '#164e63',
                }
            },
            backgroundImage: {
                'hero-glow': 'radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, rgba(16, 21, 26, 0) 70%)',
            }
        },
    },
    plugins: [],
}
