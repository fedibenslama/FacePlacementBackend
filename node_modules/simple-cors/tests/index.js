const test = require('tape');
const corsRoute = require('..');

test('corsRoute Exists', function (t) {
    t.plan(2);

    t.ok(corsRoute, 'corsRoute Exists');
    t.equal(typeof corsRoute, 'function', 'corsRoute is an function');
});

test('corsRoute returns a function', function (t) {
    t.plan(2);
    const result = corsRoute();

    t.ok(result, 'result Exists');
    t.equal(typeof result, 'function', 'result is an function');
});

test('result sets headers', function (t) {
    t.plan(11);

    const testRequestHeader = 'foo';
    let headersAdded = 0;
    const validHeaders = [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers',
        'Access-Control-Max-Age',
    ];
    const validValues = ['*', 'GET,PUT,POST,DELETE,OPTIONS', testRequestHeader, '86400'];
    const testRequest = {
        headers: {
            'access-control-request-headers': testRequestHeader,
        },
    };
    const testResponse = {
        setHeader: function (header, value) {
            t.equal(header, validHeaders[headersAdded], `"${header}" header added.`);
            t.equal(value, validValues[headersAdded], `"${value}" value added.`);
            headersAdded++;
        },
    };
    const result = corsRoute(function (request, response) {
        t.equal(request, testRequest, 'recieved correct request');
        t.equal(response, testResponse, 'recieved correct response');
        t.equal(headersAdded, 4, 'correct number of headers added');
    });

    result(testRequest, testResponse);
});

test('result responds to OPTIONS request', function (t) {
    t.plan(9);

    const testRequestHeader = 'foo';
    let headersAdded = 0;
    const validHeaders = [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers',
        'Access-Control-Max-Age',
    ];
    const validValues = ['*', 'GET,PUT,POST,DELETE,OPTIONS', testRequestHeader, '86400'];
    const testRequest = {
        method: 'OPTIONS',
        headers: {
            'access-control-request-headers': testRequestHeader,
        },
    };
    const testResponse = {
        setHeader: function (header, value) {
            t.equal(header, validHeaders[headersAdded], `"${header}" header added.`);
            t.equal(value, validValues[headersAdded], `"${value}" value added.`);
            headersAdded++;
        },
        end: function () {
            t.equal(headersAdded, 4, 'correct number of headers added');
        },
    };
    const result = corsRoute(() => t.fail('should have called response.end'));

    result(testRequest, testResponse);
});
