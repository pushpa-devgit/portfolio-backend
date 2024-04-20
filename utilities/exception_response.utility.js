const customErrorResponse = (httpStatusCode, errorMessage) => {
  const error = Error();
  error.status = httpStatusCode;
  error.message = errorMessage;
  return error;
};

export default customErrorResponse;
