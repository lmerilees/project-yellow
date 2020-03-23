$(document).ready(function () {
    let User_Id = 0;
    let project_name;

    $.post("getUser",function(data){
        console.log(data);
        $("#username").append(data);
        
    });

    $.post("getUserID",function(data){
        User_Id = data.rows[0].user_id;
        allProjects(User_Id);
    });
    // $.post("getProjectID",function(data){
    //     User_Id = data.rows[0].user_id;
    // });

    // this function handles the sidebar collapse
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    

    // shows the modal for project name 
    $("#new-project").on('click',() => {
        // clear remaining data from modal
        $("#modal-header").empty();
        $("#append-body").empty();

        // append modal title and input field and show modal
        $("#modal-header").append("New Project");
        $("#append-body").append("<input type='text' id='project-input' class='form-control' placeholder='project name'> </input>");
        $("#myModal").modal({show:true});
    });

    $("#modal-save").on('click', () =>{
        // send project name to database
        let projectName = $("#append-body #project-input").val().trim()
        project_name = projectName;
        $.post("project-add", {proj_name:projectName, user_id:User_Id}, function(data){
            if(data == "added"){
                        // add select to html
                $('#append-project').append('<a href="#'+ projectName.split(' ').join('_')+'" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">'+ projectName +'</a>')
                .append('<ul class="collapse list-unstyled" id="'+projectName.split(' ').join('_')+'"></ul>');
                $('#append-project').children().last().append('<li></li>');
                $('#append-project').children().last().children().last().append('<a href="#" onclick="selectProj(this);" id="'+projectName+'" >Select</a>');
                $('#append-project').children().last().append('<li></li>');
                $('#append-project').children().last().children().last().append('<a href="#" onclick="deleteProj(this);" id="'+projectName+'">Delete</a>');

                // hide modal
                $("#myModal").modal('hide');
            }else{
                alert(data);
            }
        });


    });

    $("#newStep").on('click',() => {
        console.log("test");

        // startup a modal
        // $("#card-input").prepend();
    });
 



    function allProjects(UserID){
        $.post("allProjects", {userID:UserID}, function(data){
            for(let i in data.rows){
                let projectName = data.rows[i].project_name;

                $('#append-project').append("<li id=side-"+projectName+"></li>")
                $('#append-project').children().last().append('<a href="#'+ projectName.split(' ').join('_')+'" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">'+ projectName +'</a>')
                .append('<ul class="collapse list-unstyled" id="'+projectName.split(' ').join('_')+'"></ul>');
                $('#append-project').children().last().children().last().append('<li></li>');
                $('#append-project').children().last().children().last().children().last().append('<a href="#" onclick="selectProj(this);" id="'+projectName+'" >Select</a>');
                $('#append-project').children().last().children().last().append('<li></li>');
                $('#append-project').children().last().children().last().children().last().append('<a href="#" onclick="deleteProj(this);" id="'+projectName+'">Delete</a>');
            }
        });
    }

});
function selectProj(project){
    // server get data from projectid and User_id
    $.post("getProjectData",function(data){
        // insert data to title

    });
    $.post("getStepsData",function(data){
        // insert data to body
        
    });
    console.log(project.id);
}




function deleteProj(project){
    $.post("deleteProject",{projectName:project.id},function(data){
        // insert data to body
        if(data == "deleted"){
            $("#side-"+project.id).remove()
        }
        console.log(data);
    });
}