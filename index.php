<?php
    // Este es el login
    require("conexion.php");
    session_start();

    if(isset($_POST["opcion"])) {
      switch ($_POST["opcion"]) {
        case 'logueo':
          $correo = stripslashes($_REQUEST['correo']);
          $correo = mysqli_real_escape_string($conexion,$correo);
          $contrasenia = stripslashes($_REQUEST['contrasenia']);
          $contrasenia = mysqli_real_escape_string($conexion,$contrasenia);

          $query = "SELECT * FROM usuario WHERE correo='$correo' and contrasenia= '$contrasenia'";
          $result = mysqli_query($conexion,$query) ;

          $rows = mysqli_num_rows($result);

          if($rows == 1){
              $_SESSION['correo'] = $correo;
              $fila = mysqli_fetch_array($result);
              $_SESSION['id_usuario'] = $fila['id_usuario'];
              $_SESSION['nombre'] = $fila['nombre'];
              echo true;
              die();
          } else {
              echo false;
              die();
          }
          break;
        
        case 'registro':
          $nombre = $_POST["nombre"];
          $apellido = $_POST["apellido"];
          $genero = $_POST["genero"];
          $fecha_nac = $_POST["fecha_nac"];
          $peso = $_POST["peso"];
          $categoria = $_POST["categoria"];
          $correo = $_POST["correo"];
          $contrasenia = $_POST["contrasenia"];

          //Comprobacion de que el correo sea unico en la tabla usuario
          $query_comprobacion1 = "SELECT id_usuario FROM usuario WHERE correo = '$correo'";
          $result_comp1 = mysqli_query($conexion,$query_comprobacion1) ;
          $row_comprobacion1 = mysqli_num_rows($result_comp1);
          
          //Comprobacion de que el correo sea unico en la tabla usuario_admin
          $query_comprobacion2 = "SELECT id_usuario_admin FROM usuario_admin WHERE correo = '$correo'";
          $result_comp2 = mysqli_query($conexion,$query_comprobacion2) ;
          $row_comprobacion2 = mysqli_num_rows($result_comp2);
          
          // Si rows no retorna ningun resultado
          if($row_comprobacion1 < 1 && $row_comprobacion2 < 1) {
              $guardar="INSERT INTO usuario (nombre, apellido, genero, fecha_nac, peso, categoria, correo, contrasenia) VALUES ('$nombre', '$apellido', '$genero', '$fecha_nac','$peso','$categoria','$correo','$contrasenia')";
              $resultado=mysqli_query($conexion,$guardar);
              echo true;
          } else {
              //si retorna uno o mas resultados
              echo false;
              die();
          }
          break;
      }
    }
?>


<!DOCTYPE html>
<html lang="es">
<head>
  <title>Hermes</title>
  <meta name="viewport" content="initial-scale=1.0">
  <meta charset="utf-8">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <link rel="stylesheet" href="css/login.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  <script src="js/login.js" type="text/javascript"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.2/css/all.css" integrity="sha384-/rXc/GQVaYpyDdyxK+ecHPVYJSN9bmVFBvjA/9eOB+pb3F2w2N6fc5qB9Ew5yIns" crossorigin="anonymous">
  <link rel="shortcut icon" href="imagenes/favicon.ico">
</head>

