import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler";
import { setupSwagger } from "./routes/auth.routes"

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Routes
app.use("/api", routes);
setupSwagger(app);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Page Not Found",
        path: req.originalUrl,
    });
});
// Error handling middleware
app.use(errorHandler);

export default app;