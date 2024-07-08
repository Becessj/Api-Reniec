import { Router } from "express";
import {
  createReniecSunat,
  getAllReniecSunat,
  getReniecSunatById,
} from "../controllers/reniecsunat.controller";
import { login, signup } from "../controllers/auth.controller";
import verifyToken from "../middlewares/verifyToken.middleware";

const router = Router();

router.get("/", (req, res) => res.redirect("/api/documentos"));

router.post("/api/login", login);
router.post("/api/signup", signup);

router
  .route("/api/documentos")
  .get(verifyToken, getAllReniecSunat)
  .post(verifyToken, createReniecSunat);

router
  .route("/api/dni/")
  .post(verifyToken, getReniecSunatById)

  router
  .route("/api/ruc/")
  .post(verifyToken, getReniecSunatById)


export default router;
