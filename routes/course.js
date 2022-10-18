var db = require("./database.js");
module.exports = router;
var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

router.get("/listCourses", function(req, res)  {

    db.all(`SELECT * FROM subject`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listCourses", {
            subjects: rows,
            title: "Список предметов"
        });
    });
});

router.post("/course/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listCourses");
}); 