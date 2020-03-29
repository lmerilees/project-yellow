let User_Id = 0;
let project_name;
$(document).ready(function () {


    $.post("getUser",function(data){
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

    // TODO
    // create model and append card to html
    $("#newStep").on('click',() => {
        console.log("test");
        // clear remaining data from modal
        $("#modal-header").empty();
        $("#append-body").empty();
        $("#append-foot").empty();

        // append modal title and input field and show modal
        $("#modal-header").append("New Step");
        $("#append-body").append("<input type='text' id='project-input' class='form-control' placeholder='Step name'> </input>");
        $("#append-body").append("<textarea class='form-control id='step-info' rows='3' placeholder=\"Step information\"></textarea> ");
        $("#append-foot").append('<button type="button" class="btn btn-primary" onclick="stepSave();" id="card-save">Save changes</button>');
        $("#myModal").modal({show:true});

    });

    // shows the modal for project name 
    $("#new-project").on('click',() => {
        // clear remaining data from modal
        $("#modal-header").empty();
        $("#append-body").empty();
        $("#append-foot").empty();

        // append modal title and input field and show modal
        $("#modal-header").append("New Project");
        $("#append-body").append("<input type='text' id='project-input' class='form-control' placeholder='project name'> </input>");
        $("#append-foot").append('<button type="button" class="btn btn-primary" onclick="saveProject()" id="project-save">Save changes</button>');
        $("#append-foot").append('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>');
        $("#myModal").modal({show:true});
    });
});

function saveProject(){
    // send project name to database
    let projectName = $("#append-body #project-input").val().trim()
    project_name = projectName;
    $.post("project-add", {proj_name:projectName, user_id:User_Id}, function(data){
        if(data == "added"){
            // add select to html
            $('#append-project').append("<li id="+projectName.split(' ').join('_')+"></li>")
            $('#append-project').children().last().append('<a href="#t'+ projectName.split(' ').join('_')+'" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">'+ projectName +'</a>')
            .append('<ul class="collapse list-unstyled" id="t'+projectName.split(' ').join('_')+'"></ul>');
            $('#append-project').children().last().children().last().append('<li></li>');
            $('#append-project').children().last().children().last().children().last().append('<a href="#" onclick="selectProj(this);" id="'+projectName+'" >Select</a>');
            $('#append-project').children().last().children().last().append('<li></li>');
            $('#append-project').children().last().children().last().children().last().append('<a href="#" onclick="deleteProj(this);" id="'+projectName+'">Delete</a>');

            // hide modal
            $("#myModal").modal('hide');
        }else{
            alert(data);
        }
    });
}


    //TODO
    // Load project - show cards
function selectProj(project){
    $("#title").empty();
    $("#card-input").empty();
    // server get data from projectid and User_id
    $.post("getProjectData", {projectName:project.id}, function(data){
        // this is where we populate the page with steps
        $("#title1").html(project.id);
        console.log(data)
        for(let i in data){
            $("#card-input").append('<div id="'+data[i].stepname.split(' ').join('_')+'" class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem;"> </div>');
            $("#card-input").children().last().css("margin", '10px');
            $("#card-input").children().last().append('<div class="card-body"></div>')
            $("#card-input").children().last().children().last().append('<h5 class="card-title">'+data[i].stepname+'</h5>')
            .append('<h6 class="card-text overflow-auto">'+data[i].stepinfo+'</h6>');
            // put checkbox here
            $("#card-input").children().last().append('<ul id="chk_'+data[i].stepname.split(' ').join('_')+'" class="list-group list-group-flush"></ul>')
            $("#card-input").children().last().append('<div class="card-body"></div>');
            $("#card-input").children().last().children().last().append('<a href="#" onclick="newTask(this)" class="card-link">New Task</a>');
            $("#card-input").children().last().children().last().append('<a href="#" onclick="stepDelete(this)" class="card-link">Delete Card</a>');
        }
    });
}




function deleteProj(project){
    
    $.post("deleteProject",{projectName:project.id},function(data){
        // insert data to body
        if(data == "deleted"){
            $("#"+project.id.split(' ').join('_')).remove()
            $("#title").empty();
            $("#card-input").empty();

        }
    });
}

 // sidebar
 function allProjects(UserID){
    $.post("allProjects", {userID:UserID}, function(data){
        for(let i in data.rows){
            let projectName = data.rows[i].project_name;
            $('#append-project').append("<li id="+projectName.split(' ').join('_')+"></li>")
            $('#append-project').children().last().append('<a href="#t'+ projectName.split(' ').join('_')+'" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">'+ projectName +'</a>')
            .append('<ul class="collapse list-unstyled" id="t'+projectName.split(' ').join('_')+'"></ul>');
            $('#append-project').children().last().children().last().append('<li></li>');
            $('#append-project').children().last().children().last().children().last().append('<a href="#" id="'+projectName+'" onclick="selectProj(this);">Select</a>');
            $('#append-project').children().last().children().last().append('<li></li>');
            $('#append-project').children().last().children().last().children().last().append('<a href="#" id="'+projectName+'" onclick="deleteProj(this);">Delete</a>');
        }
    });
}

function stepSave(){
    let cardName = $("#append-body #project-input").val().trim();
    let cardInfo = $("#append-body").children().last().val();
    let projectName = $("#title1").text();

    $.post("step-add", {cardName, cardInfo, projectName}, function(data){
        console.log(data);
       if(data.name != "error"){
            $("#card-input").append('<div id="'+cardName.split(' ').join('_')+'" class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem;"> </div>');
            $("#card-input").children().last().css("margin", '10px');
            $("#card-input").children().last().append('<div class="card-body"></div>')
            $("#card-input").children().last().children().last().append('<h5 class="card-title">'+cardName +'</h5>' + " ")
            .append('<h6 class="card-text overflow-auto">'+cardInfo+'</h6>' + " ");
            // put checkbox here
            $("#card-input").children().last().append('<ul id="chk_'+cardName.split(' ').join('_')+'" class="list-group list-group-flush"></ul>')
            $("#card-input").children().last().append('<div class="card-body"></div>');
            $("#card-input").children().last().children().last().append('<a href="#" onclick="newTask(this)" class="card-link">New Task</a>');
            $("#card-input").children().last().children().last().append('<a href="#" onclick="stepDelete(this)" class="card-link">Delete Card</a>');
            
            $("#myModal").modal('hide');
       }else{
        alert("Name error");
       }
    });
}

function stepDelete(step){
    let stepName = $(step).parent().parent().text().split(" ")[1];    
    let deleteThis = $(step).parent().parent();

    console.log(stepName);

    $.post("step-delete", {stepName}, function(data){
        if(data=="true"){
            deleteThis.remove()
        }
    })
}

function newTask(curItem){
    $("#modal-header").empty();
    $("#append-body").empty();
    $("#append-foot").empty();
    $("#modal-header").append("<h3 id='"+$(curItem).parent().prev().prev().children().first().text().split(" ").join('_')+"'>New Task</h3>");
    $("#append-body").append("<input type='text' id='task-input' class='form-control' placeholder='Step name'> </input>");
    $("#append-foot").append('<button type="button" class="btn btn-primary" onclick="taskSave(this);" id="card-save">Save changes</button>');
    $("#myModal").modal({show:true});
}

function taskSave(curItem){
    // append to database
    let taskName = $("#task-input").val();
    let stepName = $(curItem).parent().prev().prev().children().first().children().first()[0].id;

    $.post("task-add", {taskName, stepName}, function(data){

        $("#chk_"+ stepName).append('<li class="list-group-item"></li>').children().last()
        .append('<input class="form-check-input" type="checkbox" value="" id="t_'+taskid[0] +'"> ')
        .append('<label class="form-check-label" for="t_'+taskid[0]+'"> '+taskName+' </label>')
        .append('<button type="button" class="btn btn-primary" onclick="taskDelete(this);" id="card-save">Task Complete</button>');
        $("#myModal").modal('hide');

    });
}

function taskDelete(curItem){
    let deleteThis = $(curItem).parent().parent();
    let taskName = $(curItem).parent().prev().prev().children().first().text()
    let stepName = $(curItem).parent().parent().parent().text();
    
    $.post("task-delete", {taskName, stepName}, function(data){
            if(data=="true"){
                deleteThis.remove()
            }
    })
}