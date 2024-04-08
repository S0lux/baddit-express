const whitelist = ["http://localhost:3000", "http://localhost:3001", "https://baddit.life"];

export const corsOptions = {
  origin: "*",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
};
