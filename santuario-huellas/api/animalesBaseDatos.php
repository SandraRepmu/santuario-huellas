<?php

//Creo la variable para añadir las opciones de la conexión
$opcionesPDO = array();
//Esta opción sirve para que cuando devuelva datos la base de datos obtenga los nombres de las columnas en vez de números de posición
$opcionesPDO[PDO::ATTR_DEFAULT_FETCH_MODE] = PDO::FETCH_ASSOC;
//Creo la variable PDO con la conexión de la base de datos local
$conexionBBDD = new PDO("mysql:host=127.0.0.1;dbname=santuario_huellas;charset=utf8", "root", "", $opcionesPDO);
//Obtengo de llamar al endpoint (PUT, POST, GET, DELETE)
$metodo = $_SERVER['REQUEST_METHOD'];

//Si se ha llamado como un get entro en esta parte de código
if ($metodo === 'GET') {
  //Encaso que contenga el parámetro id es que es una consulta por id
  if (isset($_GET['id'])) {
    //Guardo en la variable id el id del parámetro pasándolo a entero
    $id = (int)$_GET['id'];
    //Creo la variable y guardo la consulta de obtener por id
    $consulta = $conexionBBDD->prepare("SELECT * FROM animales WHERE fecha_adopcion IS NULL AND id = :id");
    //Ejecuto la consulta sustituyendo el id por la de la variable
    $consulta->execute([':id' => $id]);
    // Guardo el resultado de la consulta en una variable resultado y la envío como Json
    $resultado = $consulta->fetch();
    
    //Envío en formato json al javascript
    echo json_encode($resultado);
  }
  //En caso que contenga el parámetro ultimos es que es una consulta obteniendo los 3 últimos insertados que no sean adoptados
  else if (isset($_GET['ultimos'])) {
    //Ejecuto directamente la consulta y la envío como Json
    $consulta = $conexionBBDD->query("SELECT * FROM animales WHERE fecha_adopcion IS NULL ORDER BY fecha_creacion DESC LIMIT 3");

    //Envío en formato json al javascript
    echo json_encode($consulta->fetchAll());
  }
  //En caso que contenga el parámetro listado es que es una consulta obteniendo todos los que no sean adoptados
  else if (isset($_GET['listado'])) {
    //Ejecuto directamente la consulta y la envío como Json
    $consulta = $conexionBBDD->query("SELECT id, nombre, descripcion, especie, edad, sexo, tamano, raza, vacunas, esterilizado, foto FROM animales WHERE fecha_adopcion IS NULL ORDER BY id DESC");

    //Envío en formato json al javascript
    echo json_encode($consulta->fetchAll());
  }
  //En otro caso ejecuto directamente la consulta de obtener todos los animales y lo envío como json
  else{
    $consulta = $conexionBBDD->query("SELECT id, nombre, descripcion, especie, edad, sexo, tamano, raza, vacunas, esterilizado, foto, fecha_adopcion FROM animales ORDER BY id DESC");

    //Envío en formato json al javascript
    echo json_encode($consulta->fetchAll());
  }
  
}

//Si se ha llamado como un post entro en esta parte de código
else if ($metodo === 'POST') {
  //Obtengo los parámetros para insertar en la tabla de animales
  $parametros = json_decode(file_get_contents('php://input'), true);
  //Creo la variable y guardo la consulta para insertar
  $consulta = $conexionBBDD->prepare("INSERT INTO animales (nombre, descripcion, especie, edad, sexo, tamano, raza, vacunas, esterilizado, foto, historia, microchip) VALUES (:nombre, :descripcion, :especie, :edad, :sexo, :tamano, :raza, :vacunas, :esterilizado, :foto, :historia, :microchip)");
  //Sustituyo cada campo de la base de datos por el parámetro concreto y ejecuto la consulta
  $consulta->execute([
    ':nombre' => $parametros['nombre'] ?? 'Sin nombre',
    ':descripcion' => $parametros['descripcion'] ?? null,
    ':especie' => $parametros['especie'] ?? null,
    ':edad' => isset($parametros['edad']) && $parametros['edad'] !== '' ? (int)$parametros['edad'] : null, //En este caso si no se informa edad o viene vacío lo indico nulo
    ':sexo' => $parametros['sexo'] ?? 'Desconocido',
    ':tamano' => $parametros['tamano'] ?? 'Mediano',
    ':raza' => $parametros['raza'] ?? null,
    ':vacunas' => !empty($parametros['vacunas']) ? 1 : 0,
    ':esterilizado' => !empty($parametros['esterilizado']) ? 1 : 0,
    ':foto' => $parametros['foto'] ?? null,
    ':historia' => $parametros['historia'] ?? null,
    ':microchip' => $parametros['microchip'] ?? null,
  ]);
}

