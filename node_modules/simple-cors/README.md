# `simple-cors`

Simple module to add Cross-Origin Resource Sharing headers to your routes.

This module will add the following (very open CORS headers) to your response.

```
Access-Control-Allow-Origin: '*'
Access-Control-Allow-Methods: 'GET,PUT,POST,DELETE,OPTIONS'
Access-Control-Allow-Headers: request.headers['access-control-request-headers']
```
and will respond with `200 OK` to any `OPTIONS` request

## Install

```shell
npm install simple-cors
```

## Usage

```js
var corsRoute = require('simple-cors');

routes['/api/test'] = corsRoute(function(request, response){
    response.end('Hello CORS World!');
});
```
