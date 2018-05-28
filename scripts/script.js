const taskList = $('#taskList');
const modalWindow = $('#myModal');
const editModal = $('#editModal');
const confirmBtn = $('#yesBtn');
const modalBody = $('#modal-txt');
const preHtml = '<li class="list-group-item d-flex justify-content-between align-items-center"  data-id="';
const postHtml = '</p><div><button class="editContent btn btn-sm btn-info">Edit</button><span><buttontype="button" class="btn btn-sm btn-danger ml-3">&times</button></span></div></li>';
var taskObj = {};
var taskArray = [];

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
    console.log(taskArray);
}

function readFromLocalStorage() {
    taskArray = [];
    for (var i = 0; i < localStorage.length; i++) {
        var localStorageObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (localStorageObj.id.indexOf("ToDoList_") != -1){
            var task = preHtml + localStorage.key(i) + '"><p>' + localStorageObj.text + postHtml;
            taskList.append(task);
            taskArray.push(localStorageObj);
            //console.log($('#taskList li:last').addClass('done'));
            var temp = $('#taskList li:last');
            if (localStorageObj.done == 1) {
                temp.addClass('done');
            } else if (localStorageObj.done == 0) {
                temp.removeClass('done');
            }
        }
    }
    console.log(taskArray);
}


function toggleTaskDone(task) {
    let taskId = task.dataset.id;
    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            if (taskArray[i].done == 1) {
                taskArray[i].done = 0;
                task.classList.remove('done');
               // console.log(i, taskArray[i]);
            } else {
                taskArray[i].done = 1;
                task.classList.add('done');
                console.log(i, task, taskArray[i]);
            }
        }
    }
    //console.log(taskArray);
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
        //addToLocalStorage(taskObj);
        addToTaskArray(taskObj);
        $("#newTask").val('');
    }
}




//usuwanie tasków z listy

function removeFromList(task) {
    console.log(task.firstChild.innerText, modalBody);
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
//console.log(taskID);
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

$(document).keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') addNewTask();
});

//zaznaczenie wykonanych tasków

$(document).on('click', '#taskList li', function () {
    //$(this).toggleClass('done');
    let task = this.closest("li");
    toggleTaskDone(task);

    //    let taskID = this.closest("li").dataset.id;
    //    let taskObj = localStorage.getItem(taskID);
    //    if(taskObj.done == 1){
    //        $(this).removeClass('done');
    //        taskObj.done = 0;
    //        console.log(taskObj);
    //    } else {
    //        $(this).addClass('done');
    //        taskObj.done = 1;
    //
    //    }
    //localStorage.removeItem(taskRow);
});

$(window).on('beforeunload', function () {
    localStorage.clear();
    for (i = 0; i < taskArray.length; i++) {
        localStorage.setItem(taskArray[i].id, JSON.stringify(taskArray[i]));
    }
});

readFromLocalStorage();