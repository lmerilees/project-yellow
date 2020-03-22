// global variables
var userID;
var rowcount = 0;


$(document).ready(function () {

    // this function handles the sidebar collapse
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // this function will create append a new modal task button to the page when New Step is clicked
    $('#newStep').on('click', function(event) {
        event.preventDefault();

        rowcount = countRows();
        console.log(rowcount);

        var stepName = 'Step' + rowcount;
        var userID = 1;
        
        $.ajax({
            url: '/addStep',
            method: 'POST',
            async: true,
            data: {stepName: stepName, userID: userID},
            success: function(response){
                // add new step to the page
                addStep();
                // keep row count up to date
                countRows();
            
            },
            error: function(response, status, err){
                console.log(response);
                console.log(status);
                throw err
            }
        });
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
    $.ajax({
        method: "GET",
        url: "/getuser",
        async: true,
        success: function(response){
            $('pbody').append('<div id="username" style="text-align: center">' + response + '</div>');
        },
        error: function(xhr, status, error){
            console.log(xhr);
            console.log(status);
        }
    })
})


// get userid of current user
function getUserID(){
    $.ajax({
        method: "GET",
        url: "/getUserId",
        async: true,
        success: function(response){
            var userID = response.rows[0].user_id;
            console.log(userID);
            return userID;
        }
    })
    return userID;
}


// we need to keep count of the number of rows in our step table so we can create unique modals
function countRows(){

    // change this if we can figure out how to get userid
    let userID = 1;
    
    $.ajax({
        method: "POST",
        url: "/getRowCount",
        async: true,
        dataType: "json",
        data: {userID: userID},
        success: callbackCountRows,
        error: function(xhr, status, error){
            //console.log(xhr);
            console.log(status + " in getRowCount");
        }
    })
}


function callbackCountRows(data){
    rowcount = data;
    console.log(rowcount);
    return rowcount;
}


// populate users steps on page load
$(function populateSteps(){

    // this shouldn't be hardcoded if we have more than 1 user on same machine
    let userID = 1;

    $.ajax({
        method: "POST",
        url: '/populateSteps',
        data: {userID: userID},
        async: true,
        success: function(results){

            // iterate over steps stored in database and append to page
            Object.keys(results).forEach(function(result){
  
                $('#steps').append($(
                '<button type="button" class="btn btn-info btn-lg" style="padding: 5px" data-toggle="modal" data-target="#myModal'+ result.stepName + '">' + result.stepName + '</button>' +  
                    '<div class="modal fade" id="myModal'+ result.stepName + '" role="dialog" style="padding: 2px">' + 
                        '<div class="modal-dialog modal-sm">' + 
                            '<div class="modal-content">' + 
                                '<div class="modal-header">' + 
                                    '<h4 class="modal-title">' + result.stepName + '</h4>' + 
                                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' + 
                                '</div>' + 
                                '<div class="modal-body">' +
                                    '<div class="subtasks">' + 
                                        '<div class="form-group">' +
                                            '<label class="checkbox-inline"><input type="checkbox" value=""></label>' + 
                                            '<input type="input" class="form-control-inline" id="task' + result.stepName + '" placeholder="Enter Task Name">' +
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
            })
        }
    })
})

// append new step to the page
function addStep(){
    $('#steps').append($(
        '<button type="button" class="btn btn-info btn-lg" style="padding: 5px" data-toggle="modal" data-target="#myModal'+ rowcount + '">Step ' + rowcount + '</button>' +  
        '<div class="modal fade" id="myModal'+ rowcount + '" role="dialog" style="padding: 2px">' + 
            '<div class="modal-dialog modal-sm">' + 
                '<div class="modal-content">' + 
                    '<div class="modal-header">' + 
                        '<h4 class="modal-title">Step ' + rowcount + '</h4>' + 
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>' + 
                    '</div>' + 
                    '<div class="modal-body">' +
                        '<div class="subtasks">' + 
                            '<div class="form-group">' +
                                '<label class="checkbox-inline"><input type="checkbox" value=""></label>' + 
                                '<input type="input" class="form-control-inline" id="task' + rowcount + '" placeholder="Enter Task Name">' +
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
    rowcount++
}