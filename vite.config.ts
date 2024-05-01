import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react()],
    define: {
      CHATGPT_API_KEY: JSON.stringify(env.CHATGPT_API_KEY),
    },
  });
};
