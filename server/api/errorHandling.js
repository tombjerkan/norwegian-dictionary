const logger = require("../logger");

function handleErrors(err, req, res, next) {
    if (err instanceof ApiError) {
        logger.error(`ApiError(${err.status}): ${err.message}`);
        res.status(err.status).send(err.message);
    } else {
        logger.error(`${err.message}\n${err.stack}`);
        res.status(500).send();
    }
}

// Express does not automatically catch errors thrown in async route handlers,
// they must be explicitly passed to the error handlers using 'next'. Using
// this higher-order function ensures any uncaught errors in the route handler
// are passed to the error handlers
function withAsyncErrorHandling(routeHandler) {
    return function(req, res, next) {
        routeHandler(req, res, next).catch(next);
    };
}

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

function isNotFoundError(axiosError) {
    return axiosError.response && axiosError.response.status === 404;
}

function isServiceUnavailableError(axiosError) {
    return axiosError.response && axiosError.response.status === 503;
}

function isNoResponseError(axiosError) {
    return !axiosError.response && axiosError.request;
}

module.exports = {
    handleErrors,
    withAsyncErrorHandling,
    ApiError,
    isNotFoundError,
    isServiceUnavailableError,
    isNoResponseError
};
