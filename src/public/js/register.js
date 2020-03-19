$(document).ready(function(){
    $("#submit-button").on("click", function(event){
        let formData = $("#reg-submit").serializeArray();
        let displError = $("#form-messages");

        if (displError.children().length > 0){
            displError[0].style.display = "None";
            displError.empty();
        }

        if(formData[0].value==""){
            displError.append('<l1>Username cannot be empty! </li>');
            displError[0].style.display = "block";
        }
        if(formData[1].value==""){
            displError.append('<l1>Password cannot be empty! </li>');
            displError[0].style.display = "block";
        }

        if(formData[0].value !="" && formData[1].value !=""){
            $.post( "register",{username: formData[0].value, password: formData[1].value} ,function(error) {
                if( error == "Username has been taken!"){
                    displError.append('<l1>' + error +' </li>');
                    displError[0].style.display = "block";
                }else{
                    window.location.replace("login"); 
                }
            });
        }
    });
});
