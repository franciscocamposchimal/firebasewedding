var asistencia = 2;
var invitados = 0;

$(document).ready(function () {

 $('.modal').modal({
   dismissible: false
 });

 $('.modal1').modal({
   dismissible: false, // Modal can be dismissed by clicking outside of the modal
   startingTop: '0%', // Starting top style attribute
   endingTop: '5%', // Ending top style attribute
 });
 $('#cancelar').on("click",updateInvitado(asistencia,invitados));
 $('#aceptar').on("click",() =>{
   var numero = $('#person').val();
   asistencia = 1;
   invitados = numero;
   updateInvitado(asistencia,invitados);
 });
});

function updateInvitado(asistencia,invitados) {
 var asist = asistencia;
 var inv = invitados;
 var key = cryp();
 console.log(key)
$.ajax({
   type: 'PUT',
   url: `https://wedding-planning-api.herokuapp.com/api/invitado/${key}`,
   dataType: 'json',
   data: { invitados: inv, asistencia: asist},
   success: function (data) {
       console.log(data);
   },
   error: function (xhr, status, errorThrown) {
       var message = xhr.responseJSON;
       console.log('status',xhr.status);
       alert(message.message);
   }
});
}

function cryp() {
 const href = window.location.href.split("key=")[1]
 return href
}

function closer() {
 window.open('','_self').close()
}