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
            $('#append-project').append("<li id="+projectName.split(' ').join('_')+"></li>");
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
        let cur;
        console.log(data);
        for(let i in data){
            steps = data[i].steps.replace(/[()]/g,'').split(",");
            tasks = data[i].tasks.replace(/[()]/g,'').split(",");
            console.log(steps);
            console.log(tasks);

            if(cur == data[i].steps){
                $('#chk_'+steps[1].split(' ').join('_')).append('<li class="list-group-item"></li>').children().last()
                .append('<input class="form-check-input" type="checkbox" value="" id="t_'+steps[1].split().join("_") +'" onclick="boxSelect(this)"> ')
                .append('<label class="form-check-label" for="t_'+steps[1].split().join("_")+'"> '+tasks[1]+' </label>')    
            }else{
                cur = data[i].steps
                $("#card-input").append('<div id="'+steps[1].split(' ').join('_')+'" class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem;"> </div>');
                $("#card-input").children().last().css("margin", '10px');
                $("#card-input").children().last().append('<div class="card-body" onclick="cardModal(this)"></div>')
                $("#card-input").children().last().children().last().append('<h5 class="card-title">'+steps[1]+'</h5>' + " ")
                .append('<h6 class="card-text overflow-auto">'+steps[2]+'</h6>');


                // NEED TO FIX THIS
                // $("#card-input").children().last()


                $("#card-input").children().last().append('<ul id="chk_'+steps[1].split(' ').join('_')+'" class="list-group list-group-flush"></ul>').children().last().append('<li class="list-group-item"></li>').children().last()
                .append('<input class="form-check-input" type="checkbox" value="" id="t_'+steps[1].split().join("_") +'" onclick="boxSelect(this)"> ')
                .append('<label class="form-check-label" for="t_'+tasks[1].split().join("_")+'"> '+tasks[1]+' </label>')
                $("#card-input").children().last().append('<div class="card-body"></div>');
                $("#card-input").children().last().children().last().append('<a href="#" onclick="newTask(this)" class="card-link">New Task</a>');
                $("#card-input").children().last().children().last().append('<a href="#" onclick="stepDelete(this)" class="card-link">Delete Card</a>');
            }
        }
    });
}





function deleteProj(project){
    if(project.id == $("#title1").text()){
        $("#title1").empty();
    }
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
            $("#card-input").children().last().append('<div class="card-body" onclick="cardModal(this)"></div>')
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
    let stepName = $(step).parent().parent().children().first().children().first().text()
    let deleteThis = $(step).parent().parent();

    console.log($(step).parent().parent().children().first().children().first().text());

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
        if(data.name != "error"){
            $("#chk_"+ stepName).append('<li class="list-group-item"></li>').children().last()
            .append('<input class="form-check-input" type="checkbox" value="" id="t_'+stepName.split().join("_") +'" onclick="boxSelect(this)"> ')
            .append('<label class="form-check-label" for="t_'+taskName.split().join("_")+'"> '+taskName+' </label>')
            $("#myModal").modal('hide');
        }
        console.log(data);
    });
}

function boxSelect(data){
    let stepname = data.id.substring(data.id.indexOf('_')+1)
    let taskname = $(data).next().text().trim();
    let bool;
    if(data.checked){
      bool = 'TRUE'
    } else{
      bool = 'FALSE'
    }
    $.post("alter-check", {data:bool , step:stepname, task:taskname}, function(data){
        console.log(data);
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

function cardModal(curItem){
    
    console.log($(curItem).children().first().text());
    // get card data

    // change modal data
    $("#modal-header").empty();
    $("#append-body").empty();
    $("#append-foot").empty();
    $("#modal-header").append("<h3>"+$(curItem).children().first().text()+"</h3>");
    
    // append info

    // get all checks

    // appends checks to page
    $("#append-body").append("");
    $("#append-foot").append('<button type="button" class="btn btn-primary" data-dismiss="modal" >Close</button>');
    $("#myModal").modal({show:true});

    // displat modal
}