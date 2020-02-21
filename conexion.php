<?php
//------------Variables para conexion---------
$usuario = 'root';
$db = 'hermes';

//------------Aqui la conexion----------------
$conexion = mysqli_connect('localhost', $usuario, "", $db) or die("Database connection failed: " . mysqli_error($conn));//Se realiza la conexion

if(mysqli_connect_errno()){ //Si se detecta un error de conexion
    echo "Error de conexion con MySQL: ";
    mysqli_connect_error(); // Se muestra el error de conexion
}

?>
