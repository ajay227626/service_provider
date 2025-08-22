import { Router } from 'express';
import CheckauthController from '../controllers/checkauth.controller';
import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const router = Router();

router.get('/', CheckauthController.checkauth);

export default router;