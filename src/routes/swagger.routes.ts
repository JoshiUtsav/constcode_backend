import { Router } from "express";
import ApiDocs from "@/docs/index";
import SwaggerUi from "swagger-ui-express";

class SwaggerRouter {
  public router: Router;
  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {
    this.router.use("/docs", SwaggerUi.serve, SwaggerUi.setup(ApiDocs));
  }
}

const router = Router();

new SwaggerRouter(router);
export default router;
