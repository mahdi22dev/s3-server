import express from "express";
const app = express();
app.use(express.json());


app.get("/", async (req, res) => {
  res.send("hello from server")
});

app.listen( 3000, () => console.log("Server is listening on port 3000..."));
