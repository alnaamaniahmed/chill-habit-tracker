import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import habitsRoutes from "./routes/habits.js";

const app = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hey app workin! :P");
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitsRoutes);

async function startServer() {
  try {
    await connectDB(process.env.mongoDBURI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error("Startup error");
    process.exit(1);
  }
}

startServer();
