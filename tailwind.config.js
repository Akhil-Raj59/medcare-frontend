/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "#F7F7F7",
          primary: "#2196F3",
          secondary: "#1E88E5",
          accent: "#1976D2",
          text: {
            light: "#FFFFFF",
            dark: "#333333",
          },
        },
        keyframes: {
          gradient: {
            "0%, 100%": {
              "background-size": "300% 300%",
              "background-position": "0% 50%",
            },
            "50%": {
              "background-size": "300% 300%",
              "background-position": "100% 50%",
            },
          },
          floating: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          glowPulse: {
            "0%, 100%": { boxShadow: "0 0 5px rgba(33, 150, 243, 0.3)" },
            "50%": { boxShadow: "0 0 20px rgba(33, 150, 243, 0.6)" },
          },
          pulseGradient: {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.7 },
          },
        },
        animation: {
          gradient: "gradient 15s ease infinite",
          floating: "floating 3s ease-in-out infinite",
          glowPulse: "glowPulse 2s ease-in-out infinite",
          pulseGradient: "pulseGradient 2s ease infinite",
        },
        boxShadow: {
          "blue-glow": "0 0 15px rgba(33, 150, 243, 0.3)",
          "blue-intense": "0 0 25px rgba(33, 150, 243, 0.5)",
        },
      },
    },
    plugins: [],
  };
  