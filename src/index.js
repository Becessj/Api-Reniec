import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import router from "./routes/reniecsunat.routes";
import morgan from "morgan";
import { PORT } from "./config";

// ==============================
// Initializations
// ==============================
dotenv.config();
const app = express();

// ==============================
// Settings
// ==============================
app.set("port", process.env.PORT || 3000);

// ==============================
// CORS – ORÍGENES PERMITIDOS
// ==============================
const allowedOrigins = [
  // Local
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8082",
  "http://localhost:8083",

  // IPs internas
  "http://10.0.0.216:8080",
  "http://10.0.0.216:8083",
  "http://10.0.0.193:8082",

  // IP pública directa
  "http://190.234.243.220:8080",

  // Dominios institucionales
  "https://transformaciondigitalcusco.in",
  "https://santiagomedioambiente.transformaciondigitalcusco.in",
  "https://tramitedocumentario.transformaciondigitalcusco.in",
  "https://santiagolimpio.transformaciondigitalcusco.in",

  // Dominios Guaman Poma
  "https://transformaciondigital.guamanpoma.org",
  "https://santiagolimpio.guamanpoma.org",
  "https://especializacionseguridadalimentaria.guamanpoma.org",
];

// ==============================
// Middlewares
// ==============================
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, server-to-server, cron, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS bloqueado para:", origin);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: false,
  })
);

// Responder correctamente a preflight
app.options("*", cors());

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==============================
// Routes
// ==============================
app.use(router);

// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log("✅ API Reniec/Sunat corriendo en puerto", PORT);
});
