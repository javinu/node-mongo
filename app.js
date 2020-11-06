var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./configs/config');

var index = require('./routes/index');
var user = require('./routes/user');
var shop = require('./routes/shop');
var auth = require('./routes/auth');

var app = express();
var port = 8100;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});

var mongoDB = config.databaseConnectionUrl;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('key', config.key);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

const protectedRoutes = express.Router(); 
protectedRoutes.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('key'), (err, decoded) => {      
        if (err) {
          return res.status(403).send('Invalid token');    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.status(400).send({ mensaje: 'Missing token' });
    }
 });

 
app.use('/', index);
app.use('/authenticate', auth);
app.use('/users', user);
app.use('/shops', protectedRoutes, shop);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (err.status == 404) {
		res.status(err.status);
		res.send(err.message);
	} else {
		// render the error page
		res.status(err.status || 500);
		res.send('Ops, an error occured');
	}
});

module.exports = app;
