$(document).ready(function(){
    $("#submit-button").on("click", function(event){
        let formData = $("#log-submit").serializeArray();
        let displError = $("#form-messages");

        if (displError.children().length > 0){
            displError[0].style.display = "None";
            displError.empty();
        }

        $.post("login",{username: formData[0].value, password: formData[1].value} ,function(error) {
            if( error == "Username or Password is incorrect!"){
                displError.append('<l1>' + error +' </li>');
                displError[0].style.display = "block";
            }else{
                console.log("test");
                window.location.replace("index"); 
            }
        });

    });
});