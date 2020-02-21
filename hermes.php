<?php
    include("autenticacion.php");
    require("conexion.php");

    // Obtiene toda la informacion del usuario para ocuparla
    $consulta="SELECT * FROM usuario WHERE id_usuario = '$_SESSION[id_usuario]'";
    $resultado=mysqli_query($conexion,$consulta);
    $fila = mysqli_fetch_array($resultado);

    if(isset($_POST["opcion"])) {

        switch ($_POST["opcion"]) {
             case "sugRec":
                $tipodeServicio = $_POST["tipodeServicio"];
                $descripcion=$_POST["descripcion"];
                $fecha = date("Y-m-d");

                $consulta0 = "SELECT id_servicio FROM servicio WHERE tipo_servicio = '$tipodeServicio'";
                $res0 = mysqli_query($conexion, $consulta0);
                $row0 = mysqli_fetch_array($res0);

                $guardar="INSERT INTO sugerencia_usuarios (descripcion, id_usuario, id_servicio, fecha_sugerencia, importante) VALUES ('$descripcion', '$fila[id_usuario]', '$row0[id_servicio]', '$fecha', 'no')";
                $resultado=mysqli_query($conexion,$guardar);
                break;
            case "califica":
                $tipo_servicio = $_POST["tipoServicio"];
                $nota = $_POST["nota"];
                //Se obtiene el id del servicio
                $consulta2 = "SELECT id_servicio FROM servicio WHERE tipo_servicio = '$tipo_servicio'";
                $res = mysqli_query($conexion, $consulta2);
                $row2 = mysqli_fetch_array($res);

                //Comprueba de que el servicio se califico antes o no
                $comprueba = "SELECT nota FROM califica WHERE id_usuario = '$fila[id_usuario]' AND id_servicio = '$row2[id_servicio]'";
                $res3 = mysqli_query($conexion, $comprueba);
                $row3 = mysqli_fetch_array($res3);

                //Si devulve null es porque no se ha calificado antes

                if (is_null($row3)) {
                    $guardar = "INSERT INTO califica (id_usuario, id_servicio, nota) VALUES ('$fila[id_usuario]', '$row2[id_servicio]', '$nota')";
                    $resultado=mysqli_query($conexion,$guardar);

                } else {
                    $guardar = "UPDATE califica SET nota = '$nota' WHERE id_usuario = '$fila[id_usuario]' AND id_servicio = '$row2[id_servicio]'";
                    $resultado=mysqli_query($conexion,$guardar);
                }
                break;
            case "modifica":
                array_pop($_POST);
                foreach($_POST as $key=>$value){
                    //if($key != "" && $value != "") {
                    $guardar="UPDATE usuario SET ".$key." = '$value' WHERE id_usuario = '$fila[id_usuario]'";
                    $resultado = mysqli_query($conexion,$guardar);
                    //}
                }
                break;
            case "subefoto":
                $tam_archivo=$_FILES['uploadedfile']['size'];
                    if ($tam_archivo > 500000) {
                        echo 1;
                        die();
                        //"<div style='font-size: 80%'>Archivo mayor que 500KB, elija uno de menor tamaño.</div>";
                    } else if ($_FILES['uploadedfile']['type'] !="image/jpeg" && $_FILES['uploadedfile']['type'] !="image/png") {
                        echo 2;
                        die();
                        //"<div style='font-size: 80%'>Archivo inválido. Por favor suba uno con extensión 'JPEG' o 'PNG'.</div>";
                    } else {
                        $target_path = "fotossubidas/"; //ruta a guardar la imagen
                        $target_path = $target_path . basename( $_FILES['uploadedfile']['name']);
                        if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
                            $nombre_foto = $_FILES['uploadedfile']['name'];
                            //Renombra la foto guardada
                            rename("fotossubidas/$nombre_foto", "fotossubidas/$fila[correo].jpg");
                            echo 3;
                            die();
                            //"<script>alert('Foto de perfil cambiada')</script>";
                        } else{
                            echo 4;
                            die();
                            //"<div style='font-size: 80%'>Ha ocurrido un error, trate de nuevo!</div>";
                        }
                    }
                    $profileImage = "fotossubidas/$fila[correo].jpg";
                break;
            case "calificacionActual":
                $tipo_servicio = $_POST['valor'];

                $consulta_cA = "SELECT nota FROM califica c, servicio s WHERE c.id_servicio = s.id_servicio AND s.tipo_servicio = '$tipo_servicio' AND c.id_usuario = '$fila[id_usuario]'";
                $resultado_cA = mysqli_query($conexion,$consulta_cA);

                //retornara 1 fila, asi que esto esta bien
                $fila_cA = mysqli_fetch_array($resultado_cA);

                if($fila_cA['nota'] > 0) {
                    $i = 1;
                    echo "<p>Calificación actual:</p>";
                    while($i <= 5) {
                        if($i <= $fila_cA['nota']) {
                            echo "<i class='fas fa-star starActual' style='color: #f1c40f;'></i>";
                        } else {
                            echo "<i class='fas fa-star starActual' style='color: #23383f;'></i>";
                        }
                            $i++;
                        }
                    die();
                } else {
                    echo "<div style='padding-top: 10px;'>Este servicio no se ha calificado antes</div>";
                    die();
                }
                break;
        }
    }


