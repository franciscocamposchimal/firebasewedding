

$(document).ready(function () {
    $('.modal').modal({
        dismissible: false
    });



    $('#modal1').modal('open');

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
                var nombre = localStorage.getItem('uid');
                console.log('Localstorage: ', nombre);
            },
            error: function (xhr, status, errorThrown) {
                localStorage.removeItem('uid');
                var message = xhr.responseJSON;
                console.log('status',xhr.status);
                alert(message.message);
                $('#modal1').modal('open');
            }
        });
        
    });
});