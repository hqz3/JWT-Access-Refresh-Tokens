import { Express } from "express";
import {
  createSessionHandler,
  getSessionHandler,
} from "../controllers/controller";

function routes(app: Express) {
  // login
  app.post("/api/session", createSessionHandler);

  // get the current session
  app.get("/api/session", getSessionHandler);

  // logout
}

export default routes;
