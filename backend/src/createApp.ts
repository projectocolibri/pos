import express from "express";
import {
  securityMiddleware,
  authMiddleware,
  corsMiddleware,
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  contaRoutes,
  mesaRoutes,
  salaRoutes,
} from "./presentation";

export const createApp = () => {
  const app = express();
  app.use(securityMiddleware());
  app.use(corsMiddleware());
  app.use(requestLoggingMiddleware());
  app.use(authMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(contaRoutes);
  app.use(mesaRoutes);
  app.use(salaRoutes);
  app.use(errorLoggingMiddleware());
  return app;
};
