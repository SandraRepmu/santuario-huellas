<?php

//Creo la variable para añadir las opciones de la conexión
$opcionesPDO = array();
//Esta opción sirve para que cuando devuelva datos la base de datos obtenga los nombres de las columnas en vez de números de posición
$opcionesPDO[PDO::ATTR_DEFAULT_FETCH_MODE] = PDO::FETCH_ASSOC;
//Creo la variable PDO con la conexión de la base de datos local
$conexionBBDD = new PDO("mysql:host=127.0.0.1;dbname=santuario_huellas;charset=utf8", "root", "", $opcionesPDO);
//Obtengo de llamar al endpoint (PUT, POST, GET, DELETE)
$metodo = $_SERVER['REQUEST_METHOD'];

//Si se ha llamado como un post entro en esta parte de código
if ($metodo === 'POST') {
  //Obtengo los parámetros
  $parametros = json_decode(file_get_contents('php://input'), true);
  //Guardo en variables el cliente y mensaje
  $cliente = $parametros['cliente'];
  $mensaje = $parametros['mensaje'];

  //Separo para tener claro cada uno de los campos de los parámetros (quito los espacios por delante y por detrás con el trim)
  $nombre = trim($cliente['nombre_apellidos']);
  $email  = trim($cliente['email']);
  $tel    = trim($cliente['telefono']);
  $motivo = trim($mensaje['motivo']);
  $texto  = trim($mensaje['mensaje']);
  //Compruebo si se ha informado el mensaje por animal o no
  $id_animal = isset($mensaje['id_animal']) && $mensaje['id_animal'] !== '' ? (int)$mensaje['id_animal'] : null;

  //Realizo una búsqueda en la tabla de clientes por email por si existe ya un cliente
    $consulta = $conexionBBDD->prepare("SELECT id FROM clientes WHERE email = :e");
    $consulta->execute([':e' => $email]);
    //Guardo el id del cliente en caso de existir en la variable
    $cliente = $consulta->fetch();

    //Si existe el cliente guardo el id como entero
    if ($cliente) {
      $id_cliente = (int)$cliente['id'];
    //Si no existe realizo la insercción del nuevo cliente
    } else {
      $consulta = $conexionBBDD->prepare("INSERT INTO clientes (nombre_apellidos, email, telefono) VALUES (:n, :e, :t)");
      //Ejecuto el insert sustituyendo los campos por los del parámetro
      $consulta->execute([':n' => $nombre, ':e' => $email, ':t' => ($tel ?: null)]);
      //Con lastInsertId obtengo el Id del cliente insertado para después insertarlo en la tabla de cliente_mensaje
      $id_cliente = (int)$conexionBBDD->lastInsertId();
    }

    //Si el id del animal se informó lo inserto con el id del animal
    if ($id_animal !== null) {
      //Preparo la insrcción en la tabla de mensajes
      $consulta = $conexionBBDD->prepare("INSERT INTO mensajes (motivo, mensaje, id_animal) VALUES (:mo, :me, :a)");
      //Ejecuto el insert sustituyendo los campos por los que vienron como parámetro
      $consulta->execute([':mo' => $motivo, ':me' => $texto, ':a' => $id_animal]);
      //Guardo el id del mensaje que se acaba de insertar
      $id_mensaje = (int)$conexionBBDD->lastInsertId();
    // En el caso que no se informe el id del animal inserto en la tabla de mensajes sin el id del animal
    } else {
      $consulta = $conexionBBDD->prepare("INSERT INTO mensajes (motivo, mensaje) VALUES (:mo, :me)");
      //Ejecuto el insert sustituyendo los campos por los que vienron como parámetro
      $consulta->execute([':mo' => $motivo, ':me' => $texto]);
      //Guardo el id del mensaje que se acaba de insertar
      $id_mensaje = (int)$conexionBBDD->lastInsertId();
    }    

    //Preparo el insert de la tabla que relaciona el cliente y el mensaje que acabo de insertar
    $consulta = $conexionBBDD->prepare("INSERT INTO cliente_mensaje (id_cliente, id_mensaje, contestado, id_admin) VALUES (:c, :m, 0, NULL)");
    //Sustituyo los id de cliente y mensaje para insertar
    $consulta->execute([':c' => $id_cliente, ':m' => $id_mensaje]);
}

//Si se ha llamado como un get entro en esta parte de código
else if ($metodo === 'GET') {
  //Encaso que contenga el parámetro id es que es una consulta por id
  if (isset($_GET['id'])) {
    //Paso a entero el id del parámetro
    $id = (int)$_GET['id'];
    //Preparo la consulta vinculando las tablas de cliente, animal, admin y cliente_mensaje
    $consulta = $conexionBBDD->prepare("SELECT cm.id AS id_cliente_mensaje, cm.contestado, cm.id_admin, m.id AS mensaje_id, m.motivo, m.mensaje, m.fecha_envio, m.id_animal AS animal_id, a.nombre AS animal_nombre, c.id AS cliente_id, c.nombre_apellidos, c.email, c.telefono FROM cliente_mensaje cm JOIN mensajes m  ON m.id = cm.id_mensaje JOIN clientes c  ON c.id = cm.id_cliente LEFT JOIN animales a ON a.id = m.id_animal WHERE m.id = :id ORDER BY m.fecha_envio DESC, cm.id DESC");
    // Sustituyo la el campo de Id y ejecuto la consulta
    $consulta->execute([':id' => $id]);
    $cliente = $consulta->fetch();
    //Envío en formato json al javascript
    echo json_encode($cliente);
  }
  else{
  //Preparo la consulta vinculando las tablas de cliente, animal, admin y cliente_mensaje
    $sql = "SELECT cm.id AS id_cliente_mensaje, cm.contestado, cm.id_admin, m.id AS mensaje_id, m.motivo, m.mensaje, m.fecha_envio, m.id_animal AS animal_id, a.nombre AS animal_nombre, c.id AS cliente_id, c.nombre_apellidos, c.email, c.telefono FROM cliente_mensaje cm JOIN mensajes m  ON m.id = cm.id_mensaje JOIN clientes c  ON c.id = cm.id_cliente LEFT JOIN animales a ON a.id = m.id_animal ORDER BY m.fecha_envio DESC";
    // Lanzo la consulta para obtener todos los mensajes ordenados por fecha
    $consulta = $conexionBBDD->query($sql);
    //Envío en formato json al javascript
    echo json_encode($consulta->fetchAll());
  }
}

//Si se ha llamado como un Patch entro en esta parte de código para marcar como contestado un mensaje guardando el Id del admin
else if ($metodo === 'PATCH') {
  //Obtengo los parámetros
  $parametros = json_decode(file_get_contents('php://input'), true);
  //Guardo en variables los parámetrdos que usaré como enteros
  $id_cliente = (int)$parametros['id_cliente'];
  $id_mensaje = (int)$parametros['id_mensaje'];
  $id_admin = (int)$parametros['id_admin'];
  
  //Preparo el update buscando por las primary key de mensaje y cliente marcando como contestado y el id del administrador
  $consulta = $conexionBBDD->prepare("UPDATE cliente_mensaje SET contestado = 1, id_admin = :a WHERE id_cliente = :c AND id_mensaje = :m");
  //Realizo la ejecución del update
  $consulta->execute([':a' => $id_admin, ':c' => $id_cliente, ':m' => $id_mensaje]);
}
