$(document).ready(() => {
    function getDataAttendance(){

        // получаем идентификатор выбранной в списке студенческой группы
        var student_group_id = $("#student_group_id").val();

        // получаем выбранную дату
        var subject_date = $("#subject_date").val();

        // записываем его в параметры, которые будем отправлять на сторону сервера в теле запроса
        var param = {
            student_group_id: student_group_id,
            subject_date: subject_date
        };
        // удаляем содержимое таблицы
        $("#attendance_table_id").empty();

        // делаем запрос к серверу при помощи AJAX
        $.ajax({
            type: "POST", // указываем тип запроса
            url: "/getDataAttendance", // указываем адрес обработчика
            data: param, // передаём параметры
            dataType: "json" // тип данных, которые ожидаются от сервера
        }).done((data) => { // обрабатываем результат
            var journal = data.journal;
            var journalStudent = data.journalStudent;
            var dataAttendance = data.dataAttendance;

            // показывать таблицу будем только в случае, когда есть данные о посещаемости на выбранную дату
            if (journalStudent.length) {
                // выводим учебные дисциплины в шапке таблицы
                // при помощи конструкции ${ } подставляем параметры в шаблоны
                var strDiscipline = "";
                for (var i in journal) {
                    strDiscipline = strDiscipline +
                        `<th>
                            ${journal[i].subject_name}
                        </th>`
                    ;
                }

                // формируем строки таблицы
                var tbody = "";
                var k = journal.length;
                var n = 0;
                for (var i = 0; i < journalStudent.length / journal.length; i++) {
                    // выводим отметки посещаемости
                    var attendance = "";
                    for (var j = 0; j < journal.length; j++) {
                        attendance = attendance +
                            `<td>
                                <input name="attendance" ${i}  type="checkbox" ${journalStudent[j + n].attendance === 1 ? 'checked' : ''}>
                            </td>`
                        ;
                    }
                    // склеиваем данные строк
                    tbody = tbody +
                        `<tr>
                            <td>
                               ${i+1}
                            </td>
                            <td>
                                ${journalStudent[n].student_name}
                            </td>
                            ${attendance}
                        </tr>`
                    ;
                    n = n + k;
                }

                // выводим отметки посещаемости
                var countAttendance = "";
                for (var i = 0; i < dataAttendance.length; i++) {
                    countAttendance = countAttendance +
                        `<td>${dataAttendance[i].countAttendance}</td>`
                    ;
                }

                tbody = tbody +
                    `<tr>
                        <td></td>
                        <td>
                            Количество присутствующих
                        </td>
                        ${countAttendance}
                    </tr>
                    <tr>
                        <td></td>
                        
                    </tr>`
                ;

                // формируем таблицу, но здесь используется "чистый" html
                $("#attendance_table_id").append(
                    `<table border="1">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th colspan=${journal.length}>Посещаемость</th>
                            </tr>
                            <tr>
                                <th>
                                    №
                                </th>
                                 <th>
                                    Список студентов
                                </th>
                                ${strDiscipline}
                            </tr>
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>`
                );
            }
        });
    }

    // при изменении группы подгружаем таблицу
    $("#student_group_id").change(() => {
        getDataAttendance();
    });

    // при изменении даты подгружаем таблицу
    $("#subject_date").change(() => {
        getDataAttendance();
    });
    // при загрузке страницы подгружаем таблицу
    getDataAttendance();
});