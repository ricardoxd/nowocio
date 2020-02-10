var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var formidableExpress = require('express-formidable');
var RedisStore = require('connect-redis')(session);
var http = require('http');
var realtime = require('./realtime');
var mensajeOn = require('./models/mensaje');
var comentarioOn = require('./routes/comentario');
var mensaje = require('./routes/mensaje');
var passport = require('passport');
var facebookauth = require('./middleware/facebook-auth');
var youtubeauth = require('./middleware/youtube-auth');
var middlewareSession = require('./middleware/session');
var multiParser = require('./middleware/multiparser');
        
var notificacion = require('./routes/notificacion')        
var index = require('./routes/index');
var images = require('./routes/imagen');
var seguidores = require('./routes/seguidor');
var reacciones = require('./routes/reaccion');
var apirest = require('./routes/apirest');
var app = express(),
    i18n = require("i18n");

var mailer = require('express-mailer');
var users = require('./routes/usuario');
 
 
 var middlewareSessionRedis = session({
   store:new RedisStore({port:"6379"}),
   secret:"njnjs73nsdhnsnj2iunsjn"
});   

var server = http.Server(app);
realtime(server,middlewareSessionRedis);

i18n.configure({
    directory: __dirname + '/locales',
    defaultLocale: 'es',
    register: global,
    locales:['es','en']
});

app.use(i18n.init);
  
app.use(function (req, res, next) {
    var locale = 'es';
    req.setLocale(locale);
    res.locals.language = locale;
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*//express-session
  app.use(session({
    secret:"llaveSecreta",
    resave: false,
    saveUninitialized:false
}));*/
//cookie-session
/*app.use(session({
    name:"sessionnowocio",
    keys: ["llave1","llave2"]
}));*/
app.use(multiParser({ uploadDir: __dirname+'/tmp',keepExtensions : false}));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/archivos",express.static(path.join(__dirname, 'public')));


app.use(methodOverride("_method"));



app.use(middlewareSessionRedis);

mensajeOn.recibe();

mailer.extend(app, {
  from: 'ricardo@nowocio.com',
  host: 'smtp.zoho.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'ricardo@nowocio.com',
    pass: '12345678910nowXD'
  }
}); 
app.use(function(req, res, next){ //This must be set before app.router
   req.mailer = app.mailer;
   next();
});
app.use(passport.initialize());
app.use(facebookauth.urls(passport));
app.use(youtubeauth.urls(passport));
passport.use(facebookauth.estrategy());
passport.use(youtubeauth.estrategy());

app.use("/",middlewareSession);
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use('/usuario', users);
app.use('/seguidor', seguidores);
app.use('/imagen', images);
app.use('/mensaje', mensaje);
app.use('/notificacion', notificacion);
app.use('/api',apirest);
app.use('/api/comentario',comentarioOn);
app.use('/api/reaccion',reacciones);

app.get("/login",function (req,res) {
    res.render("login",{title: 'Entrar o Inicia sesion en Nowocio'});
});

app.get("/registrar",function (req,res) {
    res.render("usuario/registrar",{title: 'Registrarse en Nowocio'});
});
app.get("/salir",function (req,res) {
    req.session.user_id = null;
    req.session.passport = null;
    res.locals.perfilVisitado = null;
    res.locals.user= null;
    req.session.user_name= null;
    res.redirect("/login");
})

app.use('/', index);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(i18n.__('Not Found'));
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
module.exports = app;
