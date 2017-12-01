
 var firebaseDatas = [];
 var arrayInvitados= 0;

$(document).ready(function () {

    $("#search-form").submit(function (e) {
        e.preventDefault();
    });
    $("#deleteTerm").on("click",deleteTerm);
    $('input#phone').characterCounter();
    $('input#phone_edit').characterCounter();
    $('select').material_select();
    mostrarDatos();
    buscar();
    $('#agregar').on("click",agregarDatos);
    $("#datos").on("click", ".borrar", elimina);
    $("#datos").on("click", ".editar", getEditar);
    $("#editar").on("click",editar);

    $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        startingTop: '0%', // Starting top style attribute
        endingTop: '5%', // Ending top style attribute
    });
});

function templateInvitado(snap) {
    var checkId = 'iconoCheck' + snap._id;
    var dataUpdate = Object.assign({_id: snap._id}, snap);

    var icono = "access_time";
    var iconoCheck = "check_box_outline_blank";

    if (snap.asistencia == 1) {
        icono = "done";
     } else if (snap.asistencia == 2) {
        icono = "not_interested";
      }
      if (snap.asistencia == 1){
           var dato = parseInt(snap.invitados);
           arrayInvitados = arrayInvitados + dato ;
      $("#invitadosTotales > li > div > strong").text(arrayInvitados);
      }
      var filasMostrar = "";
      filasMostrar += '<li class="collection-item padre-li" id="remove' + snap._id + '" >' +
      '<div>' +
      '<div class="numero">' +
      '<p>' + snap.mesa + ',' + snap.invitados + '</p>' +
      '</div>' +
      '<div class="padre">' +
      '<div class="icon-reloj">' +
      '<i class="material-icons">' + icono + '</i>' +
      '</div>' +
      '<div class="ajuste-icon">' +
      '<div class="ajuste-icon-int">' +
      '<i class="material-icons">face</i>' +
      '</div>' +
      '<div class="ajuste-icon-int-2">' +
      '<span class="title"> <strong>' + snap.nombre + '</strong> </span>' +
      '</div>' +
      '</div>' +
      '<a href="#" class="secondary-content dropdown-button" data-activates="x' + snap._id + '"><i class="material-icons">more_vert</i></a>' +
      '<ul id="x' + snap._id + '" class="dropdown-content">' +
      '<li><a class="modal-trigger editar" href="#modal3" data-keyedit="' + snap._id + '">Editar</a></li>' +
      '<li><a class="borrar" data-key="' + snap._id + '">Eliminar</a></li>' +
      '</ul>' + '<br>' +
      '<div class="ajuste-icon-2">' +
      '<div class="ajuste-icon-int">' +
      '<i class="material-icons">phone_android</i>' +
      '</div>' +
      '<div class="ajuste-icon-int-2">' +
      '<span class="cel">' + snap.tel + '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</li>';

    $('#datos').prepend(filasMostrar);
    $(".dropdown-button").dropdown();
}

function mostrarDatos() {
    var token = localStorage.getItem('uid');
    console.log('token recuperado:', token);
 
        $.ajax({
            type: 'GET',
            url: 'https://wedding-planning-api.herokuapp.com/api/invitados',
            headers : { 'Authorization' : token },
            success: function (data) {
                //console.log("Invitados", data.invitados);
                $.each(data.invitados, function( index, snap ) {
                    console.log(snap);
                  templateInvitado(snap);
                  });
            },
            error: function (xhr, status, errorThrown) {
                var message = xhr.responseJSON;
                console.log('status',xhr.status);
                alert(`No te has logueado correctamente: ${message.message}`);
                window.location.replace("http://localhost:5000/");
            }
        });
 }

