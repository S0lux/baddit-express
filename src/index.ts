import "./env";
import fs from "fs";
import app from "./app";
import http from "http";
import https from "https";
import { UserRole } from "@prisma/client";

const PORT = process.env.PORT;

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      emailVerified: boolean;
      role: UserRole;
    }
  }
}

const httpsOptions = {
  cert: fs.readFileSync("./ssl/domain.cert.pem"),
  key: fs.readFileSync("./ssl/private.key.pem"),
  ca: fs.readFileSync("./ssl/intermediate.cert.pem"),
};

const httpsServer = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

httpsServer.setTimeout(60000);

if (process.env.ENV === "DEV") {
  const httpServer = http.createServer(app).listen(3001, () => {
    console.log(`Server is running on port 3001`);
  });

  httpServer.setTimeout(60000);
}
