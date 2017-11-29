

$(document).ready(function () {

    $("#search-form").submit(function (e) {
        e.preventDefault();
    });
    // alert(JSON.stringify(aray));
    $('input#phone').characterCounter();
    $('input#phone_edit').characterCounter();
    $('select').material_select();
    agregarDatos();
    mostrarDatos();

    $("#datos").on("click", ".borrar", elimina);
    $("#datos").on("click", ".editar", editar);

    $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        startingTop: '0%', // Starting top style attribute
        endingTop: '5%', // Ending top style attribute
    });

    $('#enviar').click(function (event) {
        event.preventDefault();
        var heAcept = confirm("Desea enviar las invitaciones a los invitados");
        if (heAcept) {
            for (i in firebaseDatas) {
                const x = firebaseDatas[i]
                console.log(x)
                var longURL = "https://wedding-planning-2017.firebaseapp.com/invitacion.html?key=" + x._id
                var url = `https://api.whatsapp.com/send?phone=521${x.tel}&text=${getSMSWithLink(longURL)}`
                window.open(url, '_blank')
            }

            return true;
        }
    });

    $('#check-fab').click(function (event) {
        event.preventDefault();
        var heAcept = confirm("Desea enviar las invitaciones a los invitados marcados");
        if (heAcept) {
            var arrayData = firebaseDatas
                .filter(x => paraEnviarSMS.find(y => y.tel === x.tel))

            for (i in arrayData) {
                const x = arrayData[i]
                var longURL = "https://wedding-planning-2017.firebaseapp.com/invitacion.html?key=" + x._id;
                var url = `https://api.whatsapp.com/send?phone=521${x.tel}&text=${getSMSWithLink(longURL)}`
                window.open(url, '_blank')
            }

            return true
            var deltaArrayData = arrayData.filter(x => paraEnviarSMS.find(y => y.tel === x.tel))
            var datos = { "invitado": deltaArrayData };
            var stringDatos = JSON.stringify(datos);
            paraEnviarSMS.forEach(e => {
                var checkId = 'iconoCheck' + e.key
                $(`#${checkId}`).parent().removeClass('icon-check-checked');
                $(`#${checkId}`)[0].innerHTML = 'check_box_outline_blank';
            })

            paraEnviarSMS = [];
            verifyListAndToggleButtons();
        }
    });
});
function getSMSWithLink(link) {
    return encodeURIComponent(`Hola! de nuevo! Confirma tu asistencia a la boda de Darany y Luis Carlos haciendo click en el siguiente link: ${link}`)
}
function agregarDatos() {
    $('#agregar').on("click", function (event) {
        event.preventDefault();
        var key = null;
        var name = $('#first_name').val();
        var numero = $('#phone').val();
        var token = localStorage.getItem('uid');

        $.ajax({
            type: 'POST',
            url: 'https://wedding-planning-api.herokuapp.com/api/new-invitado',
            dataType: 'json',
            data: { nombre: name, tel: numero },
            headers: {
                "Authorization": "Basic " + btoa(token)
            },
            success: function (data) {
                $('#first_name').val("");
                $('#phone').val("");
                console.log('response ', data);
                //var nombre = localStorage.getItem('uid');
            },
            error: function (xhr, status, errorThrown) {
                console.log('xhr response', xhr);
            }
        });
    });
}

function generateShortLink(pass1, tel) {
    return new Promise((resolve, reject) => {
        var pass2 = $.md5(tel);//tel md5
        var crypt = CryptoJS.AES.encrypt(pass1, pass2);//Este sera el pass1 donde pass1 es la key y el pass2 es el tel con md5
        //  console.log("md5: "+pass2);
        //  console.log("Crypt: "+crypt.toString());

        var longURL = "https://wedding-planning-2017.firebaseapp.com/invitacion.html?key=" + crypt.toString() + "&pass2=" + pass2;
        $.ajax({
            url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBUqyOal-Z-NDM3zH5QzwU7oIdkngCCHQs',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: '{ longUrl: "' + longURL + '"}',
            success: function (response) {
                console.log(response)
                var obj = { "tel": tel, "link": response.id };
                resolve(response.id)
            },
            error: function (err) {
                resolve('')
                console.error(err)
            }
        });
    })
}

