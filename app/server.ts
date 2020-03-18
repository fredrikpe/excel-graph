import express from "express"
import path from "path"

const app = express()
const router = express.Router()
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "views", "errors")
])

router.get("/", async (req, res) => {
    return res.render("index")
})

app.use("/", router);

(() => {
    app.listen(port)
    console.log(`API up and running on port ${port}`)
})()
