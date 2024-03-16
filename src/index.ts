import "./env";
import fs from "fs";
import app from "./app";
import http from "http";
import https from "https";

const PORT = process.env.PORT;

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      emailVerified: boolean;
    }
  }
}

const httpsOptions = {
  cert: fs.readFileSync("./ssl/domain.cert.pem"),
  key: fs.readFileSync("./ssl/private.key.pem"),
  ca: fs.readFileSync("./ssl/intermediate.cert.pem"),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

if (process.env.ENV === "DEV") {
  http.createServer(app).listen(3001, () => {
    console.log(`Server is running on port 3001`);
  });
}
