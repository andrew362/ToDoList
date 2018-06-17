const taskList = $('#taskList');
const modalWindow = $('#myModal');
const editModal = $('#editModal');
const confirmBtn = $('#yesBtn');
const modalBody = $('#modal-txt');
const preHtml = '<li class="list-group-item d-flex justify-content-between align-items-center"  data-id="';
const postHtml = '</p><div><button class="editContent btn btn-sm btn-info">Edit</button><span><buttontype="button" class="btn btn-sm btn-danger ml-3">&times</button></span></div></li>';
var taskObj = {};
var taskArray = [];

function pressEnter(func) {
    $(document).keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') func();
    });
}

function removeChar(string) {
    var newString = '';
    for (i = 0; i < string.length; i++) {
        if (string[i] !== '<' && string[i] !== '>') {
            newString += string[i];
        }
    }
    return newString;
}

function addToTaskArray(obj) {
    taskArray.push(obj);
    taskList.append(preHtml + obj.id + '"><p>' + obj.text + postHtml);
}

function readFromLocalStorage() {
    taskArray = [];
        var localStorageObj = JSON.parse(localStorage.getItem("ToDoList"));
        if(localStorageObj.length > 0){
            for (var i = 0; i < localStorageObj.length; i++) {
                var task = preHtml + localStorageObj[i].id + '"><p>' + localStorageObj[i].text + postHtml;
                taskList.append(task);
                taskArray.push(localStorageObj[i]);
                var temp = $('#taskList li:last');
                if (localStorageObj[i].done == 1) {
                    temp.addClass('done');
                } else if (localStorageObj[i].done == 0) {
                    temp.removeClass('done');
                }
            }
        }
}

function toggleTaskDone(task) {
    let taskId = task.dataset.id;
    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            if (taskArray[i].done == 1) {
                taskArray[i].done = 0;
                task.classList.remove('done');
            } else {
                taskArray[i].done = 1;
                task.classList.add('done');
                console.log(i, task, taskArray[i]);
            }
        }
    }
}

function addNewTask() {
    var newTask = $("#newTask").val();
    var newString = removeChar(newTask);
    var date = new Date();
    var taskId = "ToDoList_" + date.getTime();
    if (newString.trim() !== '') {
        let taskObj = {
            id: taskId,
            done: 0,
            text: newString
        };
        addToTaskArray(taskObj);
        $("#newTask").val('');
    }
}

//usuwanie tasków z listy
function removeFromList(task) {
    modalBody.text("Czy chcesz usunąć zadanie? " + "'" + task.firstChild.innerText + "'");
    modalWindow.modal('show');
    confirmBtn.on('click', function () {
        let taskId = task.dataset.id;
        console.log(taskArray);
        for (var i = 0; i < taskArray.length; i++) {
            if (taskArray[i].id == taskId) {
                console.log(i);
                taskArray.splice(i, 1);
            }
            task.remove();
        }
       modalWindow.modal('hide');
       modalBody.text('');
        console.log(taskArray);
        return taskArray
    });
    $(document).on('hide.bs.modal',modalWindow, function () {
        confirmBtn.off('click'); //usuwanie listenera na buttonie usuń
    });
}

$(document).on('click', '.btn-danger', function (e) {
    let task = this.closest("li");
    e.stopPropagation();
    removeFromList(task);
});

$(document).on('click', '.editContent', function (e) {
    e.stopPropagation();
    let taskID = $(this).closest('li');
    for (var i = 0 ; i < taskArray.length; i++){
        if (taskArray[i].id == taskID.data('id') ){
            var index = 0;
            editModal.modal('show');
            var textField = $("#editTaskModal");
            textField.val(taskArray[i].text);
            index = taskArray[i];
            $(document).on('click', '#saveEdit', function(){
                //console.log(taskID);
                let val = textField.val();
                index.text = val;
                taskID.find('p').text(val);   
                $(document).off('click','#saveEdit');
                editModal.modal('hide');
            });
        }
    }
    console.log(taskArray);
});

//dodawanie nowych tasków
$(document).on('click', '#addTask', addNewTask);
//listener dla 'Enter'
pressEnter(addNewTask);
//zaznaczenie wykonanych tasków
$(document).on('click', '#taskList li', function () {
    let task = this.closest("li");
    toggleTaskDone(task);
});

//odświeżanie
$(window).on('beforeunload', function () {
    localStorage.removeItem("ToDoList");
    localStorage.setItem("ToDoList", JSON.stringify(taskArray));
});

readFromLocalStorage();