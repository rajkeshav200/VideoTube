import ApiError from "../utils/ApiError.js";
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
};