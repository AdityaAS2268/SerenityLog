import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import journalRoutes from "./routes/journalRoutes.js";

import limiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(limiter);

app.use("/api/journal", journalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
