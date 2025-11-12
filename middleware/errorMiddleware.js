export const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((v) => v.message).join(", ");
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value for ${Object.keys(err.keyValue)}`;
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === "production" ? "🥞 hidden" : err.stack,
    });
};
