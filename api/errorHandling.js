function handleErrors(err, req, res, next) {
    if (err instanceof ApiError) {
        res.status(err.code).send(err.message);
    } else {
        res.status(500).send();
    }
}

function withAsyncErrorHandling(routeHandler) {
    return function(req, res, next) {
        routeHandler(req, res, next).catch(next);
    };
}

class ApiError extends Error {
    name = "ApiError";

    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

module.exports = { handleErrors, withAsyncErrorHandling, ApiError };
