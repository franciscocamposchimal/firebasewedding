

$(document).ready(function () {
    $('.modal').modal({
        dismissible: false
    });

    var session = localStorage.getItem('uid');
    console.log('Localstorage contiene: ', session);

    if(session == null){
        $('#modal1').modal('open');
        loginSession();   
    }

   
});

function loginSession(){
    $('#login').on("click", function (event) {
        event.preventDefault();
        var user = $('#user').val();
        var pass = $('#pass').val();
        var token = true;

        $.ajax({
            type: 'POST',
            url: 'https://wedding-planning-api.herokuapp.com/api/login',
            dataType: 'json',
            data: { email: user, password: pass, gettoken: token},
            success: function (data) {
                console.log('response ',data.token);
                localStorage.setItem('uid', JSON.stringify(data.token));
            },
            error: function (xhr, status, errorThrown) {
                localStorage.clear();
                var message = xhr.responseJSON;
                console.log('status',xhr.status);
                alert(message.message);
                $('#modal1').modal('open');

            }
        });
        
    });
}