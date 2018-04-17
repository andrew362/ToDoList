var taskList = [];
var preHtml = '<li class="list-group-item d-flex justify-content-between align-items-center"><p>';
var postHtml = '</p><span><buttontype="button" class="btn btn-sm btn-danger">&times</button></span></li>';

$(document).on('click', '.btn-danger', function(){
    $(this).closest('li').remove()
});


$('#addTask').on('click', function(){
    var newTask = $("#newTask").val();
    $('#taskList').append(preHtml + newTask + postHtml);
    $("#newTask").val('');
});

$(document).on('click','#taskList li p', function(){
    console.log('taskli');
    $(this).toggleClass('done');
});
