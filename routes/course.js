var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listCourses", function(req, res)  {
    var courses = [
        { 
            id: 1,
            name: "Math"
        },
        {
            id: 2,
            name: "History"
        },
        {
            id: 3,
            name: "English"
        },
    ];
    res.render("listCourses", {
        courses: courses,
        title: "Список курсов"
    }); 
});
router.get("/course/:id", function(req, res)  {
    var courses = [
        { 
            id: 1,
            name: "Math"
        },
        {
            id: 2,
            name: "History"
        },
        {
            id: 3,
            name: "English"
        },
    ];
    var course_id = req.params.id;
    var course = courses.find(item => item.id == course_id);
    res.render("course", {
        course: course
    });
});
router.post("/course/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listCourses");
}); 