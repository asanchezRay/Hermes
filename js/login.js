
//Funciones para ventanas modales
function mostrar(id) {
    console.log("debería mostrar");
    document.getElementById(id).style.visibility = 'visible';
}

function ocultar(id) {
    console.log("debería ocultar");
    document.getElementById(id).style.visibility = 'hidden';
}

//Cierra sesion
function salida(id) {
    document.location.href = 'logout.php';
}

//Funcion que gestiona el logueo
$(document).ready(function(){
  $("#boton_iniciar").on('click',function(){
    var c = document.getElementById("correoLog").value;
    var p = document.getElementById("passLog").value;
      console.log(c+p);
    if(validaCorreo(c) && validaPass(p)) {
        $.ajax({
            type:"POST",
            url:"index.php",
            data:{
                "opcion": "logueo",
                "correo": c,
                "contrasenia": p,
            },
            success:function(isLog){
                if(isLog) {
                    window.location.href = "hermes.php";
                }
                else {
                    mostrar("mCyCNoCoinciden");
                }
            },
            error:function(info){
                mostrar("mErrorServ");
            }
        });
        
    } else {
        mostrar("mCamposMalos");
    }
  });
});


//Valida el correo electronico. 
//Retorna un boolean
function validaCorreo(email_id) {
    //Expresion regular que comprueba el matcheo del patron con el del email
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email_id);
}


//valida contraseña
function validaPass(pass) {
    if(pass.length < 8 || pass.length > 20) return false;
    return true;
}


//valida nombre y apellido
function validaCadena(cadena) {
    if(cadena.length > 0 && cadena.length < 21) {
        var regex = /[A-Za-zÑñáéíóúÁÉÍÓÚ]/;
        return regex.test(cadena);
    }
    return false;
    
}


//Funcion que gestiona el ingreso
$(document).ready(function(){
    $("#boton_finalizar").on('click',function(){
        var nomb = document.getElementById("nombre_registro").value;
        var ap = document.getElementById("apellido_registro").value;
        var genero = $("input[name=genero]:checked").val();
        var nacimiento = document.getElementById("nacimiento").value;
        var peso = document.getElementById("peso").value;
        
        var pesoBien = peso > 0 && peso < 1000 ? true : false;
        
        var categoria = document.getElementById("categoria").value;
        var correo = document.getElementById("correoReg").value;
        var c1 = document.getElementById("c1").value;
        var c2 = document.getElementById("c2").value;
        
        console.log(nomb + " " + ap + " " + genero + " " + nacimiento + " " + peso + " " + categoria + " " + correo + " " + c1 + " " + c2 + " ");
        
        //typeof devuelve el tipo de la variable sin evaluarla primero
        if(validaCadena(nomb) && validaCadena(ap) && typeof genero !== 'undefined' && nacimiento !== "" && pesoBien && categoria !== "" && validaCorreo(correo) && validaPass(c1)) {
            if(c1 === c2) {
                var datos = "&nombre=" + nomb + "&apellido=" + ap + "&genero=" + genero + "&fecha_nac=" + nacimiento + "&peso=" + peso + "&categoria=" + categoria + "&correo=" + correo + "&contrasenia=" + c1 + "&opcion=" + "registro";
                $.ajax({
                    type: "POST",
                    url: "index.php",
                    data: datos,
                    success:function(reg) {
                        console.log(reg);
                        if(reg) { // Si registro es exitoso
                            mostrar("mRegistroExitoso");
                            $( "#aceptaRegistro" ).click(function() {  
                                location.reload();
                            });
                            
                        } else { //Ya hay alguien registrado con ese correo
                            mostrar("mErrorRegistro");
                        }
                    }, error:function() {
                        mostrar("mErrorServ");
                    }
                });

            } else {
                mostrar("mPassNoCoinciden");
            }
            
        } else {
            mostrar("mCamposMalos");
        }
      });
});

