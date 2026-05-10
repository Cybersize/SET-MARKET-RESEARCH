import { Router, type IRouter } from "express";
import { COMPANIES } from "../data/set-companies";

const router: IRouter = Router();

// Returns the static SET company seed list (symbol, name, market, industry, sector)
router.get("/set/companies", (_req, res) => {
  res.json(COMPANIES);
});

export default router;