<body>
  <!--Login-->
    <div class="mLogin" id="mEntrada">
   
        <div id="pLogin">
          <div class="centraVentanas">
            <h1 id="tInicio">Bienvenid@</h1>
            <img src="imagenes/logo.png" id="logoLogueo">
            <div>
              <div class="tooltip">
                <span class="tooltiptext">El correo debe tener el siguiente formato: 'caracteres@caracteres.dominio' (Requerido).</span>
                <input class="inputLogueo" type="email" id = "correoLog" placeholder="Correo electrónico">
              </div>
              <div class="tooltip">
                <span class="tooltiptext">La contraseña debe tener como mínimo 8 caracteres y un máximo de 20 (Requerido)</span>
                <input class="inputLogueo" type="password" id = "passLog" placeholder="Contraseña" minlength="8" && maxlength="20">
              </div>
            </div>
            <input id="boton_iniciar" type="button" value="Iniciar">
            <hr id="barraModal">
            <p id="notienescuenta">¿No tienes cuenta?</p>
            <input type="button" id="registrate" onclick="mostrar('mRegistro'), ocultar('mEntrada');" value="Regístrate">
          </div>
        <p id= "linkAdmin">¿Trabajas en Hermes? Entra <a href="index-admin.php">Aquí</a></p>
    </div>
    
    </div>
    
    <!--Registro-->
    <div class="mLogin" id="mRegistro">
        <div id="pRegistro">
            <div class="centraVentanas" style="position:relative">
                <i class="fas fa-arrow-left" id="iAtras" onclick="ocultar('mRegistro'), mostrar('mEntrada');"></i>
                <h1 id="tRegistro">Registro</h1>
                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">Sólo letras de la A a la Z (se admiten tildes). (Requerido)</span>
                        <input type="text" class="inputRegistro" placeholder="Nombre" id="nombre_registro" minlength="1" maxlength="20">
                    </div>
                    <div class="tooltip">
                        <span class="tooltiptext">Sólo letras de la A a la Z (se admiten tildes). (Requerido)</span>
                        <input type="text" class="inputRegistro" placeholder="Apellido" name="apellido" id="apellido_registro" minlength="1" maxlength="20">
                    </div>
                </div>

                <div style="margin-top: 2%;">
                    <div class="tooltip">
                        <span class="tooltiptext">Marque una opción(Requerido)</span>
                        <label><input type="radio" class="textoRegistro" value="hombre" name="genero"> Hombre</label>
                        <label><input type="radio" class="textoRegistro" value="mujer" name="genero"> Mujer</label>
                        <label><input type="radio" class="textoRegistro" value="otro" name="genero"> Otro</label>
                    </div>
                </div>

                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">(Requerido)</span>    
                        <p class="textoRegistro">Fecha de nacimiento</p>
                        <input id="nacimiento" type="date" placeholder="Fecha de nacimiento">
                    </div>
                </div>

                <div class="tooltip">
                    <span class="tooltiptext">Para peso, ingrese un numero entero positivo. Para categoria, seleccione una de las opciones. (Campos Requeridos)</span>
                    <input id="peso" type="number" min="1" max="999" placeholder="Peso(Kg)">
                    <select id="categoria" required>
                        <option value="" disabled selected>¿Qué tipo de ciclista es usted?</option>
                        <option value="ocasional">Ocasional </option>
                        <option value="regular">Regular</option>
                        <option value="deportista">Deportista</option>
                    </select>
                </div>
        
                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">El correo debe tener el siguiente formato: 'caracteres@caracteres.dominio' (Requerido)</span>
                        <input class="inputRegistro" type="email" placeholder="Correo electrónico" id="correoReg">
                    </div>
                    <div class="tooltip">
                        <span class="tooltiptext">La contraseña debe tener como mínimo 8 caracteres y un máximo de 20. (Requerido)</span>
                        <input class="inputRegistro" type="password" placeholder="Contraseña" id="c1" minlength="8" maxlength="20">
                        <input class="inputRegistro" type="password" placeholder="Confirmar contraseña" id="c2" minlength="8" maxlength="20">
                    </div>
                </div>
                <input id="boton_finalizar" type="button" value="Crear cuenta">
            </div>
        </div>
    </div>

    <div class="mLogin" id="mCamposMalos">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Algunos campos son inválidos, por favor, siga el formato</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mCamposMalos');" value="Aceptar">
            </div>
        </div>
    </div>
  
    <div class="mLogin" id="mCyCNoCoinciden">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Correo y/o Contraseña incorrectos</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mCyCNoCoinciden');" value="Aceptar">
            </div>
        </div>
    </div>
  
    <div class="mLogin" id="mErrorServ">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Ha ocurrido un error al conectar con el servidor</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mErrorServ');" value="Aceptar">
            </div>
        </div>
    </div>
  
    <div class="mLogin" id="mPassNoCoinciden">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Las contraseñas no coinciden</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mPassNoCoinciden');" value="Aceptar">
            </div>
        </div>
    </div>

    <div class="mLogin" id="mRegistroExitoso">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo">Registro Exitoso</h1>
                <p>¡Bienvenido!</p>
                <input type="button" id="aceptaRegistro" class="botonDeSeleccion" onclick="ocultar('mRegistroExitoso');" value="Aceptar">
            </div>
        </div>
    </div>
    
    <div class="mLogin" id="mErrorRegistro">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Ya existe una cuenta asociada a ese correo</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mErrorRegistro');" value="Aceptar">
            </div>
        </div>
    </div>
</body>
</html>
