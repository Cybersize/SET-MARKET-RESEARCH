import { Router, type IRouter } from "express";
import healthRouter from "./health";
import setProxyRouter from "./setProxy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(setProxyRouter);

export default router;
