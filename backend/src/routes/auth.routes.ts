import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { Application } from "express";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Service Provider API",
      version: "1.0.0",
      description: "API documentation for Service Provider backend",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
export function setupSwagger(app: Application) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

const router = Router();

  /**
   * @swagger
   * /register:
   *    post:
   *          summary: Register a new user
   *          description: Register a new user with email, fullName, password, department, and phone
   *          requestBody:
   *            required: true
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    email:
   *                      type: string
   *                      example: "user@example.com"
   *                    fullName:
   *                      type: string
   *                      example: "John Doe"
   *                    password:
   *                      type: string
   *                      example: "password123"
   *                    department:
   *                      type: string
   *                      example: "Engineering"
   *                    phone:
   *                      type: string
   *                      example: "1234567890"
   *                    role:
   *                      type: string
   *                      enum: ["user", "admin", "minion"]
   *          responses:
   *            201:
   *              description: User registered successfully
   *            400:
   *              description: Bad request
   *            409:
   *              description: User already exists
   */
router.post('/register', AuthController.registerUser);
  /**
   * @swagger
   * /login:
   *    post:
   *      summary: Login user
   *      description: Login user with email and password
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  example: "user@example.com"
   *                password:
   *                  type: string
   *                  example: "password123"
   *      responses:
   *        200:
   *          description: Login successful
   *        400:
   *          description: Bad request
   *        404:
   *          description: User not found
   */
router.post('/login', AuthController.loginUser);
  /**
   * @swagger
   * /verify:
   *    post:
   *      summary: Verify user
   *      description: Verify user by email or phone
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                input:
   *                  type: string
   *                  example: "user@example.com"
   *      responses:
   *        200:
   *          description: User verified successfully
   *        400:
   *          description: Bad request
   *        404:
   *          description: User not found
   */
router.post('/verify', AuthController.userVerify);
  /**
   * @swagger
   * /resetPassword:
   *    put:
   *      summary: Reset user password
   *      description: Reset user password by email or phone
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                input:
   *                  type: string
   *                  example: "user@example.com"
   *                password:
   *                  type: string
   *                  example: "newpassword123"
   *      responses:
   *        200:
   *          description: Password reset successfully
   *        400:
   *          description: Bad request
   *        404:
   *          description: User not found
   */
router.put('/resetPassword', AuthController.resetPassword);

export default router;
