var express = require("express");

var router = express.Router();

var db = require("./database.js");
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var dbTransaction = new TransactionDatabase(db);
module.exports = router;
router.get("/attendanceJournal", (req, res) => {
    db.all(`SELECT * FROM student_group`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("journal/attendanceJournal.pug", {
            studentGroups: rows,
            title: "Журнал посещаемости"
        });
    });
});


router.get("/attendanceForStudentGroups", (req, res) => {
    db.all(`SELECT * FROM student_group`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("journal/attendanceForStudentGroups", {
            studentGroups: rows,
            title: "Список студенческих групп"
        });
    });
});
router.post("/deleteJournal/:id", (req, res) => {
    db.run('DELETE FROM journal WHERE id=?', [req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/attendanceJournal');
        }
    );
});
router.route("/addAttendanceMark/:student_group_id")
    .get((req, res) => {
        db.all(
            `SELECT student_group_subject.id as student_group_subject_id, 
            subject.id as subject_id, subject.name as subject_name, 
            student_group.id as student_group_id, student_group.name as student_group_name 
            FROM student_group_subject
            INNER JOIN subject ON subject.id=student_group_subject.subject_id 
            INNER JOIN student_group ON student_group.id=student_group_subject.student_group_id
            WHERE student_group_subject.student_group_id=?`,
            [req.params.student_group_id],
            (err, rows) => {
                if (err) {
                    throw err;
                }
                var groupSubject = rows;
                // будем выбирать только тех преподавателей, которые ведут учебные дисциплины выбранной группы
                var result = groupSubject.map(el => el.subject_id).join(',');
                db.all(
                    `SELECT teacher_subject.id as teacher_subject_id,
                    subject.id as subject_id, subject.name as subject_name, 
                    teacher.id as teacher_id, teacher.name as teacher_name 
                    FROM teacher_subject
                    INNER JOIN subject ON subject.id=teacher_subject.subject_id 
                    INNER JOIN teacher ON teacher.id=teacher_subject.teacher_id
                    WHERE subject.id IN (` + result + `)`,
                    (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        var teacherSubject = rows;
                        db.all(`SELECT * FROM student WHERE student_group_id=?`, [req.params.student_group_id], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            var students = rows;
                            db.get(`SELECT * FROM student_group WHERE id=?`, [req.params.student_group_id], (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                var studentGroup = rows;
                                res.render("journal/addAttendanceMark", {
                                    groupSubject: groupSubject,
                                    teacherSubject: teacherSubject,
                                    students: students,
                                    studentGroup: studentGroup,
                                    title: "Добавление отметки посещаемости"
                                });
                            });
                        });
                    });
            });
    })
    .post((req, res) => {
        // получаем массив идентификаторов студентов, для которых нужно добавить отметку посещаемости
        var arrayStudents = req.body.array_students_id;
        // добавляем следующую проверку: если arrayStudents не является массивом и не имеет значение undefined, то значит в списке был один студент
        // если один студент, то отметка посещаемости тоже одна и в таком случае передаётся на сторону сервера только одно значение не в массиве
        // если отметок посещаемости несколько, то все они передаются в одном массиве
        if (Array.isArray(arrayStudents) == false && arrayStudents!==undefined){
            arrayStudents = [];
            arrayStudents.push(req.body.array_students_id);
        }
        // проверяем, что arrayStudents является массивом, поскольку, если в группе нет студентов, то arrayStudents будем иметь тип undefined
        if (Array.isArray(arrayStudents) == true ) {
            dbTransaction.beginTransaction((err, transaction) => {
                transaction.run(
                    `INSERT INTO journal(student_group_subject_id, teacher_subject_id, subject_date) VALUES (?,?,?)`,
                    [req.body.student_group_subject_id, req.body.teacher_subject_id, req.body.subject_date],
                    function(err) { // здесь стрелочную функцию использовать нельзя, так как не сможем далее обратиться к lastID
                        if (err) {
                            throw err;
                        }
                        // получаем идентификатор добавленной записи в journal (этот идентификатор потребуется для добавления записей в journal_student, поскольку нужно указывать ссылку на запись из таблицы journal)
                        var journal_id = this.lastID;
                        var journal_student = [];
                        for (var i = 0; i < arrayStudents.length; i++) {
                            // сначала добавляем идентификатор студента
                            journal_student.push(arrayStudents[i]);
                            // определяем отметку посещаемости
                            // если нашли в теле запроса отметку посещаемости, то значит была установлена галочка (если галочка не поставлена, то информация по отметке не отправляется из формы на сервер)
                            if (req.body["attendance" + i] != null) {
                                journal_student.push(1);
                            }
                            else {
                                journal_student.push(0);
                            }
                            journal_student.push(journal_id);
                        }
                        var placeholders = arrayStudents.map(() => '(?,?,?)').join(',');

                        transaction.run(
                            `INSERT INTO journal_student(student_id, attendance, journal_id) VALUES ` + placeholders,
                            journal_student,
                             (err) => {
                                if (err) {
                                    throw err;
                                }
                                // фиксируем транзакцию
                                transaction.commit((err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    // в случае успешного выполнения транзакции переходим к странице с отметками посещаемости группы
                                    res.redirect('/attendanceJournal');
                                });
                            });
                    });
            });
        }
    });

    router.post("/getDataAttendance", (req, res) => {
        // сначала получаем записи из таблицы journal, где определены даты отметок посещаемости (даты проведения занятий)
        db.all(
            `SELECT journal.*, subject.name as subject_name
            FROM journal  
            INNER JOIN student_group_subject ON student_group_subject.id=journal.student_group_subject_id
            INNER JOIN subject ON subject.id=student_group_subject.subject_id
            WHERE student_group_subject.student_group_id=? AND journal.subject_date=?`,
            [req.body.student_group_id, req.body.subject_date],
            (err, rows) => {
                if (err) {
                    throw err;
                }
                // затем получаем записи из таблицы journal_student, в которой хранятся данные отметок посещаемости студентов
                var journal = rows;
                db.all(
                    `SELECT journal_student.*, student.name as student_name 
                    FROM journal_student
                    LEFT JOIN journal ON journal.id=journal_student.journal_id
                    LEFT JOIN student ON student.id=journal_student.student_id
                    LEFT JOIN student_group_subject ON student_group_subject.id=journal.student_group_subject_id
                    WHERE student_group_subject.student_group_id=? AND journal.subject_date=?
                    ORDER BY student.id`,
                    [req.body.student_group_id, req.body.subject_date],
                    (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        var journalStudent = rows;
                        db.all(
                            `SELECT SUM(attendance) as countAttendance 
                            FROM journal_student
                            LEFT JOIN journal ON journal.id=journal_student.journal_id
                            LEFT JOIN student ON student.id=journal_student.student_id
                            LEFT JOIN student_group_subject ON student_group_subject.id=journal.student_group_subject_id
                            WHERE student_group_subject.student_group_id=? AND journal.subject_date=?
                            GROUP BY journal.id
                            ORDER BY student.id`,
                            [req.body.student_group_id, req.body.subject_date],
                            (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                var dataAttendance = rows;
                                res.send(
                                    JSON.stringify({
                                        journal: journal,
                                        journalStudent: journalStudent,
                                        dataAttendance: dataAttendance
                                    })
                                );
                        });
                });
            });
        });