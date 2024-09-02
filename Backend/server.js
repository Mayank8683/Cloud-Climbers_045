const express = require("express");
const cors = require("cors");
const connnetToDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const documentRouter = require("./routes/documents");
const folderRouter = require("./routes/folderRoutes");
const auth = require("./middleware/auth");
const projectRouter = require("./routes/projectRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes

app.use("/api/auth", userRouter);
app.use("/api/documents", auth, documentRouter);
app.use("/api/folders", auth, folderRouter);
app.use("/", projectRouter);

const PORT = process.env.PORT || 5000;
const db_url = process.env.MONGODB_URL;

app.listen(PORT, async () => {
  try {
    connnetToDB(db_url);
    console.log(`Server running on port http://localhost:${PORT}`);
  } catch (err) {
    console.log("error", err);
  }
});
