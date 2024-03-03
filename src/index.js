import { app } from "./app.js";
import ConnectDB from "./db/index.js";
import "dotenv/config";
ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`\n 👍👍 Server is Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error!!!", error);
  });

