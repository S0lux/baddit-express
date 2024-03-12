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

http.createServer(app).listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
