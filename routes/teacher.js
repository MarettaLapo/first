var db = require("./database.js");

var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listTeachers", function(req, res)  {
    db.all(
        `SELECT * FROM teacher`,
        (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher/listTeachers", {
            teachers: rows,
            title: "Список преподователей:"
        });
    });
});
// :id — параметр запроса
router.get("/teacher/:id", (req, res) => {
    //console.log(req.params.id)
    db.get(
        `SELECT teacher.*, teacher.name as teacher_name FROM teacher
        WHERE teacher.id=?`,
        [req.params.id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher/teacher", {
            teacher: rows,
        });
    });
});

router.route("/addTeacher")
    .get((req, res) => {
        // получаем все группы для вывода в выпадающий список
        db.all(`SELECT * FROM teacher`, (err, rows) => {
            if (err) {
                throw err;
            }
            res.render("teacher/addTeacher", {
                teacher: rows,
                title: "Добавление преподавателя"
            });
        });
    })
    .post((req, res) => {
        db.run(
            `INSERT INTO teacher(name) VALUES (?)`,
            [req.body.name],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeachers');
            }
        );
    });

    router.post("/deleteTeacher/:id", (req, res) => {
        db.run('DELETE FROM teacher WHERE id=?', [req.params.id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeachers');
            }
        );
    });

router.post("/updateTeacher/:id", (req, res) => {
    db.run(
        `UPDATE teacher SET name=? WHERE id=?`,
        [req.body.name, req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listTeachers');
        }
    );
});

//добавьте обработчик для получения информации о том, какие учебные дисциплины ведут преподаватели
router.get("/listTeacherSubject", (req, res) => {
    db.all(
        `SELECT subject.id as subject_id, subject.name as subject_name, teacher.id as teacher_id, teacher.name as teacher_name 
        FROM teacher_subject
	    INNER JOIN subject ON subject.id=teacher_subject.subject_id 
	    INNER JOIN teacher ON teacher.id=teacher_subject.teacher_id`,
        (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher/listTeacherSubject", {
            teacherSubject: rows,
            title: "Назначение преподавателям учебных дисциплин"
        });
    });
});

router.route("/addTeacherSubject")
    .get((req, res) => {
        db.all(`SELECT * FROM teacher`, (err, rows) => {
            if (err) {
                throw err;
            }
            var teachers = rows;
            db.all(`SELECT * FROM subject`, (err, rows) => {
                if (err) {
                    throw err;
                }
                var subjects = rows;
                res.render("teacher/addTeacherSubject", {
                    teachers: teachers,
                    subjects: subjects,
                    title: "Назначение преподавателям учебных дисциплин"
                });
            });
        });
    })
    .post((req, res) => {
        db.run(`INSERT INTO teacher_subject(subject_id, teacher_id) VALUES (?, ?)`, [req.body.subject_id, req.body.teacher_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeacherSubject');
            }
        );
    });

    router.post("/deleteTeacherSubject/teacherId=:teacher_id/subjectId=:subject_id", (req, res) => {
        db.run(`DELETE FROM teacher_subject WHERE teacher_id=? AND subject_id=?`, [req.params.teacher_id, req.params.subject_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeacherSubject');
            }
        );
    });