var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listTeachers", function(req, res)  {
    var teachers = [
        { 
            id: 1,
            firstname: "Александр",
            lastname: "Петров",
            patronymic: "Витальевич"
        },
        {
            id: 2,
            firstname: "Ирина",
            lastname: "Иванова",           
            patronymic: "Витальевна"
        },
        {
            id: 3,
            firstname: "Алексей",
            lastname: "Сидоров",
            patronymic: "Витальевич"
        },
    ];
    res.render("listTeachers", {
        teachers: teachers,
        title: "Список преподавателей"
    }); 
});
router.get("/teacher/:id", function(req, res)  {
    var teachers = [
        { 
            id: 1,
            firstname: "Александр",
            lastname: "Петров",
            patronymic: "Витальевич"
        },
        {
            id: 2,
            firstname: "Ирина",
            lastname: "Иванова",           
            patronymic: "Витальевна"
        },
        {
            id: 3,
            firstname: "Алексей",
            lastname: "Сидоров",
            patronymic: "Витальевич"
        },
    ];
    var teacher_id = req.params.id;
    var teacher = teachers.find(item => item.id == teacher_id);
    res.render("teacher", {
        teacher: teacher
    });
});
router.post("/teacher/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listTeachers");
});   