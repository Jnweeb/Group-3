import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
    next(new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404,
        'ROUTE_NOT_FOUND'
    ));
};

export const errorHandler = (error, req, res, next) => {
    const isKnownError = error instanceof AppError;

    if (res.headersSent) {
        return next(error);
    }

    const statusCode = isKnownError ? error.statusCode : 500;
    const errorCode = isKnownError ? error.errorCode : 'INTERNAL_ERROR';
    const message = isKnownError
        ? error.message
        : 'Something went wrong. Please try again later.';
    const details = isKnownError ? error.details : null;

    if (!isKnownError) {
        console.error('Unexpected error:', error);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            details,
            timestamp: new Date().toISOString(),
            path: req.originalUrl
        }
    });
};