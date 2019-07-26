function handleErrors(err, req, res, next) {
    if (err instanceof ApiError) {
        res.status(err.code).send(err.message);
    } else {
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
    name = "ApiError";

    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

module.exports = { handleErrors, withAsyncErrorHandling, ApiError };
