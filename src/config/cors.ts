const whitelist = ["http://localhost:3000", "https://baddit.life"];

export const corsOptions = {
  origin: function (origin: string, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
};
