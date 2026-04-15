import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readJsonBody, sendLeadToTelegram } from "./lib/leadHandler.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: mode === "production" ? "https://buyer-from-china.vercel.app/" : "/",
    plugins: [
      react(),
      {
        name: "local-telegram-lead-api",
        configureServer(server) {
          server.middlewares.use("/api/lead", async (req, res, next) => {
            if (req.method !== "POST") {
              next();
              return;
            }

            try {
              const payload = await readJsonBody(req);
              const result = await sendLeadToTelegram(payload, env);

              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(result.body));
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "Не удалось обработать заявку." }));
            }
          });
        },
      },
    ],
    server: {
      host: "127.0.0.1",
      port: 4173,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "react-vendor";
              return "vendor";
            }

            if (id.includes("PrivacyPolicyModal")) return "privacy-modal";
            if (id.includes("CaseResultSection")) return "case-section";
            if (id.includes("ProcessRoadmap")) return "roadmap-section";
            if (id.includes("TimelineSection")) return "timeline-section";
            if (id.includes("SolveSection")) return "solve-section";
            if (id.includes("PainSection")) return "pain-section";

            return undefined;
          },
        },
      },
    },
  };
});
