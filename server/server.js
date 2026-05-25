import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import connectDB from "./app/db/connectDB.js";
import userAuthRouter from "./app/routes/userAuth.route.js";
import userAccessRoute from "./app/routes/userAccess.route.js";

dotenv.config();
const app = express();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Working");
});

// routes
app.use("/api/auth", userAuthRouter);
app.use("/api", userAccessRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

connectDB();
