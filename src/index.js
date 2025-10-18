import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import connectToDb from "./config/connectToDb.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import router from "./routes/index.js";
import languageMiddleware from "./middlewares/language.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import protectSwagger from "./middlewares/protectSwagger.js";
import { fileURLToPath } from "url";

// Define __filename and __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database Connection
connectToDb();

// Initialize Express App
const app = express();

// Middleware
const whitelist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "lang"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(languageMiddleware);

// Static Files
// app.use(express.static(path.join(__dirname, "dist")));
// Adjust the static path to match where files are actually stored
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API Routes
app.use("/api/v1/", router);

app.use("/api-docs/:token", protectSwagger, swaggerUi.serve, (req, res) =>
  swaggerUi.setup(swaggerSpec)(req, res)
);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