function mostrarDatos() {

    $.ajax({
        type: 'GET',
        url: 'https://wedding-planning-api.herokuapp.com/api/invitados',
        success: function (data) {
            console.log("Invitados", data); //returns all of johnbob's friends
        },
        error: function (xhr, status, errorThrown) {
            console.log('xhr response:', xhr);
        }
    });

    buscar();

    ref.on("child_removed", function (snapshot) {
        var datos = snapshot.val();
        $("#remove" + snapshot.key).remove();
        firebaseDatas = firebaseDatas.filter(x => x._id !== snapshot.key);
        var dato = parseInt(datos.invitados);
        if (datos.asistencia == 1) {
            arrayInvitados = arrayInvitados - dato;
            $("#invitadosTotales > li > div > strong").text(arrayInvitados);
        }
    });

    ref.on("child_changed", function (snapshot) {
        var datos = snapshot.val();
        $("li#remove" + snapshot.key + " span.title strong").text(datos.nombre);
        $("li#remove" + snapshot.key + " span.cel").text(datos.tel);
        $("li#remove" + snapshot.key + " div.numero p").text(datos.mesa + "," + datos.invitados);
        var dato = parseInt(datos.invitados);
        if (datos.asistencia == 1) {
            arrayInvitados = arrayInvitados + dato;
            $("#invitadosTotales > li > div > strong").text(arrayInvitados);
        } else if (datos.asistencia == 2) {
            arrayInvitados = arrayInvitados - dato;
            $("#invitadosTotales > li > div > strong").text(arrayInvitados);
        }
        var icono = "access_time";
        if (datos.asistencia == 1) {
            icono = "done";
        } else if (datos.asistencia == 2) {
            icono = "not_interested";
        }
        $("li#remove" + snapshot.key + " div.icon-reloj i").text(icono);

        firebaseDatas = firebaseDatas.map(x => {
            if (x._id === snapshot.key) {
                return Object.assign({ _id: snapshot.key }, datos)
            }
            return x
        });
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

function elimina(e) {
    e.preventDefault();
    var isConfirmed = confirm("Seguro que deseas eliminar al invitado")
    if (!isConfirmed) return false
    var keyidEliminar = $(this).attr("data-key");
    var borraRef = lista.child(keyidEliminar);
    borraRef.remove();
}

var stateKey = null;
function editar(e) {
    e.preventDefault();

    var keyidEditar = $(this).attr("data-keyedit");

    var editarRef = lista.child(keyidEditar);
    stateKey = keyidEditar;

    editarRef.once("value", function (snap) {
        var datos = snap.val();

        $('#first_name_edit').val(datos.nombre);
        $('#phone_edit').val(datos.tel);
        $('#num_edit').val(datos.invitados);
        $('#estados').val(datos.asistencia).prop('selected', true);
        editarDatos(keyidEditar, datos.tel);
    });
}

function editarDatos(key, tel) {
    $('#editar').on("click", function (event) {
        event.preventDefault();
        if (stateKey !== key) return true;

        var editar = lista.child(key);
        // console.log(editar);
        var nombre_edit = $('#first_name_edit').val();
        var numero_edit = $('#phone_edit').val();
        var invitados = $('#num_edit').val();
        var estado = $('#estados').val();
        generateShortLink(key, numero_edit)
            .then(link => {
                console.log(link)
                editar.update({
                    link,
                    nombre: nombre_edit,
                    tel: numero_edit,
                    invitados: invitados,
                    asistencia: estado
                })
            })

        stateKey = null;
        // console.log(tel,numero_edit);
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

