import { Router } from "express";
import { 
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controller/contComment.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const commentrouter = Router();
commentrouter.use(verifyJWT)
commentrouter.route("/:videoId")
.get(getVideoComments)
.post(addComment)
commentrouter.route("/c/:contentId")
.delete(deleteComment)
commentrouter.route("/c/:commentId").patch(updateComment)
export default commentrouter