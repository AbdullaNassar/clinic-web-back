import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Name", // REQUIRED: Your API title
      version: "1.0.0", // REQUIRED: Your API version
      description: "API documentation for your service",
    },
  },
  apis: [
    "./routes/*.js", // Example: path to your route files
    "./models/*.js", // Example: path to your model files
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
