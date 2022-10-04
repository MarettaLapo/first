var db = require("./database.js");

var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();


// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listSubjects", function(req, res)  {

    db.all(`SELECT * FROM subject`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("subject/listSubjects", {
            subjects: rows,
            title: "Список дисциплин"
        });
    });
});

router.route("/addSubject")
    .get((req, res) => {
        res.render("subject/addSubject", {
            title: "Добавление дисциплины"
        });
    })
    .post((req, res) => {
        db.run(
            `INSERT INTO subject(name) VALUES (?)`,
            [req.body.name],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listSubjects');
            }
        );
    });

// :id — параметр запроса
router.get("/subject/:id", function(req, res)  {
    
    db.get(`SELECT * FROM subject WHERE id=?`, [req.params.id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("subject/subject", {
            subject: rows
        });
    });
});

router.post("/updateSubject/:id", (req, res) => {
    db.run(
        `UPDATE subject SET name=? WHERE id=?`,
        [req.body.name, req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listSubjects');
        }
    );
});

router.post("/deleteSubject/:id", (req, res) => {
    db.run('DELETE FROM subject WHERE id=?', [req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listSubjects');
        }
    );
});