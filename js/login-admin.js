
//Funciones para ventanas modales
function mostrar(id) {
    console.log("debería mostrar");
    document.getElementById(id).style.visibility = 'visible';
}

function ocultar(id) {
    console.log("debería ocultar");
    document.getElementById(id).style.visibility = 'hidden';
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
            url:"index-admin.php",
            data:{
                "opcion": "logueo",
                "correo": c,
                "contrasenia": p,
            },
            success:function(isLog){
                if(isLog) {
                    window.location.href = "hermes-admin.php";
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


//Funcion que gestiona el registro
$(document).ready(function(){
    $("#boton_finalizar").on('click',function(){
        var nomb = document.getElementById("nombre_registro").value;
        var ap = document.getElementById("apellido_registro").value;
        var genero = $("input[name=genero]:checked").val();
        var nacimiento = document.getElementById("nacimiento").value;
        var correo = document.getElementById("correoReg").value;
        var c1 = document.getElementById("c1").value;
        var clave = document.getElementById("clave").value;
        
        console.log(nomb + " " + ap + " " + genero + " " + nacimiento + correo + " " + c1 + " " + clave + " ");
        
        //typeof devuelve el tipo de la variable sin evaluarla primero
        if(validaCadena(nomb) && validaCadena(ap) && typeof genero !== 'undefined' && nacimiento !== "" && validaCorreo(correo) && validaPass(c1)) {

                var datos = "&nombre=" + nomb + "&apellido=" + ap + "&genero=" + genero + "&fecha_nac=" + nacimiento + "&correo=" + correo + "&contrasenia=" + c1 + "&clave=" + clave + "&opcion=" + "registro";
                $.ajax({
                    type: "POST",
                    url: "index-admin.php",
                    data: datos,
                    success:function(reg) {
                        console.log("reg:" + typeof reg);
                        switch(reg) {
                            case "1":
                                //Clave mala
                                mostrar("mClaveMala");
                                break;
                            case "2":
                                //Usuario ya existente
                                mostrar("mErrorRegistro");
                                break;
                            case "3":
                                //Registro exitoso
                                mostrar("mRegistroExitoso");
                                $( "#aceptaRegistro" ).click(function() {  
                                    location.reload();
                                });
                        }
                    }, error:function() {
                        mostrar("mErrorServ");
                    }
                });
            
        } else {
            mostrar("mCamposMalos");
        }
      });
});