//Si se ha llamado como un patch entro en esta parte de código
else if ($metodo === 'PATCH') {
  //Encaso que contenga el parámetro adoptar es que es una modificación para indicar que está adoptado
  if (isset($_GET['adoptar'])) {
    //Guardo en la variable id el id del parámetro pasándolo a entero
    $id = (int)$_GET['id'];
    //Obtengo los parámetros para marcar como adoptado
    $parametros = json_decode(file_get_contents('php://input'), true);
    //Creo el update poniendo la fecha de adopción con la fecha actual
    $consulta = $conexionBBDD->prepare("UPDATE animales SET fecha_adopcion = NOW() WHERE id = :id");
    //Sustituyo el id por el del parámetro y ejecuto el update
    $consulta->execute([':id' => $id]);
  }
}

//Si se ha llamado como un put entro en esta parte de código que es donde se crea el animal en la base de datos
else if ($metodo === 'PUT') {
  //Guardo en la variable id el id del parámetro pasándolo a entero
  $id = (int)$_GET['id'];
  //Obtengo los parámetros para añadir el animal
  $parametros = json_decode(file_get_contents('php://input'), true);
  //Preparo el update completo para modificar al animal
  $consulta = $conexionBBDD->prepare("UPDATE animales SET nombre = :nombre, descripcion = :descripcion, especie = :especie, edad = :edad, sexo = :sexo, tamano = :tamano, raza = :raza, vacunas = :vacunas, esterilizado = :esterilizado, foto = :foto, historia = :historia, microchip = :microchip WHERE id = :id");
  //Sustituyo cada campo de la base de datos por el parámetro concreto y ejecuto la consulta
  $consulta->execute([
    ':nombre' => $parametros['nombre'] ?? 'Sin nombre',
    ':descripcion' => $parametros['descripcion'] ?? null,
    ':especie' => $parametros['especie'] ?? null,
    ':edad' => isset($parametros['edad']) && $parametros['edad'] !== '' ? (int)$parametros['edad'] : null, //En este caso si no se informa edad o viene vacío lo indico nulo
    ':sexo' => $parametros['sexo'] ?? 'Desconocido',
    ':tamano' => $parametros['tamano'] ?? 'Mediano',
    ':raza' => $parametros['raza'] ?? null,
    ':vacunas' => !empty($parametros['vacunas']) ? 1 : 0,
    ':esterilizado' => !empty($parametros['esterilizado']) ? 1 : 0,
    ':foto' => $parametros['foto'] ?? null,
    ':historia' => $parametros['historia'] ?? null,
    ':microchip' => $parametros['microchip'] ?? null,
    ':id' => $id,
  ]);
}

//Si se ha llamado como un delete entro en esta parte de código que es donde se elimina al animal
else if ($metodo === 'DELETE') {
  //Guardo en la variable id el id del parámetro pasándolo a entero
  $id = (int)$_GET['id'];
  //Preparo la eliminación
  $consulta = $conexionBBDD->prepare("DELETE FROM animales WHERE id = :id");
  //Sustituyo el id por el del parámetro y ejecuto la eliminación
  $consulta->execute([':id' => $id]);
}