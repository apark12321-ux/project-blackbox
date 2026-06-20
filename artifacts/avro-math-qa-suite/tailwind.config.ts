import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        avro: {
          ink: "#020617",
          panel: "#0f172a",
          line: "#1e293b",
          blue: "#38bdf8",
          green: "#34d399"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(56, 189, 248, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
