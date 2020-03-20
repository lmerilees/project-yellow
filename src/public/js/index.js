$(document).ready(function () {

    // increment for adding unique modals
    var steps = 1;

    // this function handles the sidebar collapse
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // this function will create append a new modal task button to the page when New Step is clicked
    $('#newStep').on('click', function () {

        $('#steps').append($(
            '<button type="button" class="btn btn-info btn-lg" style="padding: 5px" data-toggle="modal" data-target="#myModal'+ steps + '">Step ' + steps + '</button>' +  
            '<div class="modal fade" id="myModal'+ steps + '" role="dialog" style="padding: 2px">' + 
                '<div class="modal-dialog modal-sm">' + 
                    '<div class="modal-content">' + 
                        '<div class="modal-header">' + 
                            '<h4 class="modal-title">Step ' + steps + '</h4>' + 
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>' + 
                        '</div>' + 
                        '<div class="modal-body">' +
                            '<div class="subtasks">' + 
                                '<div class="form-group">' +
                                    '<label class="checkbox-inline"><input type="checkbox" value=""></label>' + 
                                    '<input type="input" class="form-control-inline" id="task' + steps + '" placeholder="Enter Task Name">' +
                                '</div>' + 
                            '</div>' +
                        '</div>' + 
                        '<div class="modal-footer">' + 
                            '<button type="button" class="btn btn-info btn-md" id="newTask">New Task</button>' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' + 
                    '</div>' + 
                '</div>' + 
            '</div>' +
        '</div>'))
        $('#steps').append(' ');
        steps++;
    });

    // add new subtask to modal-body when new task button is clicked
    $(document).on('click', '#newTask' ,function() {
        console.log("Task Clicked!");

        $("#mymodal1").find(".modal-body").append('<div class="form-group">' +
        '<label class="checkbox-inline"><input type="checkbox" value=""></label>' + 
        '<input type="input" class="form-control-inline" id="task1" placeholder="Enter Task Name">' +
        '</div>')
        
        
         $('#tasks').append($(
            '<div class="form-group">' +
                '<label class="checkbox-inline"><input type="checkbox" value=""></label>' + 
                '<input type="input" class="form-control-inline" id="task1" placeholder="Enter Task Name">' +
            '</div>'))
    });


    // this will auto-expand the modal body as items are appended
    $('#modal').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
               width:'auto', //probably not needed
               height:'auto', //probably not needed 
               'max-height':'100%'
        });
    });

});

// update username on page load
$(function updateUser(){
    var pbodyEl = $('pbody');

    $.ajax({
        method: "GET",
        url: "/getuser",
        async: true,
        success: function(response){
            // clear element each time
            pbodyEl.html('');
        
            //append to html element
            pbodyEl.append('<div id="username" style="text-align: center">' + response.rows[0].username + '</div>');
        },
        error: function(xhr, status, error){
            console.log(xhr);
            console.log(status);
        }
    })
})
