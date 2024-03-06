import express from "express";
import connectDB from "./config/dbServer.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user',userRouter)

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000/");
  connectDB();
});

