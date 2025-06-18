import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { name } from "../../package.json";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: `${name} API`,
      version: "1.0.0",
      description: "API documentation for Adcash Campaign Management",
    },
    license: {
      name: "MIT",
    },
    servers: [
      {
        url: "https://adcash.onrender.com/v1",
        description: "Live server",
      },
      {
        url: "http://localhost:3000/v1",
        description: "Development server",
      },
    ],
    externalDocs: {
      description: "swagger.json",
      url: "/v1/docs/swagger.json",
    },
  },
  apis: ["src/docs/*.yml", "src/routes/*.ts", 'dist/src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const router = express.Router();

router.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default router;