?>

<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Hermes</title>
    <meta name="viewport" content="initial-scale=1.0">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.2/css/all.css" integrity="sha384-/rXc/GQVaYpyDdyxK+ecHPVYJSN9bmVFBvjA/9eOB+pb3F2w2N6fc5qB9Ew5yIns" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="js/index.js" defer></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCwTUXbFFxAJR85sbf3hvOgpa7fYLw6TXA&libraries=places,geometry&callback=initMap" defer ></script>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:400,700,900" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/demo.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/css-carousel.css" />

    <link rel="stylesheet" href="css/index.css">
    <link rel="shortcut icon" href="imagenes/favicon.ico">
    <link rel="stylesheet" href="css/mapIndex.css">

</head>
<body>
    <nav>
        <i class="fas fa-bars" id="iBarra" data-clicked="no"></i>
        <img id = "logo" src="imagenes/logo.png">
        <ul id="lista">
            <li onclick="mostrar('mRecomendaciones')"><i class="fas fa-bell"></i>Recomendaciones</li>
            <li onclick="mostrar('mInformacion');"><i class="fas fa-info-circle"></i>Información</li>
            <li onclick="mostrar('mSugerirRecomendacion');"><i class="fas fa-pencil-alt"></i>Sugerencias</li>
        </ul>

        <?php
            //Muestra la foto que tenga el usuario en su perfil
            $profileImage = "fotossubidas/$fila[correo].jpg";

            //Si no existe muestra la imagen por defecto
                if(!file_exists($profileImage)){
                    $profileImage = "fotossubidas/perfil_default.png";
                }
                echo "<img src=$profileImage class='imagen_usuario_menu' onclick= mostrar('mPerfilUsuario')>";
        ?>

        <div id="nombreUsuario">
            <?php
                echo " Hola, ".$fila['nombre']."";
            ?>

        </div>


        <i class="fas fa-power-off" id="iSalir" onclick="mostrar('mSalida');"></i>
    </nav>

    <div class="main">
        <div id="map"> </div>
    </div>

         <?php

        $consulta = "SELECT estado FROM usuario WHERE id_usuario = '$_SESSION[id_usuario]'";
        $res= mysqli_query($conexion,$consulta);

        while($row= mysqli_fetch_assoc($res)){
            $estado = $row["estado"];
        }
            if ($estado == 'primerizo') {

            ?>

<div id="pTutorial">
<div class="content"  style="width: 80%">

    <div class="css-carousel" id="mTutorial">


        <!-- carousel controls -->
        <input type="radio" name="carousel" id="carousel-1" checked />
        <input type="radio" name="carousel" id="carousel-2" />
        <input type="radio" name="carousel" id="carousel-3" />
        <input type="radio" name="carousel" id="carousel-4" />

        <!-- carousel navigation -->
        <div class="carousel-nav">
            <label for="carousel-1"></label>
            <label for="carousel-2"></label>
            <label for="carousel-3"></label>
            <label for="carousel-4"></label>
        </div>

        <!-- carousel slides -->
        <div class="carousel-slides">
        <div class="carousel-inner">


        <div class="carousel-item" >
        <div id="pAyudaTutorial">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('pTutorial');"></i>
            </div>
        <div class="centraVentanas">
        <h1 class="titulo">Tutorial</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicioruta" src="fotostutorial/inicioruta.png" width="100%" height="30%">
            <div id="contenedorfotos">
              <img id="ventanaRuta" src="fotostutorial/elegiruta.png" width="50%">
              <div id="textoAyuda">
                    <p>¿Como comenzar un recorrido?
                        Selecciona o escribe el lugar donde quieras ir en el recuadro <img src="fotostutorial/adondevamos.png" width="30%">, luego desliza que tipo de ruta quieres recorrer <img src="fotostutorial/rutaturismorapido.png" width="30%"> puede ser turismo, la cuál le entregará una ruta con distintas paradas turísticas para visitar o una ruta rápida, la cuál lo hará llegar rapidamente a su lugar de destino. Para comenzar la ruta solo basta con seleccionar el botón "Generar".
                        <br>
                        Además podrá reportar puntos conflictivos con las opciones de avanzar con cautela o no pasar <img src="fotostutorial/opcpuntoconflictivos.png" width="10%">y podrá ver los puntos conflictivos reportados seleccionando previamente la opción <img src="fotostutorial/mostrarpuntoconflictivo.png" width="8%">.
                        <br>
                        Podrá guardar sus lugares favoritos seleccionando <img src="fotostutorial/favoritos.png" width="6%"> </p> y se visualizarán en el mapa cuando seleccione la opcion <img src="fotostutorial/mostrarfavoritos.png" width="8%">.
               </div>
            </div>
        </div>
        </div>
        </div>
        </div>



        <div class="carousel-item">
        <div id="pAyudaTutorial">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('pTutorial');"></i>
            </div>
        <div class="centraVentanas">
        <h1 class="titulo">Tutorial</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowinicio" class="fas fa-long-arrow-alt-up"></i>
            <img id="fRecomendaciones" src="fotostutorial/recomendaciones.png" width="30%" >
            <div id="contenedorfotos">
            <img id="ventanaRecomendaciones" src="fotostutorial/ventanarecomendaciones.png" width="50%">
            <div id="textoAyuda">
                    <p>En esta ventana podra encontrar recomendaciones para su viaje en bicicleta, dependiendo de la hora del día y cuanta cantidad de agua debe consumir durante su recorrido.</p>
            </div>
            </div>
        </div>
        </div>
        </div>
        </div>



        <div class="carousel-item">
        <div id="pAyudaTutorial">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('pTutorial');"></i>
            </div>
        <div class="centraVentanas">
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowinicio0" class="fas fa-long-arrow-alt-up"></i>
            <img id="fDatosutiles" src="fotostutorial/datosutiles.png" width="20%">
            <div id="contenedorfotos">
            <img id="ventanaDatosUtiles" src="fotostutorial/ventanadatosutiles.png" width="50%">
            <div id="textoAyuda">
                    <p>Aquí podrá encontrar toda la información necesaria e importante, relacionada con normativas de bicicletas, bicicletas, terrenos, indumentaria y accesorios y salud, solo basta con seleccionar una de ellas para acceder a la información. </p>
            </div>
            </div>
        </div>
        </div>
        </div>
        </div>


        <div class="carousel-item">
        <div id="pAyudaTutorial">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('pTutorial');"></i>
            </div>
        <div class="centraVentanas">
        <h1 class="titulo">Tutorial</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowinicio2" class="fas fa-long-arrow-alt-up"></i>
            <img id="fSugerencias" src="fotostutorial/sugerencias.png" width="20%">
            <div id="contenedorfotos">
            <img id="ventanaSugerencias" src="fotostutorial/ventanasugerencias.png" width="50%">
                <div id="textoAyuda">
                <p>Podrá realizar sugerencias de alguno de los servicios entregados o sugerencias que usted cree que son necesaria para otros ciclistas. Para esto debe seleccionar el tipo de servicio, luego escribir la sugerencia para luego seleccionar ENVIAR. </p>
                </div>
            </div>
        </div>
        </div>
        </div>
        </div>





            </div>
        </div>
    </div>
</div>
            </div>

                    <?php
                 $consulta = "UPDATE usuario
                 SET estado = 'segundon'
                 WHERE id_usuario = '$_SESSION[id_usuario]';";
                 $query = mysqli_query($conexion,$consulta);

       }
        ?>

    <div class="modal" id="mAyudaMapa">
    <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaMapa');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicioruta" src="fotostutorial/inicioruta.png" width="100%" height="30%">
            <div id="contenedorfotos">
              <img id="ventanaRuta" src="fotostutorial/elegiruta.png" width="50%">
              <div id="textoAyuda">
                    <p>¿Como comenzar un recorrido?
                        Selecciona o escribe el lugar donde quieras ir en el recuadro <img src="fotostutorial/adondevamos.png" width="50%">, luego desliza que tipo de ruta quieres recorrer <img src="fotostutorial/rutaturismorapido.png" width="50%"> puede ser turismo, la cuál le entregará una ruta con distintas paradas turísticas para visitar o una ruta rápida, la cuál lo hará llegar rapidamente a su lugar de destino. Para comenzar la ruta solo basta con seleccionar el botón "Generar".
                        <br>
                        Además podrá reportar puntos conflictivos con las opciones de avanzar con cautela o no pasar <img src="fotostutorial/opcpuntoconflictivos.png" width="25%">y podrá ver los puntos conflictivos reportados seleccionando previamente la opción <img src="fotostutorial/mostrarpuntoconflictivo.png" width="15%">.
                        <br>
                        Podrá guardar sus lugares favoritos seleccionando <img src="fotostutorial/favoritos.png" width="13%"> </p> y se visualizarán en el mapa cuando seleccione la opcion <img src="fotostutorial/mostrarfavoritos.png" width="15%">.
               </div>
            </div>
        </div>
         </div>
    </div>
    </div>



    <div class="modal" id="mSugerirRecomendacion">
        <div id="pSugerirRecomendacion">
            <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mSugerirRecomendacion');"></i>
            <i class="far fa-question-circle iAyuda" onclick="mostrar('mAyudaSugerencias')"></i>
            </div>
            <div class="centraVentanas">
                <h1 class="titulo">Sugerencias</h1>
                <div id="servicios">
                    <p>Tipo de servicio a sugerir</p>
                    <select name="tipodeServicio" id="tipodeServicio">
                        <option value="" disabled selected>¿Que tipo de servicio va a sugerir?</option>
                        <option value="servicio_general">Servicio General </option>
                        <option value="rutas">Rutas</option>
                        <option value="recomendaciones">Recomendaciones</option>
                        <option value="informacion_ciclovias">Información de ciclovías</option>
                        <option value="ayuda">Ayuda</option>
                    </select>
                </div>
                <p>Indique en el cuadro de abajo una sugerencia para el tipo de servicio seleccionado arriba, que según su criterio sería útil para otros usuarios ciclistas</p>
                <div>
                    <textarea rows = "10" cols = "30" name = "descripcion" maxlength="300" minlength="1" id="descripcion"></textarea>
                </div>
                <input class="botonDeSeleccion" type="button" value="Enviar" onclick="avisoSugEnviada()">
            </div>
        </div>
    </div>

    <div class="modal" id="mAyudaSugerencias">
    <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaSugerencias');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowtutorial2" class="fas fa-long-arrow-alt-up"></i>
            <img id="fSugerencias" src="fotostutorial/sugerencias.png" width="20%">
            <div id="contenedorfotos">
              <img id="ventanaSugerencias" src="fotostutorial/ventanasugerencias.png" width="50%">
              <div id="textoAyuda">
                    <p>Podrá realizar sugerencias de alguno de los servicios entregados o sugerencias que usted cree que son necesaria para otros ciclistas. Para esto debe seleccionar el tipo de servicio, luego escribir la sugerencia para luego seleccionar ENVIAR. </p>
                    </div>
            </div>
            </div>
    </div>
