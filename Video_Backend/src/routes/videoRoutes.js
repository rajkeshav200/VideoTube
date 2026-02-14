// import { Router } from "express";
// import {
//     getAllVideo,
//     publishAVideo,
//     getVideoById,
//     updateVideo,
//     deleteVideo,
//     togglePublishStatus
// } from "../controller/videoController.js";
// import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/multerMiddleware.js";

// const videorouter = Router();

// videorouter.route("/").get(getAllVideo)
// videorouter.route("/:videoId").get(getVideoById)

// videorouter.route("/")
// .use(verifyJWT)
// .post(upload.fields([
//     {
//         name:"videoFile",
//         maxCount:1
//     },
//     {
//         name:"thumbnail",
//         maxCount:1
//     }
// ]),publishAVideo)

// videorouter.route("/:videoId")
// .use(verifyJWT)
// .get(getVideoById)
// .delete(deleteVideo)
// .patch(upload.single("thumbnail"),updateVideo)

// videorouter.route("/toggle/publish/:videoId").patch(togglePublishStatus)

// export default videorouter
import { Router } from "express";
import {
  getAllVideo,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controller/videoController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const videorouter = Router();
videorouter
  .route("/")
  .get(getAllVideo)
  .post(
    verifyJWT,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );
videorouter
  .route("/:videoId")
  .get(verifyJWT,getVideoById)
  .patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideo
  )
  .delete(
    verifyJWT,
    deleteVideo
  );

videorouter
  .route("/toggle/publish/:videoId")
  .patch(
    verifyJWT,
    togglePublishStatus
  );

export default videorouter;