function agregarDatos(e) {
        e.preventDefault();
        var key = null;
        var name = $('#first_name').val();
        var numero = $('#phone').val();
        var token = localStorage.getItem('uid');
        console.log('token recuperado:', token);

        $.ajax({
            type: 'POST',
            url: 'https://wedding-planning-api.herokuapp.com/api/new-invitado',
            dataType: 'json',
            data: { nombre: name, tel: numero },
            headers : { 'Authorization' : token },
            success: function (data) {
                $('#first_name').val("");
                $('#phone').val("");
                var snap = data.invitado;
                templateInvitado(snap);
                alert('Invitado agregado con éxito');
            },
            error: function (xhr, status, errorThrown) {
                var message = xhr.responseJSON;
                console.log('status',xhr.status);
                alert(message.message);
            }
        });
}

function elimina(e) {
    e.preventDefault();
    var isConfirmed = confirm("Seguro que deseas eliminar al invitado")
    if (!isConfirmed) return false
    var idDelete = $(this).attr("data-key");
    var token = localStorage.getItem('uid');

    $.ajax({
        type: 'DELETE',
        url:  `https://wedding-planning-api.herokuapp.com/api/invitado/${idDelete}`,
        headers : { 'Authorization' : token },
        success: function (data) {
            var snap = data.invitado;
            $("#remove" + snap._id).remove();
        },
        error: function (xhr, status, errorThrown) {
            var message = xhr.responseJSON;
            console.log('status',xhr.status);
            alert(message.message);
        }
    });
    
  }

  function getEditar(e) {
    e.preventDefault();
    var idEdit = $(this).attr("data-keyedit");
    
    $.ajax({
        type: 'GET',
        url:  `https://wedding-planning-api.herokuapp.com/api/invitado/${idEdit}`,
        success: function (data) {
            var snap = data.invitado;
            $('#idEditar').val(snap._id);
            $('#first_name_edit').val(snap.nombre);
            $('#phone_edit').val(snap.tel);
            $('#num_edit').val(snap.invitados);
            $('#estados').val(snap.asistencia).prop('selected',true);
        },
        error: function (xhr, status, errorThrown) {
            var message = xhr.responseJSON;
            console.log('status',xhr.status);
            alert(message.message);
        }
    });
}

function editar(e) {
    e.preventDefault();
    var id_edit = $('#idEditar').val();
    var nombre_edit = $('#first_name_edit').val();
    var numero_edit = $('#phone_edit').val();
    var invitados_edit = $('#num_edit').val();
    var estado = $('#estados').val();

    
    $.ajax({
        type: 'PUT',
        url: `https://wedding-planning-api.herokuapp.com/api/invitado/${id_edit}`,
        dataType: 'json',
        data: { nombre: nombre_edit, tel: numero_edit, invitados: invitados_edit, asistencia: estado},
        success: function (data) {
            $('#first_name').val("");
            $('#phone').val("");
            var snap = data.invitado;
            $("li#remove" + snap._id + " span.title strong").text(snap.nombre);
            $("li#remove" + snap._id + " span.cel").text(snap.tel);
            $("li#remove" + snap._id + " div.numero p").text(snap.mesa + "," + snap.invitados);
            var icono = "access_time";
            if (snap.asistencia == 1) {
              icono = "done";
            } else if (snap.asistencia == 2) {
              icono = "not_interested";
            }
            $("li#remove" + snap._id + " div.icon-reloj i").text(icono);
            alert('Invitado actualizado con éxito');
        },
        error: function (xhr, status, errorThrown) {
            var message = xhr.responseJSON;
            console.log('status',xhr.status);
            alert(message.message);
        }
    });
}

function buscar() {
    $("#search").on("keyup", function () {
      var searchTerm = $(this).val().toLowerCase();
      $("#datos > li").each(function () {
        var lineaDatos = $(this).text().toLowerCase();
        if (lineaDatos.indexOf(searchTerm) === -1) {
          $(this).addClass("hidden");
        } else {
          $(this).removeClass("hidden");
        }
      });
    });
  }
function deleteTerm(e) {
    e.preventDefault();
    $('#search').val("");
    $("#datos > li").removeClass("hidden");
}
