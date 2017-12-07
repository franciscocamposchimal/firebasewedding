
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
     busquedaRapida();
});

function templateInvitado(snap) {

var checkId = 'iconoCheck' + snap._id;
var icono = "access_time";
var iconoCheck = "check_box_outline_blank";

if (snap.asistencia == 1) {
    icono = "done";
 } else if (snap.asistencia == 2) {
    icono = "not_interested";
  }

  var filasMostrar = "";
  filasMostrar += '<li class="collection-item padre-li" id="remove' + snap._id + '" >' +
  '<div>' +
  '<div class="numero" style="visibility: hidden;">' +
  '<p>' + snap.mesa + ',' + snap.invitados + '</p>' +
  '</div>' +
  '<div class="padre">' +
  '<div class="icon-check">' +
  '<i id="' + checkId + '" class="material-icons"  style="visibility: hidden;">' + checkId + '</i>' +
  '</div>' +
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
  '<a href="#" class="icon-send send" data-key="'+ snap._id + '"><i class="material-icons">send</i></a>' +
  '<br>' +
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
$('.send').on('click',function(){
    var URL = ''
    var url = `https://api.whatsapp.com/send?phone=521${snap.tel}&text=${getSMSWithLink(URL)}`
    window.open(url, '_blank')
});

}

function mostrarDatos() {
var token = localStorage.getItem('uid');
    $.ajax({
        type: 'GET',
        url: 'https://wedding-planning-api.herokuapp.com/api/invitados',
        headers : { 'Authorization' : token },
        success: function (data) {
            $.each(data.invitados, function( index, snap ) {
              templateInvitado(snap);
              });

              
        },
        error: function (xhr, status, errorThrown) {
            var message = xhr.responseJSON;
            console.log('status',xhr.status);
            alert(`No te has logueado correctamente: ${message.message}`);
            window.location.replace("https://wedding-planning-2017.firebaseapp.com/");
        }
    });
}

function verifyListAndToggleButtons() {
  var isEmptyCheckList = paraEnviarSMS.length === 0
  if (isEmptyCheckList) {
    $("#general-fab").removeClass('hidden');
    $("#check-fab").addClass('hidden');
  } else {
    $("#general-fab").addClass('hidden');
    $("#check-fab").removeClass('hidden');
  }
}
function getSMSWithLink(link) {
    return encodeURIComponent(`Hola! de nuevo! Gracias por tus regalos!`)
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

 function busquedaRapida() {
  $("#busquedaR").on("change", function () {
    var searchTerm = $('#busquedaR').val();
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

function logOut() {
  localStorage.clear();
  window.location.replace("https://wedding-planning-2017.firebaseapp.com/");
}