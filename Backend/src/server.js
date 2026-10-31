import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5500;

function start() {
  app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
    console.log(`Env: ${process.env.NODE_ENV || "development"}`);
  });
}
start();