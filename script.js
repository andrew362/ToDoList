const taskList = $('#taskList');
const preHtml = '<li class="list-group-item d-flex justify-content-between align-items-center" data-id="';
const postHtml = '</p><span><buttontype="button" class="btn btn-sm btn-danger">&times</button></span></li>';

function removeChar(string) {
    var newString = '';
    for(i=0; i < string.length; i++){     
        if(string[i] !== '<' && string[i] !== '>') {
            newString += string[i];
        }
    }
    return newString;
}

function addToLocalStorage(task) {
    var date = new Date();
    var taskId = date.getTime();
    localStorage.setItem(taskId, task);
    taskList.append(preHtml + taskId + '"><p>' + task + postHtml);
    console.log(taskId, task);
}

function readFromLocalStorage() {
    for(var i = 0; i < localStorage.length; i++){
        var task = preHtml + localStorage.key(i) + '"><p>' + localStorage.getItem(localStorage.key(i)) + postHtml;
        taskList.append(task);
    }
}

function removeFromListAndLocalStorage(task) {
    if(confirm("Czy chcesz usunąć zadanie? " + "'" + task.firstChild.innerText + "'")) {
       task.remove();
       localStorage.removeItem(task.dataset.id);
       }
}

function addNewTask() {
    var newTask = $("#newTask").val();
    var newString = removeChar(newTask);
    if (newString.trim() !== ''){
        addToLocalStorage(newString);
        $("#newTask").val('');
    }
}


//usuwanie tasków z listy

$(document).on('click', '.btn-danger', function(){
    let taskRow = this.closest("li");
    removeFromListAndLocalStorage(taskRow);
});

//dodawanie nowych tasków

$(document).on('click','#addTask', addNewTask);

//listener dla 'Enter'

$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') addNewTask();
});

//zaznaczenie wykonanych tasków

$(document).on('click','#taskList li p', function(){
    $(this).toggleClass('done');
});

readFromLocalStorage();



