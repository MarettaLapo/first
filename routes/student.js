var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listStudents", function(req, res)  {
    var students = [
        { 
            id: 1,
            firstname: "Михаил",
            lastname: "Смирнов",
            patronymic: "Михайлович",
            data: "01.02.2000",
            tel: "11111111111"
        },
        {
            id: 2,
            firstname: "Алиса",
            lastname: "Кузнецова",           
            patronymic: "Михайловна",
            data: "01.02.2001",
            tel: "11111111112"
        },
        {
            id: 3,
            firstname: "Дмитрий",
            lastname: "Орлов",
            patronymic: "Михайлович",
            data: "01.02.2002",
            tel: "11111111113"
        },
    ];
    res.render("listStudents", {
        students: students,
        title: "Список студентов"
    }); 
});
router.get("/student/:id", function(req, res)  {
    var students = [
        { 
            id: 1,
            firstname: "Михаил",
            lastname: "Смирнов",
            patronymic: "Михайлович",
            data: "01.02.2000",
            tel: "11111111111"
        },
        {
            id: 2,
            firstname: "Алиса",
            lastname: "Кузнецова",           
            patronymic: "Михайловна",
            data: "01.02.2001",
            tel: "11111111112"
        },
        {
            id: 3,
            firstname: "Дмитрий",
            lastname: "Орлов",
            patronymic: "Михайлович",
            data: "01.02.2002",
            tel: "11111111113"
        },
    ];
    var student_id = req.params.id;
    var student = students.find(item => item.id == student_id);
    res.render("student", {
        student: student
    });
});
router.post("/student/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listStudents");
});   