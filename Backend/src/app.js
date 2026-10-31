import express from "express";

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({
        success:true,
        message:"Wellcome to Fitness tracker API",
        technology :"Node Js, ExpressJs"
    });
});

export default app