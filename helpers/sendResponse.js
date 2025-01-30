export default function sendResponse(res, status, error, message, data) {
    res.status(status).json({
        error,
        message,
        data: data,
    });
}