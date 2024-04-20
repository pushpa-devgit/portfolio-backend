export const sendErrorResponse = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  console.log("send Error Response", status, message);
  return res.status(status).json({ success: false, status, message });
};
