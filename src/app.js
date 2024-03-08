import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
/*url theke data neyar jonno
extended=> for nested*/
app.use(express.static("public")); // static file rakhar jonno , jmon image
app.use(cookieParser()); // CURD in cookie

//routes import
import userRouter from "./routes/user.router.js";
//routes decleartion

app.use("/api/v1/users", userRouter);
app.use("/api/v1", userRouter);
app.use("/api/vi", userRouter);
//http://localhost:8000/users/register

export { app };
