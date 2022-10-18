var express = require("express");
var router = express.Router();

var db = require("./database.js");

module.exports = router;

router.get("/listStudentGroups", (req, res) => {
    db.all('SELECT * FROM student_group', (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("studentGroup/listStudentGroups", { 
            studentGroups: rows,
            title: "Список студенческих групп"
        });
    });
});

// переход к странице добавления студенческой группы
router.get("/addStudentGroup", (req, res) => {
    res.render("studentGroup/addStudentGroup", {
        title: "Добавление студенческой группы"
    });
});

router.post("/addStudentGroup", (req, res) => {
    db.run(`INSERT INTO student_group(name) VALUES (?)`, [req.body.name],
        (err) => {
            if (err) {
                 throw err;
            }
            // переход к списку студенческих групп после добавления записи
            res.redirect("/listStudentGroups");
        }
    );
});

router.get("/studentGroup/:id", (req, res) =>  {
    db.get(`SELECT * FROM student_group WHERE id=?`, [req.params.id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("studentGroup/studentGroup", {
            studentGroup: rows,
            title: "Студенческая группа"
        });
    });
});

router.post("/updateStudentGroup/:id", (req, res) => {
    db.run(`UPDATE student_group SET name=? WHERE id=?`, [req.body.name, req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listStudentGroups');
        }
    );
});

router.post("/deleteStudentGroup/:id", (req, res) => {
    db.run(`DELETE FROM student_group WHERE id=?`, [req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            // возвращаемся к списку студенческих групп
            res.redirect('/listStudentGroups');
        }
    );
});

router.post("/deleteStudentGroupSubject/studentGroup=:student_group_id/subjectId=:subject_id", (req, res) => {
    db.run(`DELETE FROM student_group_subject WHERE student_group_id=? AND subject_id=?`, [req.params.student_group_id, req.params.subject_id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listStudentGroupSubject');
        }
    );
});

router.get("/listStudentGroupSubject", (req, res) => {
    db.all(
        `SELECT student_group.id as student_group_id, student_group.name as student_group_name, subject.id as subject_id, subject.name as subject_name 
        FROM student_group_subject
        INNER JOIN student_group ON student_group.id=student_group_subject.student_group_id 
        INNER JOIN subject ON subject.id=student_group_subject.subject_id`,
        (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("studentGroup/listStudentGroupSubject", {
            studentGroupSubject: rows,
            title: "Назначение учебных дисциплин "
        });
    });
});

router.route("/addStudentGroupSubject")
    .get((req, res) => {
        db.all(`SELECT * FROM student_group`, (err, rows) => {
            if (err) {
                throw err;
            }
            var studentGroup = rows;
            db.all(`SELECT * FROM subject`, (err, rows) => {
                if (err) {
                    throw err;
                }
                var subjects = rows;
                res.render("studentGroup/addStudentGroupSubject", {
                    studentGroup: studentGroup,
                    subjects: subjects,
                    title: "Назначение учебных дисциплин"
                });
            });
        });
    })
    .post((req, res) => {
        db.run(`INSERT INTO student_group_subject(student_group_id, subject_id) VALUES (?, ?)`, [req.body.student_group_id, req.body.subject_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listStudentGroupSubject');
            }
        );
    });