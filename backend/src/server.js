import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDBConnection } from "./configs/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Kết nối backend thành công",
  });
});


const startServer = async () => {
  try {
    await testDBConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Sever dừng do không kết nối được DB");
    process.exit(1);
  }
};

startServer();
