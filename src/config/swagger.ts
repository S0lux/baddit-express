import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Baddit API",
      version: "1.0.0",
      description: "Backend API for Baddit, a Reddit clone.",
    },
    servers: [
      {
        url: process.env.SWAGGER_API || "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJsdoc(options);
