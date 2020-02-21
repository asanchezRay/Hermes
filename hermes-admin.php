<?php
    include("autenticacion.php");
    require("conexion.php");

    // Obtiene toda la informacion del usuario para ocuparla
    $consulta="SELECT * FROM usuario_admin WHERE id_usuario_admin = '$_SESSION[id_usuario]'";
    $resultado=mysqli_query($conexion,$consulta);
    $fila = mysqli_fetch_array($resultado);

    if(isset($_POST["opcion"])) {
        switch($_POST["opcion"]) {
            case "eliminaF":
                $query1 = "DELETE FROM sugerencia_usuarios WHERE cod = '$_POST[cod]'";
                $resultado1 = mysqli_query($conexion, $query1); 
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
            case "bookmark":
                $cod = $_POST['cod'];
                $fecha = date("Y-m-d");
                
                $query4 = "UPDATE sugerencia_usuarios SET id_usuario_admin = $fila[id_usuario_admin], fecha_marca = '$fecha', importante = 'si' WHERE cod = '$cod'";
                $resultado4 = mysqli_query($conexion, $query4);
                
                $query4 = "SELECT s.tipo_servicio, ua.correo FROM servicio s JOIN sugerencia_usuarios USING (id_servicio) JOIN usuario_admin ua USING (id_usuario_admin)";

                $resultado4 = mysqli_query($conexion, $query4);
                $fila_campos = mysqli_fetch_array($resultado4);
                $fila_campos['tipo_servicio'] = str_replace("_"," ",$fila_campos['tipo_servicio']);
                $campos = array($fila_campos['tipo_servicio'], $fila_campos['correo'], $fecha);
                echo json_encode($campos);
                die();
                break;
            case "deleteBookmark":
                $cod = $_POST['cod'];
                $query5 = "UPDATE sugerencia_usuarios SET id_usuario_admin = null, fecha_marca = null, importante = 'no' WHERE cod = '$cod'";
                $resultado5 = mysqli_query($conexion, $query5);

                $query5 = "SELECT id_servicio FROM sugerencia_usuarios WHERE cod = '$cod'";
                $resultado5 = mysqli_query($conexion, $query5);
                $fila_id = mysqli_fetch_array($resultado5);
                echo $fila_id['id_servicio'];
                die();
                break;
            
        }
    }
?>

<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Hermes - Administracion</title>
    <meta name="viewport" content="initial-scale=1.0">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.2/css/all.css" integrity="sha384-/rXc/GQVaYpyDdyxK+ecHPVYJSN9bmVFBvjA/9eOB+pb3F2w2N6fc5qB9Ew5yIns" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="js/index-admin.js" defer></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCwTUXbFFxAJR85sbf3hvOgpa7fYLw6TXA&libraries=places,geometry&callback=initMap" defer ></script>
    <link rel="stylesheet" href="css/index-admin.css">
    <link rel="shortcut icon" href="imagenes/favicon.ico">

  <!-- <link rel="stylesheet" href="css/mapIndex.css"> -->
</head>
<body>

    <nav>
        <i class="fas fa-bars" id="iBarra" data-clicked="no"></i>
        <img src="imagenes/logo.png" id="logo">
        <ul id="lista">
            <li onclick="mostrar('mSugerencias');"><i class="fas fa-pencil-alt"></i>Ver Sugerencias</li>
            <li onclick="mostrar('mCalificaciones');"><i class="far fa-star"></i>Ver Calificaciones</li>
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
<!--
    <div class="main">
        <div id="map"></div>
    </div>
