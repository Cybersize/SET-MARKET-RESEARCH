import { Router, type IRouter } from "express";
import healthRouter from "./health";
import setProxyRouter from "./setProxy";
import setCompaniesRouter from "./setCompanies";

const router: IRouter = Router();

router.use(healthRouter);
router.use(setProxyRouter);
router.use(setCompaniesRouter);

export default router;
