import { CorsOptions } from "cors";

const whitelist = ["http://localhost:3000", "http://localhost:3001", "https://baddit.life"];

export const corsOptions: CorsOptions = {
  origin: whitelist,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
};
