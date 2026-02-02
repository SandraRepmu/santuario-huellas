//Cargo en una variable el formulario del login
const form = document.getElementById("form-login");

// Le agrego un evento de escucha de tipo submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  //Guardo los datos introducidos
  const usuario = form.usuario.value;
  const contrasena = form.contrasena.value;

  // Realizo la consulta del login
  const resultado = await fetch('http://localhost/santuario-huellas/api/administradorBaseDatos.php', {
    method: 'POST', // Especifico que será un POST
    headers: {
    'Content-Type': 'application/json' // Lo que se le enviará es una variable json
    },
    body: JSON.stringify({usuario, contrasena}) //Le indico en el body las variables convertidas en json
    });

  //El resultado lo guardo en una variable administrador
  const administrador = await resultado.json();
  //Si ha encontrado datos guardo en una variable local que el administrador se ha logeado
  if(administrador) {
	  localStorage.setItem("usuarioLogeado", "true");
	  //Del resultado obtengo el id del administrador
	  localStorage.setItem("idAdmin", administrador.id);
    window.location.href = "admin.html";
  }
  else{
	  alert("Los datos introducidos son incorrectos.");
  }
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
