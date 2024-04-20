import { Router } from "express";

import { login, registerUser } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);

export default router;
