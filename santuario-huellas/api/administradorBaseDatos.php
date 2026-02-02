<?php

//Creo la variable para añadir las opciones de la conexión
$opcionesPDO = array();
//Esta opción sirve para que cuando devuelva datos la base de datos obtenga los nombres de las columnas en vez de números de posición
$opcionesPDO[PDO::ATTR_DEFAULT_FETCH_MODE] = PDO::FETCH_ASSOC;
//Creo la variable PDO con la conexión de la base de datos local
$conexionBBDD = new PDO("mysql:host=127.0.0.1;dbname=santuario_huellas;charset=utf8", "root", "", $opcionesPDO);
//Obtengo los datos pasados al endpoint
$parametros = json_decode(file_get_contents('php://input'), true);

//Guardo en las variables usuario y contraseña de los pasados en la lectura del json enviado
$usuario = $parametros['usuario'];
$contrasena = $parametros['contrasena'];

//Preparo la consulta a MySQL pasando el usuario y contraseña
$consulta = $conexionBBDD->prepare("SELECT id FROM administradores WHERE usuario = :u AND password = :p");
//Ejecuto la consulta
$consulta->execute([':u' => $usuario, ':p' => $contrasena]);
//Guardo en una variable id el resultado
$id = $consulta->fetch();

//Codifico los datos que se envían a un formato json para que sea más entendible con las opciones de caracteres especiales 
echo json_encode($id);