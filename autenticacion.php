<?php
	session_start();
	if(!isset($_SESSION["correo"])){ // esta parte hay que cambiarla cuando guardemos el
									//id_usuario dentro de $_SESSION y asi validamos con eso_ supongo_
		header("Location: index.php");
		exit();
	}
?>