</div>
    </div>


    <!--Modal cuando se envie una sugerencia-->
    <div class="modal" id="mSugerenciaEnviada">
        <div class="pVentanaEnviada">
            <div class="centraVentanas">
                <h1 class="titulo">Sugerencia Recibida</h1>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mSugerenciaEnviada');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal que muestra el perfil de usuario-->
    <div class="modal" id="mPerfilUsuario">
        <div id="pPerfilUsuario">
            <div id="marcoPerfil">
                <div class="centraVentanas">
                    <div class="contenedorCerrar">
                    <i class="far fa-times-circle iCerrar" onclick="ocultar('mPerfilUsuario');ocultar('ff')"></i>
                    <i class="far fa-question-circle iAyudablanco"  onclick="mostrar('mAyudaPerfil')"></i>
                    </div>
                <?php
                //Muestra la foto que tenga el usuario en su perfil
                $profileImage = "fotossubidas/$fila[correo].jpg";
                //echo $profileImage;

                //Si no existe muestra la imagen por defecto
                if(!file_exists($profileImage)){
                    $profileImage = "fotossubidas/perfil_default.png";
                }

                echo "<div><img src=$profileImage class='imagenUsuario' onmouseover=this.src='fotossubidas/cambia.png'; onmouseout=this.src='$profileImage'; onclick= mostrar('ff');></div>";
                ?>
                <?php echo "<h1>".$fila['nombre']." ".$fila['apellido']."</h1>";
                ?>
                <div>
                    <!--
                    <form enctype="multipart/form-data"  action="hermes-admin.php" method="POST" id='ff'>
                        <input name="uploadedfile" type="file" id="file"/>
                        <input type="button" value="Cancelar" onclick="ocultar('ff');">
                        <input type="submit" value="sub">
                    </form>
                    -->

                    <form enctype="multipart/form-data"  action="hermes.php" method="POST" style="visibility: hidden;" id='ff'>
                        <input name="uploadedfile" class="inputSubida" type="file" id="file"/>
                        <label class="botonInputSubida" for="file">Subir foto</label>
                        <input type="submit" value="Aceptar">
                        <input type="button" value="Cancelar" class="inputSubida" onclick="ocultar('ff');">
                        <label class="botonInputSubida" onclick="ocultar('ff');">Cancelar</label>

                    </form>

                </div>
                </div>
            </div>

            <div id="datosPerfil">
                <div class="contPerfil" id="MD" onclick="mostrarClick('MD','CDU', 'masMD', 'menosMD');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masMD"></i>
                    <i class="fas fa-minus iMenos" id="menosMD"></i>
                    <h3>Mis datos</h3>
                    <i class="fas fa-user-edit"></i>
                </div>

                    <div id='CDU' >
                        <div id="datosUsuario">
                            <?php

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Nombre</b></p>"."<div class='dato'>".$fila["nombre"]."</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Apellido</b></p>"."<div class='dato'>".$fila["apellido"]."</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Correo</b></p>"."<div class='dato'>".$fila["correo"]."</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Género</b></p>"."<div class='dato'>".$fila["genero"]."</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Fecha de nacimiento</b></p>"."<div class='dato'>".$fila["fecha_nac"]."</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Peso</b></p>"."<div class='dato'>".$fila["peso"]." Kg</div></div>";

                                echo "<div class='displayDato'><p style='font-size:90%;'><b>Categoria</b></p>"."<div class='dato'>".$fila["categoria"]."</div></div>";
                            ?>
                            <input id="edita" type="button" value="Editar" onclick="mostrar('mModificar');">
                        </div>
                    </div>

                <div style="text-align: center;"><input type="button" id= "bCalificar" onclick="mostrar('mCalificar'), ocultar('mPerfilUsuario');" value="Calificar a Hermes"></div>
                </div>
            </div>
        </div>
    </div>

        <div class="modal" id="mAyudaPerfil">
    <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaPerfil');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowtutorial3" class="fas fa-long-arrow-alt-up"></i>
            <img id="fPerfil" src="fotostutorial/perfil.png" width="10%" >
            <div id="contenedorfotos">
              <img id="ventanaPerfil" src="fotostutorial/ventanaperfil.png" width="50%">
            <div id="textoAyuda">
                    <p>Este es su perfil, en esta ventana podrá subir una foto que usted desee haciendo click en <img id="fotitoperfil" src="fotostutorial/perfil.png" width="15%" > luego aparecerá la opcion para subir la foto.
                        Además podrá ver sus datos seleccionando "Mis datos", una vez observando la ventana con sus datos, tiene la opción de editarlos haciendo "click" en <img src="fotostutorial/editar.png" width="15%" > </p>
                    </div>
            </div>
            </div>
            </div>
         </div>
    </div>


    <!--Modal para ingresar la modificacion de datos del usuario-->
    <div class="modal" id="mModificar">
        <div id="pModificar">
            <div class="centraVentanas">
                <h1 class="titulo">Modificar datos</h1>
                <p>Modifique los campos que quiera, el resto déjelos en blanco. Siga el formato, sino no se modificarán los datos.</p>
                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">Sólo letras de la A a la Z (se admiten tildes)</span>
                        <input type="text" class="inputRegistro" placeholder="Nombre" id="nombre_modifica" minlength="1" maxlength="20">
                    </div>
                </div>
                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">Sólo letras de la A a la Z (se admiten tildes)</span>
                        <input type="text" class="inputRegistro" placeholder="Apellido" id="apellido_modifica" minlength="1" maxlength="20">
                    </div>
                </div>
                <div>
                    <div class="tooltip">
                        <span class="tooltiptext">La contraseña debe tener como mínimo 8 caracteres y un máximo de 20</span>
                        <input class="inputRegistro" type="password" placeholder="Contraseña" id="c1" minlength="8" maxlength="20">
                    </div>
                </div>
                <div style="margin: 2%;">
                        <div class="tooltip">
                            <span class="tooltiptext">Marque una opcion</span>
                            <label><input type="radio" class="textoRegistro" value="hombre" name="genero"> Hombre</label>
                            <label><input type="radio" class="textoRegistro" value="mujer" name="genero"> Mujer</label>
                            <label><input type="radio" class="textoRegistro" value="otro" name="genero"> Otro</label>
                        </div>
                </div>
                <div>
                    <div class="tooltip">
                    <span class="tooltiptext">Para peso, ingrese un numero entero positivo. Para categoria, seleccione una de las opciones</span>
                    <input id="peso" type="number" min="1" max="999" placeholder="Peso(Kg)">
                    <select id="categoria" required>
                        <option value="" disabled selected>¿Qué tipo de ciclista es usted?</option>
                        <option value="ocasional">Ocasional </option>
                        <option value="regular">Regular</option>
                        <option value="deportista">Deportista</option>
                    </select>
                </div>
                </div>
                <input type="button" class="botonDeSeleccion" id="boton_modifica" value="Aceptar">
                <input type="button" class="botonDeSeleccion" style="background-color: #e83737;" onclick="ocultar('mModificar');" value="Cancelar">
            </div>
        </div>
    </div>

    <!--Campos modificados incorrectamente-->
    <div class="modal" id="mCamposMalos">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Algunos campos son inválidos, por favor, siga el formato</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mCamposMalos');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal cuando se envie una calificacion-->
    <div class="modal" id="mModificarExitoso">
        <div class="pVentanaEnviada">
            <div class="centraVentanas" style="padding-top: 10px;">
                <h1 class="titulo" style="padding-bottom: 10px;">Hecho</h1>
                <p>Datos modificados correctamente</p>
                <input type="button" id="cambiaDatos" class="botonDeSeleccion" onclick="ocultar('mModificarExitoso');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal para ingresar la calificacion del usuario-->
    <div class="modal" id="mCalificar">
        <div id="pCalificar">
            <!--<form action="hermes.php" method="post">-->
            <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mCalificar');limpiaCalifica();"></i>
            <i class="far fa-question-circle iAyuda"  onclick="mostrar('mAyudaCalificar')"></i>
            </div>
                <h1 class="titulo">Calificar a Hermes</h1>
                <div id='servicios'>
                    <p>Tipo de servicio a calificar</p>
                    <select name='tipoServicio' id='tipoServicio'>
                        <option value='' disabled selected>¿Qué servicio calificará?</option>
                        <option value='servicio_general'>Servicio General </option>
                        <option value='rutas'>Rutas</option>
                        <option value='recomendaciones'>Recomendaciones</option>
                        <option value='informacion_ciclovias'>Información de ciclovías</option>
                        <option value='ayuda'>Ayuda</option>
                    </select>
                </div>

                <div id='estrellasNotaActual'></div>

                <p>Nueva calificación: </p>
                <div class='rating'>
                    <i class='fas fa-star iStars' id='star1' value='5'></i>
                    <i class='fas fa-star iStars' id='star2' value='4'></i>
                    <i class='fas fa-star iStars' id='star3' value='3'></i>
                    <i class='fas fa-star iStars' id='star4' value='2'></i>
                    <i class='fas fa-star iStars' id='star5' value='1'></i>
                </div>
                <input class='botonDeSeleccion' type='button' value='Enviar' onclick='avisoCalifEnviada()'>
            </div>
        </div>
    </div>

    <div class="modal" id="mAyudaCalificar">
    <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaCalificar');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/ventanaperfil.png" width="80%" height="50%">
            <i id="arrowtutorial4" class="fas fa-long-arrow-alt-up"></i>
            <div id="contenedorfotos">
              <img  src="fotostutorial/calificar.png" width="50%">
            <div id="textoAyuda">
                    <p>Puede calificar algunos de los servicios ofrecidos por Hermes, solo debe seleccionar "¿Qué servicio calificará?" y elegir una de las opciones, luego debe calificar el servicio con nota de 1 a 5 representado por estrellas para finalmente enviar la calificación.</p>
                    </div>
            </div>
            </div>
            </div>
         </div>
    </div>

    <!--Modal cuando se envie una calificacion-->
    <div class="modal" id="mCalifEnviada">
        <div class="pVentanaEnviada">
            <div class="centraVentanas">
                <h1 class="titulo">Calificación Enviada</h1>
                <p>Gracias por usar Hermes</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mCalifEnviada');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal cuando no completa campos-->
    <div class="modal" id="mCampos">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Hay campos sin completar</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mCampos');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal cuando ya se hizo una calificacion anteriormente-->
    <div class="modal" id="mYaCalificada">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Ya se ha calificado anteriormente este servicio</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mYaCalificada');" value="Aceptar">
            </div>
        </div>
    </div>

    <div class="modal" id="mErrorServ">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Ha ocurrido un error al conectar con el servidor</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mErrorServ');" value="Aceptar">
            </div>
        </div>
    </div>

    <div class="modal" id="mErrorImgSize">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Archivo mayor que 500KB, elija uno de menor tamaño.</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mErrorImgSize');" value="Aceptar">
            </div>
        </div>
    </div>


    <div class="modal" id="mErrorImgFormat">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo" style="color: #e83737;">Error!</h1>
                <p>Archivo inválido. Por favor suba uno con extensión 'JPEG' o 'PNG'.</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mErrorImgFormat');" value="Aceptar">
            </div>
        </div>
    </div>

    <!--Modal de pregunta si quiere salir-->
    <div class="modal" id="mSalida">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo">Cerrar Sesión</h1>
                <p>¿Está seguro que desea salir de Hermes?</p>
                <input type="button" class="botonDeSeleccion" onclick="salida('mYaCalificada');" value="Aceptar">
                <input type="button" class="botonDeSeleccion" style="background-color: #e83737;" onclick="ocultar('mSalida');" value="Cancelar">
            </div>
        </div>
    </div>

    <!--Modal que muestra los datos utiles-->
    <div class="modal" id="mInformacion">
        <div id="pInformacion">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" style="padding-right: 10px;" onclick="ocultar('mInformacion');"></i>
            <i class="far fa-question-circle iAyuda" onclick="mostrar('mAyudaDatosUtiles')"></i>
            </div>
            <h1 class="titulo centraVentanas">Información</h1>

            <!--
            <div class="contMargenDU">
                <div class="contDU" id="eventos" onclick="mostrarClick('eventos','datosEv', 'masEv', 'menosEv');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masEv"></i>
                    <i class="fas fa-minus iMenos" id="menosEv"></i>
                    <h3>Grupos y eventos</h3>
                    <i class="fas fa-calendar-alt"></i>
                </div>

                <div id="datosEv">
                    <p style="font-size: 130%; color: #23383f;">Grupos de interés</p>
                    <div class="fbContainer">

                        <div id="fb-root"></div>
                        <script>
                        (function(d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return;
                            js = d.createElement(s); js.id = id;
                            js.src = 'https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v3.2';
                            fjs.parentNode.insertBefore(js, fjs);
                        }(document, 'script', 'facebook-jssdk'));
                        </script>

                        <p>Asociación Deportiva de Ciclismo de Concepción</p>
                        <div class="fb-page"
                          data-href="https://facebook.com/Asociacion-Deportiva-Ciclismo-Concepcion-569948786374382/"
                          data-width="350"
                          data-hide-cover="false"
                          data-show-facepile="false">
                        </div>

                        <p>Grupo de Ciclistas: Bío Bío Pedal</p>
                        <div class="fb-page"
                          data-href="https://facebook.com/Biobiopedal/"
                          data-width="350"
                          data-hide-cover="false"
                          data-show-facepile="false">
                        </div>

                        <p>Ciclismo deportivo: Federación Ciclista Chile</p>
                        <div class="fb-page"
                          data-href="https://www.facebook.com/federacionciclistadechile/"
                          data-width="350"
                          data-hide-cover="false"
                          data-show-facepile="false">
                        </div>

                    </div>

                    <p style="font-size: 130%; color: #23383f;">Eventos y Noticias</p>
                    <div class="fbContainer">
                        <div class="fb-page"
                            data-href="https://facebook.com/agendaconce/"
                            data-width="350"
                            data-hide-cover="false"
                            data-show-facepile="false">
                        </div>

                        <div class="fb-page"
                            data-href="https://www.facebook.com/centrobicicultura/"
                            data-width="350"
                            data-hide-cover="false"
                            data-show-facepile="false">
                        </div>
                    </div>


                </div>

            </div>
            -->

            <div class="contMargenDU">
                <div class="contDU" id="ley" onclick="mostrarClick('ley','datosLey', 'masLey', 'menosLey');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masLey"></i>
                    <i class="fas fa-minus iMenos" id="menosLey"></i>
                    <h3>Normativas de bicicletas</h3>
                    <i class="fas fa-gavel"></i>
                </div>

                <pre id="datosLey" style="display: none;">
                    <?php
                        //Read in the file and increase the font 200%
                        //retorna un string con el contenido si encuentra el fichero caso contrario false
                        $contenido = file_get_contents("ley.txt");
                        if($contenido)
                            echo "<p>$contenido</p>";
                        else
                            echo "Fichero no encontrado";
                    ?>
                </pre>
            </div>

            <!--
            <div class="contMargenDU">
                <div class="contDU" id="inst" onclick="mostrarClick('inst','datosInst', 'masInst', 'menosInst');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masInst"></i>
                    <i class="fas fa-minus iMenos" id="menosInst"></i>
                    <h3>Instituciones</h3>
                    <i class="fas fa-landmark"></i>
                </div>

                <div id="datosInst" style="display: none;">
                    <div>
                        <h3>Organismos importantes</h3>
                        <div style="display: flex;">
                            <img style="width: 150px; height: 90px;" src="imagenes/conaset.png">
                            <p>Comisión nacional de seguridad de tránsito:<br>
                            Propósito: Institución encargada de la seguridad vial<br>
                            Dirección: O´Higgins #77, piso 3, Edificio Independencia<br>
                            Página Web: <a href="https://www.conaset.cl/" target="_blank">Conaset.cl</a><br>
                            Teléfono de contacto: (41) 2741380 – (41) 274138<br>
                            Horario: Lunes a Viernes 08:30 a 13:30 horas</p>
                        </div>

                        <div>
                            <img src="imagenes/conce.png">
                            <p>Municipalidad de Conceción:<br>
                            Dirección: Calle Bernardo O`Higgins 525, Concepción<br>
                            Página Web: <a href="https://www.concepcion.cl/" target="_blank">Concepción.cl</a><br>
                            Teléfono de contacto: +56 41 226 6500<br>
                            Horario: Lunes a Viernes 08:30 a 13:30 horas</p>
                        </div>
                    </div>

                </div>
            </div>
            -->

            <div class="contMargenDU">
                <div class="contDU" id="bici" onclick="mostrarClick('bici','datosBici', 'masMB', 'menosMB');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masMB"></i>
                    <i class="fas fa-minus iMenos" id="menosMB"></i>
                    <h3>Bicicletas</h3>
                    <i class="fas fa-bicycle"></i>
                </div>
                <pre id="datosBici" style="display: none;">
                    <?php
                        //Read in the file and increase the font 200%
                        //retorna un string con el contenido si encuentra el fichero caso contrario false
                        $contenido = file_get_contents("bicicletas.txt");
                        if($contenido)
                            echo "<p>$contenido</p>";
                        else
                            echo "Fichero no encontrado";
                    ?>
                </pre>
            </div>
            <div class="contMargenDU">
                <div class="contDU" id="terrenos" onclick="mostrarClick('terrenos','datosT','masT','menosT');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masT"></i>
                    <i class="fas fa-minus iMenos" id="menosT"></i>
                    <h3>Terrenos</h3>
                    <i class="fas fa-road"></i>
                </div>
                <pre id="datosT" style="display: none;">
                    <?php
                        $contenido = file_get_contents("terrenos.txt");
                        if($contenido)
                            echo "<p>$contenido</p>";
                        else
                            echo "Fichero no encontrado";
                    ?>
                </pre>
            </div>
            <div class="contMargenDU">
                <div class="contDU" id="indum" onclick="mostrarClick('indum','datosI','masI','menosI');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masI"></i>
                    <i class="fas fa-minus iMenos" id="menosI"></i>
                    <h3>Indumentaria y accesorios</h3>
                    <i class="fas fa-tshirt"></i>
                </div>
                <pre id="datosI" style="display: none;">
                    <?php
                        $contenido = file_get_contents("indumentaria.txt");
                        if($contenido)
                            echo "<p>$contenido</p>";
                        else
                            echo "Fichero no encontrado";
                    ?>
                </pre>
            </div>
            <div class="contMargenDU">
                <div class="contDU" id="duSalud" onclick="mostrarClick('duSalud','datosS','masS','menosS');" data-clicked="no">
                    <i class="fas fa-plus iSuma" id="masS"></i>
                    <i class="fas fa-minus iMenos" id="menosS"></i>
                    <h3>Salud</h3>
                    <i class="fas fa-briefcase-medical"></i>
                </div>
                <pre id="datosS" style="display: none;">
                    <?php
                        $contenido = file_get_contents("salud.txt");
                        if($contenido)
                            echo "<p>$contenido</p>";
                        else
                            echo "Fichero no encontrado";
                    ?>
                </pre>
            </div>
        </div>

    </div>

     <div class="modal" id="mAyudaDatosUtiles">
     <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaDatosUtiles');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowtutorial1" class="fas fa-long-arrow-alt-up"></i>
            <img id="fDatosutiles" src="fotostutorial/datosutiles.png" width="20%">
            <div id="contenedorfotos">
              <img id="ventanaDatosUtiles" src="fotostutorial/ventanadatosutiles.png" width="50%">
              <div id="textoAyuda">
                    <p>Aquí podrá encontrar toda la información necesaria e importante, relacionada con normativas de bicicletas, bicicletas, terrenos, indumentaria y accesorios y salud, solo basta con seleccionar una de ellas para acceder a la información. </p>
                    </div>
            </div>
            </div>
            </div>
         </div>
    </div>


    <!--Modal que muestra las recomendaciones-->
    <div class="modal" id="mRecomendaciones">
        <div id="pRecomendaciones">
            <div class="centraVentanas" style="padding-bottom: 10px;">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mRecomendaciones');"></i>
            <i class="far fa-question-circle iAyuda" onclick="mostrar('mAyudaRecomendaciones')"></i>
            </div>
                <h1 class="titulo">Recomendaciones</h1>
                <div id="gHora">
                    <script type="text/javascript">
                         function startTime(){
                            today=new Date();
                            h=today.getHours();
                            m=today.getMinutes();
                            s=today.getSeconds();
                            m=checkTime(m);
                            s=checkTime(s);

                            document.getElementById('reloj').innerHTML=h+":"+m+":"+s;
                            t=setTimeout('startTime()',500);
                        }

                        //esta funcion me agrega un 0 cuando comienzan los segundo de nuevo 01,02...
                        function checkTime(i){
                            if (i<10) {i="0" + i;}
                            return i;
                        }
                        window.onload=function(){startTime();}
                    </script>

                      <div><h1 id="reloj"></h1></div>
                            <div id="dHora">
                                <?php
                                    date_default_timezone_set("America/Santiago");
                                    $hora_actual = date("H");


                                    if ($hora_actual>=21 && $hora_actual<=23) {
                                      ?>
                                        <p align="justify">Coloque en su bicicleta una luz roja trasera y adelante una blanca o amarilla, las más intensas que tengas. Utiliza ropa con aplicaciones reflectantes para ser más visible para los conductores, cuando es de noche uno de los elementos más seguros es el chaleco reflectante y en su casco, pedales, ruedas u horquilla, usa cintas reflectantes.</p>
                                        <?php
                                    }elseif ($hora_actual>=00 && $hora_actual<=07) {
                                        ?>
                                        <p align="justify">Coloque en su bicicleta una luz roja trasera y adelante una blanca o amarilla, las más intensas que tengas. Utiliza ropa con aplicaciones reflectantes para ser más visible para los conductores, cuando es de noche uno de los elementos más seguros es el chaleco reflectante y en su casco, pedales, ruedas u horquilla, usa cintas reflectantes.
                                       </p>
                                        <?php
                                    } else{
                                       ?>
                                        <p align="justify">Para circular de día, es recomendable colocar en su bicicleta una luz blanca brillante intermitente y utilizar ropa de colores claros, de esta manera podrás ser mas visible para los conductores. Además de un timbre o bocina para poder alertar a los peatones.
                                       </p>
                                        <?php
                                    }
                                    ?>



                      </div>
                </div>
                <div id="gDistancia">
                    <div id="iconruta"><i id="iconoruta" class="fas fa-map-marked-alt"></i></div>
                    <div id="dDistancia"><p align="justify">Es recomendable que para sesiones deportivas que duren más de 60 minutos: beber aprox. 400-800 ml de agua por hora, regularmente y en pequeñas cantidades (Ejemplo: 150 ml cada 15 minutos). Además sabias que los profesionales del ciclismo beben hasta 10 litros de líquidos durante las etapas largas!</p></div>

                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="mAyudaRecomendaciones">
    <div id="pAyuda">

        <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mAyudaRecomendaciones');"></i>
            </div>
        <h1 class="titulo">Ayuda</h1>

        <div id="contenedorAyuda">
            <img  id="fotoinicio" src="fotostutorial/inicio.png" width="100%" height="30%">
            <i id="arrowtutorial" class="fas fa-long-arrow-alt-up"></i>
            <img id="fRecomendaciones" src="fotostutorial/recomendaciones.png" width="30%" >
            <div id="contenedorfotos">
              <img id="ventanaRecomendaciones" src="fotostutorial/ventanarecomendaciones.png" width="50%">
            <div id="textoAyuda">
                    <p>En esta ventana podra encontrar recomendaciones para su viaje en bicicleta, dependiendo de la hora del día y cuanta cantidad de agua debe consumir durante su recorrido.</p>
                    </div>
            </div>
            </div>
            </div>
         </div>
    </div>

    <div class="modal" id="placeInfoDiv">
        <div class="placeInfo">
            <div class="centraVentanas">
                <h1 class="titulo">Detalles de este lugar</h1>
                <div id="placeInfoText"></div>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('placeInfoDiv');" value="Listo">
            </div>
        </div>
    </div>

<script>

</script>
</body>
</html>
