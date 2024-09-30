import { Router } from "express";
import {
  createReniecSunat,
  getAllReniecSunat,
  getReniecSunatById,
  getReniecSunatByIdApis,
} from "../controllers/reniecsunat.controller";
import { login, signup } from "../controllers/auth.controller";
import verifyToken from "../middlewares/verifyToken.middleware";

const router = Router();

// Redirige la raíz a documentos
router.get("/", (req, res) => res.redirect("/api/documentos"));

// Rutas de autenticación
router.post("/api/login", login);
router.post("/api/signup", signup);

// Rutas para manejar documentos
router
  .route("/api/documentos")
  .get(verifyToken, getAllReniecSunat)
  .post(verifyToken, createReniecSunat);

// Ruta para consultar DNI usando la API RENIEC
router
  .route("/api/dniApi/")
  .post(verifyToken, getReniecSunatByIdApis); // Esta ruta está bien configurada

// Ruta para consultar DNI
router
  .route("/api/dni/")
  .post(verifyToken, getReniecSunatById);

// Ruta para consultar RUC
router
  .route("/api/ruc/")
  .post(verifyToken, getReniecSunatById);

export default router;
