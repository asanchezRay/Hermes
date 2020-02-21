<?php
include("autenticacion.php"); //Pregunto si estoy autentificado
require('conexion.php');

$opcion=$_POST['opcion'];
switch($opcion){

    case "ingresar_punto_conflictivo":
        $lat=$_POST['lat'];
        $lng=$_POST['lng'];
        $cat=$_POST['cat'];
        ingresar_punto_conflictivo($conexion,$lat,$lng,$cat);
        break;

    case "ingresar_lugar_favorito":
        $lat=$_POST['lat'];
        $lng=$_POST['lng'];
        ingresar_lugar_favorito($conexion,$lat,$lng);
        break;

    case "recuperar_puntos_conflictivos":
        recuperar_puntos_conflictivos($conexion);
        break;

    case "recuperar_lugares_favoritos":
        recuperar_lugares_favoritos($conexion);
        break;

    default:
        break;
}

function ingresar_punto_conflictivo($conexion,$lat,$lng,$cat){
  $estado = "activo";
  $id_usuario = $_SESSION['id_usuario'];
  $sql="INSERT INTO punto_conflictivo(lat, lng, tipo_punto_conflictivo, estado, id_usuario)
  VALUES ('$lat','$lng','$cat','$estado',$id_usuario)";

  if(mysqli_query($conexion,$sql)){
    echo "exito";
  }else{
    echo "error";
  }
}

function ingresar_lugar_favorito($conexion,$lat,$lng){
  $estado = "activo";
  $id_usuario = $_SESSION['id_usuario'];
  $sql="INSERT INTO lugares_de_interes(lat, lng, estado, id_usuario)
  VALUES ('$lat','$lng','$estado',$id_usuario)";

  if(mysqli_query($conexion,$sql)){
    echo "exito";
  }else{
    echo "error";
  }
}

function recuperar_puntos_conflictivos($conexion){
  $sql="SELECT * FROM punto_conflictivo";
  $resultado=mysqli_query($conexion,$sql);

  $arreglo=array();
  $i=0;
  while($data=mysqli_fetch_assoc($resultado)){
      $arreglo[$i]=$data;
      $i++;
  }

  echo json_encode($arreglo);
  mysqli_free_result($resultado);
}

function recuperar_lugares_favoritos($conexion){
  $id_usuario = $_SESSION['id_usuario'];
  $sql="SELECT * FROM lugares_de_interes WHERE id_usuario=$id_usuario";
  $resultado=mysqli_query($conexion,$sql);

  $arreglo=array();
  $i=0;
  while($data=mysqli_fetch_assoc($resultado)){
      $arreglo[$i]=$data;
      $i++;
  }

  echo json_encode($arreglo);
  mysqli_free_result($resultado);
}

?>
