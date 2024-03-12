import { app } from "./app.js";
import ConnectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
  path: "src/.env",
});

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`👍👍 Server is Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error!!!", error);
  });
