import { Router } from "express";
import { healthcheck } from "../controller/contrHealthcheck.js";

const healthrouter = Router()
healthrouter.route("/").get(healthcheck)

export default healthrouter;