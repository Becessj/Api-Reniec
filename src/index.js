import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import router from "./routes/reniecsunat.routes";
import morgan from 'morgan';
import { PORT } from './config';

// Initializations
dotenv.config();
const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:8082',
    'https://transformaciondigital.guamanpoma.org'
  ], // Lista de orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

// Middlewares
app.use(cors(corsOptions)); // Aplicar CORS con las opciones configuradas
app.use(helmet()); // Helmet para mejorar la seguridad
app.use(morgan("dev")); // Morgan para el logging de las solicitudes
app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: false })); // Para manejar datos codificados en URL

// Routes
app.use(router);

// Starting the server
app.listen(PORT, () => {
  console.log("Server on port", PORT);
});
