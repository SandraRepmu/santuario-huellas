//Genero una variable para modificar el texto de la comunicación en caso que se cargue un animal
const textoMensaje = document.querySelector('#mensaje');
//Genero otra varialbe para obtener el formulario de contacto
const form = document.getElementById("form-contacto");

// Obtengo el parámetro id por si viene desde la pantalla de animales
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

	if (id != null) {
    // Obtengo el resultado de obtener del animal desde la dirección localhost, dentro de la carpeta api
    const resultado = await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?id=' +id);
    //Convierto a Json el resultado dado del back y lo devuelvo
    const animalPorId = await resultado.json();
    //Modifico el texto de la comunicación con un texto por defecto con el nombre del animal 
		textoMensaje.textContent = "Estoy interesado en adoptar a " + animalPorId.nombre;
	}

//Al formulario de comunicación le agrego un evento de tipo submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //Creo un objeto de cliente con el nombre, email y telefono para pasárselo al back
  const cliente = {
    nombre_apellidos: form.nombre.value,
    email: form.email.value,
    telefono: form.telefono.value
  };
  //Creo un objeto de mensaje con el motivo, mensaje y el id del animal en caso de estar informado para pasárselo al back
  const mensaje = {
    motivo: form.motivo.value,
    mensaje: form.mensaje.value,
    id_animal: id != null ? id : null
  };

    // Realizo el envío del mensaje
    await fetch('http://localhost/santuario-huellas/api/mensajesBaseDatos.php', {
      method: 'POST', // Especifico que será un POST
      headers: {
        'Content-Type': 'application/json' // Lo que se le enviará es una variable json
      },
      body: JSON.stringify({cliente, mensaje}) //Le indico en el body las variables convertidas en json
    });
  
  //Una vez enviado el mensaje al back indico un mensaje indicando las gracias por haberse puesto en contacto con nosotros y redirecciono a la página principal
  alert("Gracias por ponerte en contacto con nosotros.");
  window.location.href = "index.html";
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
