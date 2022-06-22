function writeCorsHeaders(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', request.headers['access-control-request-headers'] || '');
    response.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

function corsRoute(callback) {
    return function (...args) {
        const [request, response] = args;

        writeCorsHeaders(request, response);

        if (request.method === 'OPTIONS') {
            return response.end();
        }

        callback(...args);
    };
}

module.exports = corsRoute;
