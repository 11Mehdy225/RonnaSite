import { Router } from "express";
import { quoteRateLimit as quoteLimiter }from "../middleware/rateLimit.js"
import { createQuoteRequest } from "../controllers/quote.controller.js";

const router = Router();
router.post("/quotes", quoteLimiter, createQuoteRequest);

export default router;
