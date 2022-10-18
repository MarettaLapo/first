var db = require("./database.js");
module.exports = router;
var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)

router.get("/listStudents", function(req, res)  {
    db.all(`SELECT * FROM student`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listStudents", {
            students: rows,
            title: "Список студентов"
        });
    });
});
router.post("/student/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listStudents");
});   