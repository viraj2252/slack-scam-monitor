var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000;

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
var routes = require('./api/routes/supplyRoutes');
routes(app);
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);