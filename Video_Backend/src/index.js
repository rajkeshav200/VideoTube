import dotenv from "dotenv";
//console.log("DEBUG all env keys loaded:", Object.keys(process.env));
import connectDB from "./db/index.db.js"
import app from "./app.js"

dotenv.config({
    path: './.env'
})

//const app = express();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("failed to connect",error)
})