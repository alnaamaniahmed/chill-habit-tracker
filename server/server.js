import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from 'cors';
import authRoutes from "./routes/auth.js";
import habitsRoutes from "./routes/habits.js";

const app = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hey app workin! :P");
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitsRoutes);

async function startServer() {
  try {
    await connectDB(process.env.mongoDBURI);
    app.listen(PORT, () => {
      console.log(`ma chill app is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error");
    process.exit(1);
  }
}

startServer();
