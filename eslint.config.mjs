import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Dependencies
      "node_modules/**",
      
      // Generated files
      ".next/**",
      "src/generated/**",
      "out/**",
      
      // Build outputs
      "dist/**",
      "build/**",
      
      // Environment variables
      ".env",
      ".env.local",
      ".env.development.local", 
      ".env.test.local",
      ".env.production.local",
      
      // OS generated files
      ".DS_Store",
      ".DS_Store?",
      "._*",
      ".Spotlight-V100",
      ".Trashes",
      "ehthumbs.db",
      "Thumbs.db",
      
      // Logs
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*", 
      "yarn-error.log*",
      
      // Coverage directory
      "coverage/**",
      
      // Cache directories
      ".cache/**",
      ".parcel-cache/**",
      ".eslintcache",
    ],
  },
];

export default eslintConfig;