-->
    <div class="modal" id="mSugerencias" style="visibility: hidden;">
        <div id="pSugerencias">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" style="padding-right: 10px;" onclick="ocultar('mSugerencias');"></i>
            </div>
            <div class="centraVentanas">
                <h1 class="titulo">Sugerencias de usuarios</h1>
                <div style="width:100%; text-align: right;">
                    <button id='botonMostrarSD' onclick="ocultar('mEliminar');mostrar('mDestacadas')"><i class='far fa-bookmark'></i> Sugerencias destacadas</button>
                </div>

                <div class="contMargenDU">
                    <div class="contDU" id="pestanaSG" onclick="mostrarClick('pestanaSG','datosSG','masSG','menosSG');" data-clicked="no">
                        <i class="fas fa-plus iSuma" id="masSG"></i>
                        <i class="fas fa-minus iMenos" id="menosSG"></i>
                        <h3>Servicio General</h3>
                    </div>
                    <div id="datosSG" style='display: none;'>
                        <?php
                            $consulta="SELECT r.id_usuario, u.nombre, u.apellido, r.cod, r.descripcion, r.fecha_sugerencia FROM sugerencia_usuarios r JOIN usuario u USING (id_usuario) JOIN servicio s USING (id_servicio) WHERE s.tipo_servicio = 'Servicio_general' AND r.importante = 'no' ORDER BY r.fecha_sugerencia ASC";
                                
                                $resultado=mysqli_query($conexion, $consulta);
                                

                                echo "<div style='overflow-x: auto;'>";
                                echo "<table id='tablaSG'>";
                                echo "<thead>";
                                echo "<tr>";
                                echo "<th>Código</th>";
                                echo "<th>Fecha</th>";
                                echo "<th>ID</th>";
                                echo "<th>Nombre</th>";
                                echo "<th>Apellido</th>";
                                echo "<th>descripción</th>";
                                echo "<th>Acción</th>";
                                echo "</thead>";
                                echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila1 = mysqli_fetch_array($resultado)) {
                                echo "<tr>";
                                echo "<td>".$fila1['cod']."</td>";
                                echo "<td>".$fila1['fecha_sugerencia']."</td>";
                                echo "<td>".$fila1['id_usuario']."</td>";
                                echo "<td>".$fila1['nombre']."</td>";
                                echo "<td>".$fila1['apellido']."</td>";
                                echo "<td>".$fila1['descripcion']."</td>";
                                echo "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'></i>";
                                echo "<i class='fas fa-trash trash'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo "</table>";
                            echo "</div>";
                        ?>
                    </div>
                </div>

                <!---->
                <div class="contMargenDU">
                    <div class="contDU" id="pestanaRuta" onclick="mostrarClick('pestanaRuta','datosRuta','masRuta','menosRuta');" data-clicked="no">
                        <i class="fas fa-plus iSuma" id="masRuta"></i>
                        <i class="fas fa-minus iMenos" id="menosRuta"></i>
                        <h3>Rutas</h3>
                    </div>
                    <div id="datosRuta" style='display: none;'>
                        <?php
                            // Obtiene toda la informacion del usuario para ocuparla
                            $consulta="SELECT r.id_usuario, u.nombre, u.apellido, r.cod, r.descripcion, r.fecha_sugerencia FROM sugerencia_usuarios r JOIN usuario u USING (id_usuario) JOIN servicio s USING (id_servicio) WHERE s.tipo_servicio = 'Rutas' AND r.importante = 'no' ORDER BY r.fecha_sugerencia ASC";
                            $resultado=mysqli_query($conexion,$consulta);
                            

                            echo "<div style='overflow-x: auto;'>";
                            echo "<table id='tablaRutas'>";
                            echo "<thead>";
                            echo "<tr>";
                            echo "<th>Código</th>";
                            echo "<th>Fecha</th>";
                            echo "<th>ID</th>";
                            echo "<th>Nombre</th>";
                            echo "<th>Apellido</th>";
                            echo "<th>descripción</th>";
                            echo "<th>Acción</th>";
                            echo "</thead>";
                            echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila1 = mysqli_fetch_array($resultado)) {
                                echo "<tr>";
                                echo "<td>".$fila1['cod']."</td>";
                                echo "<td>".$fila1['fecha_sugerencia']."</td>";
                                echo "<td>".$fila1['id_usuario']."</td>";
                                echo "<td>".$fila1['nombre']."</td>";
                                echo "<td>".$fila1['apellido']."</td>";
                                echo "<td>".$fila1['descripcion']."</td>";
                                echo "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'></i>";
                                echo "<i class='fas fa-trash trash'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo "</table>";
                            echo "</div>";
                        ?>
                    </div>
                </div>

                

                <!---->
                <div class="contMargenDU">
                    <div class="contDU" id="pestanaRec" onclick="mostrarClick('pestanaRec','datosRec','masRec','menosRec');" data-clicked="no">
                        <i class="fas fa-plus iSuma" id="masRec"></i>
                        <i class="fas fa-minus iMenos" id="menosRec"></i>
                        <h3>Recomendaciones</h3>
                    </div>
                    <div id="datosRec" style='display: none;'>
                        <?php
                            // Obtiene toda la informacion del usuario para ocuparla
                            $consulta="SELECT r.id_usuario, u.nombre, u.apellido, r.cod, r.descripcion, r.fecha_sugerencia FROM sugerencia_usuarios r JOIN usuario u USING (id_usuario) JOIN servicio s USING (id_servicio) WHERE s.tipo_servicio = 'Recomendaciones' AND r.importante = 'no' ORDER BY r.fecha_sugerencia ASC";
                            $resultado=mysqli_query($conexion,$consulta);
                    

                            echo "<div style='overflow-x: auto;'>";
                            echo "<table id='tablaRec'>";
                            echo "<thead>";
                            echo "<tr>";
                            echo "<th>Código</th>";
                            echo "<th>Fecha</th>";
                            echo "<th>ID</th>";
                            echo "<th>Nombre</th>";
                            echo "<th>Apellido</th>";
                            echo "<th>descripción</th>";
                            echo "<th>Acción</th>";
                            echo "</thead>";
                            echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila1 = mysqli_fetch_array($resultado)) {
                                echo "<tr>";
                                echo "<td>".$fila1['cod']."</td>";
                                echo "<td>".$fila1['fecha_sugerencia']."</td>";
                                echo "<td>".$fila1['id_usuario']."</td>";
                                echo "<td>".$fila1['nombre']."</td>";
                                echo "<td>".$fila1['apellido']."</td>";
                                echo "<td>".$fila1['descripcion']."</td>";
                                echo "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'></i>";
                                echo "<i class='fas fa-trash trash'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo "</table>";
                            echo "</div>";
                        ?>
                    </div>
                </div>

                <!---->
                <div class="contMargenDU">
                    <div class="contDU" id="pestanaIC" onclick="mostrarClick('pestanaIC','datosIC','masIC','menosIC');" data-clicked="no">
                        <i class="fas fa-plus iSuma" id="masIC"></i>
                        <i class="fas fa-minus iMenos" id="menosIC"></i>
                        <h3>Información de Ciclovias</h3>
                    </div>
                    <div id="datosIC" style='display: none;'>
                        <?php
                            // Obtiene toda la informacion del usuario para ocuparla
                            $consulta="SELECT r.id_usuario, u.nombre, u.apellido, r.cod, r.descripcion, r.fecha_sugerencia FROM sugerencia_usuarios r JOIN usuario u USING (id_usuario) JOIN servicio s USING (id_servicio) WHERE s.tipo_servicio = 'Informacion_ciclovias' AND r.importante = 'no' ORDER BY r.fecha_sugerencia ASC";
                            $resultado=mysqli_query($conexion,$consulta);
                    

                            echo "<div style='overflow-x: auto;'>";
                            echo "<table id='tablaIC'>";
                            echo "<thead>";
                            echo "<tr>";
                            echo "<th>Código</th>";
                            echo "<th>Fecha</th>";
                            echo "<th>ID</th>";
                            echo "<th>Nombre</th>";
                            echo "<th>Apellido</th>";
                            echo "<th>descripción</th>";
                            echo "<th>Acción</th>";
                            echo "</thead>";
                            echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila1 = mysqli_fetch_array($resultado)) {
                                echo "<tr>";
                                echo "<td>".$fila1['cod']."</td>";
                                echo "<td>".$fila1['fecha_sugerencia']."</td>";
                                echo "<td>".$fila1['id_usuario']."</td>";
                                echo "<td>".$fila1['nombre']."</td>";
                                echo "<td>".$fila1['apellido']."</td>";
                                echo "<td>".$fila1['descripcion']."</td>";
                                echo "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'></i>";
                                echo "<i class='fas fa-trash trash'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo "</table>";
                            echo "</div>";
                        ?>
                    </div>
                </div>

                <!---->
                <div class="contMargenDU" style="margin-bottom: 10px;">
                    <div class="contDU" id="pestanaAy" onclick="mostrarClick('pestanaAy','datosAy','masAy','menosAy');" data-clicked="no">
                        <i class="fas fa-plus iSuma" id="masAy"></i>
                        <i class="fas fa-minus iMenos" id="menosAy"></i>
                        <h3>Ayuda</h3>
                    </div>
                    <div id="datosAy" style='display: none;'>
                        <?php
                            // Obtiene toda la informacion del usuario para ocuparla
                            $consulta="SELECT r.id_usuario, u.nombre, u.apellido, r.cod, r.descripcion, r.fecha_sugerencia FROM sugerencia_usuarios r JOIN usuario u USING (id_usuario) JOIN servicio s USING (id_servicio) WHERE s.tipo_servicio = 'Ayuda' AND r.importante = 'no' ORDER BY r.fecha_sugerencia ASC";
                            $resultado=mysqli_query($conexion,$consulta);
                    

                            echo "<div style='overflow-x: auto;'>";
                            echo "<table id='tablaAy'>";
                            echo "<thead>";
                            echo "<tr>";
                            echo "<th>Código</th>";
                            echo "<th>Fecha</th>";
                            echo "<th>ID</th>";
                            echo "<th>Nombre</th>";
                            echo "<th>Apellido</th>";
                            echo "<th>descripción</th>";
                            echo "<th>Acción</th>";
                            echo "</thead>";
                            echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila1 = mysqli_fetch_array($resultado)) {
                                echo "<tr>";
                                echo "<td>".$fila1['cod']."</td>";
                                echo "<td>".$fila1['fecha_sugerencia']."</td>";
                                echo "<td>".$fila1['id_usuario']."</td>";
                                echo "<td>".$fila1['nombre']."</td>";
                                echo "<td>".$fila1['apellido']."</td>";
                                echo "<td>".$fila1['descripcion']."</td>";
                                echo "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'></i>";
                                echo "<i class='fas fa-trash trash'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo "</table>";
                            echo "</div>";
                        ?>
                    </div>
                </div>


            </div>
        </div>
    </div>

    <!--Campos modificados incorrectamente-->
    <div class="modal" id="mDestacadas" style="visibility: hidden;">
        <div id="pDestacadas">
            <div class="centraVentanas">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" onclick="ocultar('mDestacadas');"></i>
            </div>
                <h1 class="titulo">Sugerencias Importantes</h1>
                <p>A continuación se muestran las sugerencias que todos los administradores han marcado como importantes</p>

                <?php
                
                    $consulta="SELECT r.cod, r.id_usuario, r.descripcion, r.fecha_sugerencia, r.fecha_marca, s.tipo_servicio, u.nombre, u.apellido, ua.correo FROM usuario_admin ua JOIN sugerencia_usuarios r USING (id_usuario_admin) JOIN usuario u USING (id_usuario) JOIN servicio s USING(id_servicio) WHERE r.importante = 'si' ORDER BY r.fecha_sugerencia DESC";
                            $resultado=mysqli_query($conexion,$consulta);
                            

                            echo "<div style='overflow-x: auto;'><table id='tablaDestacados'>";
                            echo "<thead>";
                            echo "<tr>";
                            echo "<th>Codigo</th>";
                            echo "<th>Fecha</th>";
                            echo "<th>ID usuario</th>";
                            echo "<th>Nombre</th>";
                            echo "<th>Apellido</th>";
                            echo "<th>Descipción</th>";
                            echo "<th>Servicio</th>";
                            echo "<th>Destacado por</th>";
                            echo "<th>Fecha de marca</th>";
                            echo "<th>Acción</th>";
                            echo "</thead>";
                            echo "<tbody>";
                            //Muestra los promedios de notas
                            while($fila_destacada = mysqli_fetch_array($resultado)) {
                                echo "<tr id='$fila_destacada[cod]'>";
                                echo "<td>".$fila_destacada['cod']."</td>";
                                echo "<td>".$fila_destacada['fecha_sugerencia']."</td>";
                                echo "<td>".$fila_destacada['id_usuario']."</td>";
                                echo "<td>".$fila_destacada['nombre']."</td>";
                                echo "<td>".$fila_destacada['apellido']."</td>";
                                echo "<td>".$fila_destacada['descripcion']."</td>";
                                $fila_destacada['tipo_servicio'] = str_replace("_"," ",$fila_destacada['tipo_servicio']);
                                echo "<td>".$fila_destacada['tipo_servicio']."</td>";
                                echo "<td>".$fila_destacada['correo']."</td>";
                                echo "<td>".$fila_destacada['fecha_marca']."</td>";
                                echo "<td style='text-align: center;'><i class='fas fa-times desmarca' style='color:red;'></i></td>";
                                echo "</tr>";
                            }
                            echo "</tbody>";
                            echo '</table></div>';
                
                ?>

                
            </div>
        </div>
    </div>

    <!--Campos modificados incorrectamente-->
    <div class="modal" id="mExitoGuardar" style="visibility: hidden;">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo">Hecho</h1>
                <p>Se marcó como importante la sugerencia. Ahora aparecerá en "Sugerencias destacadas"</p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mExitoGuardar');" value="Aceptar">
            </div>
        </div>
    </div>





    <div class="modal" id="mDesmarcada">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo">Hecho</h1>
                <p>Se desmarcó la sugerencia.</p>
                <p><em>Nota: Las sugerencias desmarcadas se devuelven a la tabla del servicio que corresponde.</em></p>
                <input type="button" class="botonDeSeleccion" onclick="ocultar('mDesmarcada');" value="Aceptar">
            </div>
        </div>
    </div>

    <div class="modal" id="mEliminar">
        <div class="pAviso">
            <div class="centraVentanas">
                <h1 class="titulo">Aviso</h1>
                <p>Esta a punto de eliminar una sugerencia, desea continuar?</p>
                <input type="button" id='eliminaRow' class="botonDeSeleccion" onclick="ocultar('mEliminar');" value="Aceptar">
                <input type="button" class="botonDeSeleccion" style="background-color: #e83737;" onclick="ocultar('mEliminar');" value="Cancelar">
            </div>
        </div>
    </div>

    
    <div class="modal" id="mCalificaciones" style="visibility: hidden;">
        <div id="pCalificaciones">
            <div class="contenedorCerrar">
            <i class="far fa-times-circle iCerrar" style="padding-right: 10px;" onclick="ocultar('mCalificaciones');"></i>
            </div>
            <!--<form action="hermes.php" method="post">-->
            <div class="centraVentanas">
                <h1 class="titulo">Calificaciones</h1>
                <p>Promedio de Calificaciones de nuestros usuarios por tipo de servicio</p>
                <?php
                    
                    // Obtiene toda la informacion del usuario para ocuparla
                    $consulta="SELECT tipo_servicio, AVG(nota) AS promedio FROM califica c RIGHT JOIN servicio s USING(id_servicio) GROUP BY s.id_servicio";
                    $resultado=mysqli_query($conexion,$consulta);
                    
                    echo "<table>";
                    echo "<tr><th>Tipo de servicio</th><th>Nota</th>";
                    //Muestra los promedios de notas
                    while($fila2 = mysqli_fetch_array($resultado)) {
                        $fila2['promedio'] = round($fila2['promedio']);
                        $fila2['tipo_servicio'] = str_replace("_"," ",$fila2['tipo_servicio']);
                        
                        echo "<tr>";
                        echo "<td>".$fila2['tipo_servicio']."</td>";
                        echo "<td>";
                        
                        if($fila2['promedio'] > 0) {
                            echo "<div class='rating'>";
                            echo $fila2['promedio']." ";

                            $i = 1;
                            while($i <= 5) {
                                if($i <= $fila2['promedio']) {
                                    echo "<i class='fas fa-star iStars' style='color: #f1c40f;'></i>";    
                                } else {
                                    echo "<i class='fas fa-star iStars'></i>";    
                                }
                                $i++;
                            }
                            
                            if($fila2['promedio'] < 3) {
                                
                                echo "<i class='fas fa-exclamation' style='color: red; padding: 5px;'></i>";
                            }
                            echo "</div>";
                        } else {
                            echo "<p>No se registran notas</p>";
                        } 

                        "</td>";
                        echo "</tr>";
                    }
                    echo '</table>';
                ?>
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
                    </div>
                    <?php
                        //Muestra la foto que tenga el usuario en su perfil
                        $profileImage = "fotossubidas/$fila[correo].jpg";

                        //Si no existe muestra la imagen por defecto
                        if(!file_exists($profileImage)){
                            $profileImage = "fotossubidas/perfil_default.png";
                        }
                        echo "<div><img src=$profileImage class='imagenUsuario' onmouseover=this.src='fotossubidas/cambia.png'; onmouseout=this.src='$profileImage'; onclick= mostrar('ff');></div>";
                    ?>

                    <?php echo "<h1>".$fila['nombre']." ".$fila['apellido']."</h1>";?>
                <div>
                    <!--
                    <form enctype="multipart/form-data"  action="hermes-admin.php" method="POST" id='ff'>
                        <input name="uploadedfile" type="file" id="file"/>
                        <input type="button" value="Cancelar" onclick="ocultar('ff');">
                        <input type="submit" value="sub">
                    </form>
                    -->
                    
                    <form enctype="multipart/form-data"  action="hermes-admin.php" method="POST" style="visibility: hidden;" id='ff'>
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
                            ?>        
                        </div>
                    </div>
                
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

</body>
</html>
