const dotenv = require("dotenv")
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
const connectToMongo = require("./db/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const multer = require("multer");
if (process.env.NODE_ENV !== "production") {
  const dns = require("node:dns");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}





connectToMongo();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());





app.use("/api/v1/auth" , authRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/project" , projectRoutes);
app.use("/api/dashboard" , dashboardRoutes);






app.get("/" , (req,res) =>{
    res.send("hello world");
})


app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// multer error if user want to upload more than 3 files
app.use((err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            message: "Maximum 3 attachments allowed"
        });

    }

    return res.status(500).json({
        success: false,
        message: err.message
    });

});








module.exports = app;