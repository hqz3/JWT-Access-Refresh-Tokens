import { Express } from "express";
import {
  createSessionHandler,
  getSessionHandler,
  deleteSessionHandler,
} from "../controllers/controller";

function routes(app: Express) {
  // login
  app.post("/api/session", createSessionHandler);

  // get the current session
  app.get("/api/session", getSessionHandler);

  // logout
  app.delete("/api/session", deleteSessionHandler);
}

export default routes;
