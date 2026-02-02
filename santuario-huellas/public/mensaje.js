//Genero por cada uno de los elementos que hay en el mensaje una variable
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const nombreAnimal = document.getElementById("nombreAnimal");
const fecha = document.getElementById("fecha");
const mensaje = document.getElementById("mensaje");
const contestado = document.getElementById("contestado");
const botonContestado = document.getElementById("botonContestado");

// Obtengo el parámetro id
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Obtengo el resultado de obtener todos los animales desde la dirección localhost, dentro de la carpeta api
const resultado = await fetch('http://localhost/santuario-huellas/api/mensajesBaseDatos.php?id='+id);
//Convierto a Json el resultado dado del back y lo devuelvo
const mensajePorId = await resultado.json();

//Modifico en las variables los datos obtenidos del mensaje
nombre.textContent = mensajePorId.nombre_apellidos;
email.textContent = mensajePorId.email;
telefono.textContent = mensajePorId.telefono;
nombreAnimal.textContent = mensajePorId.animal_nombre;
motivo.textContent = mensajePorId.motivo;
fecha.textContent = mensajePorId.fecha_envio;
mensaje.textContent = mensajePorId.mensaje;
contestado.textContent = mensajePorId.contestado == 0 ? "No" : "Sí";

//Guardo las variables con el id del cliente, id del mensaje y el id del administrador
const id_cliente = mensajePorId.cliente_id;
const id_mensaje = mensajePorId.mensaje_id;
const id_admin = localStorage.getItem("idAdmin");

//Agrego un evento de escucha de tipo click al botón de contestado
botonContestado.addEventListener('click', async (e) => {
	// Realizo la contestacion del mensaje
	await fetch('http://localhost/santuario-huellas/api/mensajesBaseDatos.php', {
		method: 'PATCH', // Especifico que será un PATCH
		headers: {
			'Content-Type': 'application/json' // Lo que se le enviará es una variable json
		},
          body: JSON.stringify({id_cliente, id_mensaje, id_admin}) //Le indico en el body las variables convertidas en json con la nomenclatura de back
        });
	alert("Se ha marcado el mensaje como contestado.");
	window.location.href = "mensajes.html";
});


//Realizo el control de si se ha logeado el administrador (común entre las pantallas que no son de administrador)
//Obtengo en constantes los botones de login o cerrar sesión, pestaña de administrador y de los datos local si está logeado el administrador
const isLogin = localStorage.getItem("usuarioLogeado");
const botonLogin = document.querySelector('#botonLogin');
const botonLogout = document.querySelector('#botonLogout');
const optionAdmin = document.querySelector('#optionAdmin');

//Si el usuario se ha logeado oculto el boton login pero muestro tanto el botón de cerrar sesión y la pestaña de administrador
if (isLogin == "true"){
	botonLogin.style.display = 'none';
	botonLogin.style.visibility = 'hidden';
	botonLogout.style.visibility = 'visible';
	botonLogout.style.display = 'block';
	optionAdmin.style.visibility = 'visible';
}
// Sino muestro el boton login pero oculto tanto el botón de cerrar sesión y la pestaña de administrador
else
{
	botonLogin.style.visibility = 'visible';
	botonLogin.style.display = 'block';
	botonLogout.style.display = 'none';
	botonLogout.style.visibility = 'hidden';
	optionAdmin.style.visibility = 'hidden';
}

//Al botón de cerrar sesión le agrtego el evento de escucha de tipo click para eliminar que el usuario está logeado y recargo esta misma pantalla
botonLogout.addEventListener('click', (e) => {
  localStorage.removeItem("usuarioLogeado");
  localStorage.removeItem("idAdmin");
  location.reload();
});
