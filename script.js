var taskList = [];
var preHtml = '<li class="list-group-item d-flex justify-content-between align-items-center"><p>';
var postHtml = '</p><span><buttontype="button" class="btn btn-sm btn-danger">&times</button></span></li>';

function removeChar(string) {
    var newString = '';
    for(i=0; i < string.length; i++){     
        if(string[i] !== '<' && string[i] !== '>') {
            newString += string[i];
        }
    }
    return newString;
}

function addNewTask() {
    var newTask = $("#newTask").val();
    var newString = removeChar(newTask);
    if (newString.trim() !== ''){
        $('#taskList').append(preHtml + newString + postHtml);
        $("#newTask").val('');
    }
};

$(document).on('click', '.btn-danger', function(){
    $(this).closest('li').remove()
});

$(document).on('click','#addTask', addNewTask);

$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') addNewTask();
});

$(document).on('click','#taskList li p', function(){
    
    $(this).toggleClass('done');
});



