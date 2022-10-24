// Подключение модуля express
var express = require("express");

// Создание объекта  express
var app = express();

// Указание, что каталог public используется для хранения статических файлов
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("view engine", "hbs");
// Подключение шаблонизатора Pug.
app.set("view engine", "pug");

// Указание пути к каталогу, который хранит шаблоны в формате Pug.
app.set("views", "./views");

// Указание номера порта, через который будет запускаться приложение.
app.listen(3000);

// Определение обработчика для маршрута "/".
// request — HTTP-запрос, свойствами которого являются строки запроса, параметры, тело запроса, заголовки HTTP.
// response — HTTP-ответ, который приложение Express отправляет при получении HTTP-запроса.
app.get("/", function(request, response)  {
   // render() — функция, которая на основе шаблона (в данном случае шаблона index.pug) генерирует страницу html, которая отправляется пользователю.
    response.render("index");
});
app.get("/ejsPractice", function(request, response)  {   
  response.render("ejsPractice.ejs"); 
});
app.get("/hbsPractice", function(request, response)  {   
  response.render("hbsPractice.hbs"); 
});

// Определение обработчикв для маршрута "/test"
app.get("/test", function(request, response)  {
   
    response.render("test", {description: "Описание страницы"}); 
});
app.get("/information", function(request, response)  {
 
    response.render("test", {description: "На этой странице будет описание проекта"});
  });

  app.get("/pugPractice", function(request, response)  {   
    response.render("pugPractice", {
        title: "Работа с шаблонизатором Pug"
    }); 
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var student = require('./routes/student');
app.use('/', student);

var subject = require('./routes/subject');
app.use('/', subject);

var teacher = require('./routes/teacher');
app.use('/', teacher);

var studentGroup = require('./routes/studentGroup');
app.use('/', studentGroup);

var journal = require('./routes/journal');
app.use('/', journal);

var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var pp = require('passport');

app.use(flash());
app.use(expressSession({
    secret: "key", // строка, которой подписывается сохраняемый в cookie идентификатор сессии
    resave: true, // обеспечивает повторное сохранение сеанса в хранилище сервера при каждом запросе
    saveUninitialized: false // сохраняет неинициализированный сеанс в хранилище. Сеанс считается неинициализированным, если он новый.
    // Например, запрос данных со стороны неавторизованного пользователя — в таком случае сеанс считается неинициализированным и его нет смысла сохранять. 
    // Если пользователь авторизован, то сеанс будем считаться инициализированным
}));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.username = req.user ? req.user.username : "";
  next();
});

var authentication = require('./routes/authentication');
app.use('/', authentication);