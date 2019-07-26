class ApiError extends Error {
    name = "ApiError";

    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

function handleAsyncError(routeHandler) {
    return function(req, res, next) {
        routeHandler(req, res, next).catch(next);
    };
}

module.exports = { ApiError, handleAsyncErrors: handleAsyncError };
