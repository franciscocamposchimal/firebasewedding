
  var firebaseDatas = [];
  var paraEnviarSMS = [];
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
     busquedaRapida();
     $('#enviar').click(function (event) {
    event.preventDefault();
    var heAcept = confirm("¿Desea enviar las invitaciones a los invitados?");
    if (heAcept) {
      for (i in firebaseDatas) {
        const x = firebaseDatas[i]
        console.log(x)
        var longURL = "https://wedding-planning-2017.firebaseapp.com/invitacion.html?key="+x._id
        var url = `https://api.whatsapp.com/send?phone=521${x.tel}&text=${getSMSWithLink(longURL)}`
        window.open(url, '_blank')
      }

      return true
    }
  });

  $('#check-fab').click(function (event) {
    event.preventDefault();
    var heAcept = confirm("Desea enviar las invitaciones a los invitados marcados??");
    if (heAcept) {
      //console.log('ENTRO AL IF')
      var arrayData = firebaseDatas.filter(x => paraEnviarSMS.find(y => y.tel === x.snap.tel))

      for (i in arrayData) {
        const x = arrayData[i].snap
        var longURL = "https://wedding-planning-2017.firebaseapp.com/invitacion.html?key="+x._id;
        var url = `https://api.whatsapp.com/send?phone=521${x.tel}&text=${getSMSWithLink(longURL)}`
        window.open(url, '_blank')
      }

      return true
      var deltaArrayData = arrayData.filter(x => paraEnviarSMS.find(y => y.tel === x.tel))
      var datos = { "invitado": deltaArrayData };
      var stringDatos = JSON.stringify(datos);

      paraEnviarSMS.forEach(e => {
        var checkId = 'iconoCheck' + e._id
        $(`#${checkId}`).parent().removeClass('icon-check-checked');
        $(`#${checkId}`)[0].innerHTML = 'check_box_outline_blank';
      })

      paraEnviarSMS = [];
      verifyListAndToggleButtons();
    }
  });
});

function templateInvitado(snap) {

var checkId = 'iconoCheck' + snap._id;
var dataUpdate = Object.assign({snap})
    firebaseDatas.push(dataUpdate)

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
  parseInt(arrayInvitados);
   $("#invitadosTotales > li > div > strong").text(arrayInvitados);
}

  var filasMostrar = "";
  filasMostrar += '<li class="collection-item padre-li" id="remove' + snap._id + '" >' +
    '<div>' +
    '<div class="numero">' +
    '<p>' + snap.mesa + ',' + snap.invitados + '</p>' +
    '</div>' +
    '<div class="padre">' +
    '<div class="icon-check">' +
    '<i id="' + checkId + '" class="material-icons">' + iconoCheck + '</i>' +
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
$(".dropdown-button").dropdown();
//$(`#${checkId}`).on('click', () =>console.log('djhsakdja'));
$(`#${checkId}`).on('click', () => {
      var inList = paraEnviarSMS.find(x => x.key === snap._id)
     // console.info(paraEnviarSMS);
      if (inList) {
        paraEnviarSMS = paraEnviarSMS.filter(x => x.key !== snap._id);
        $(`#${checkId}`).parent().removeClass('icon-check-checked');
        $(`#${checkId}`)[0].innerHTML = 'check_box_outline_blank';
      } else {
        paraEnviarSMS.push({ key: snap._id, tel: snap.tel });
        $(`#${checkId}`).parent().addClass('icon-check-checked');
        $(`#${checkId}`)[0].innerHTML = 'check_box';
      }
      verifyListAndToggleButtons()
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
function getSMSWithLink (link) {
  return encodeURIComponent(`Hola! de nuevo! Confirma tu asistencia al evento click en el siguiente link: ${link}`) 
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