const HttpResponse = require("./HttpResponse");

const errorHandler = (error, res, action) => {
  try {
    if (error.message && error.message.includes("Validation error")||error.message.includes("ValidationError")) {
      return HttpResponse.conflict(res, {
        error: "ValidationError",
        action
      });
    } 
    else if (error.message && error.message.includes("Connection error")||error.message.includes("ConnectionError")) {
      return HttpResponse.serverError(res, {
        error: "ConnectionError",
        action
      });
    } 
    else if (error.message && error.message.includes("TypeError")) {
      return HttpResponse.serverError(res, {
        error: "TypeError",
        action
      });
    } 
    else if (error.message && error.message.includes("SyntaxError")) {
      return HttpResponse.serverError(res, {
        error: "TypeError",
        action
      });
    } 
    else if (error.message && error.message.includes("ReferenceError")) {
      return HttpResponse.serverError(res, {
        error: "ReferenceError",
        action
      });
    } 
    else if (error.message && error.message.includes("NetworkError")) {
      return HttpResponse.serverError(res, {
        error: "NetworkError",
        action
      });
    } 
    else if (error.message && error.message.includes("Sequelize")) {
      return HttpResponse.serverError(res, {
        error: "DataBaseError",
        action
      });
    } 
    else {
      return HttpResponse.serverError(res, {
        error: "ServerError",
        action
      });
    }
  } catch (error) {
    return HttpResponse.serverError(res, {
      error: "ServerError",
    });
  }
};


module.exports = errorHandler;