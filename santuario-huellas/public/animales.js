
//Creo una variable que después haré uso para la funcionalidad de la pantalla
const contenedorTarjetas = document.querySelector('#contenedor-tarjetas');

  // Obtengo el resultado de obtener todos los animales desde la dirección localhost, dentro de la carpeta api
  const resultado = await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?listado=1');
  //Convierto a Json el resultado dado del back y lo devuelvo
  let animales = await resultado.json();

  contenedorTarjetas.innerHTML = '';
  
  //Recorro a través de una for en caso que se encuentren animales en la base de datos
  if (animales.length > 0) {
     for (const a of animales) {
		//Por cada animal que se encuentre creo un nuevo div donde iré añadiendo una nueva tarjeta con la información básica del animal
		const tarjeta = document.createElement('div');
		tarjeta.innerHTML = `
			<div class="pet-media">
				<img src="${a.foto ?? ''}">
				</div>
				<div class="pet-body">
				<h3 class="pet-name">${a.nombre ?? ''}</h3>
				<p class="pet-meta">${a.especie ?? ''} • ${a.edad ?? ''} años • ${a.tamano ?? ''}</p>
				<p class="pet-desc">${a.descripcion ?? ''}</p>
				<a href="ficha.html?id=${a.id}" class="pet-btn">Conoce a ${a.nombre ?? ''}</a>
			</div>
			`;
		contenedorTarjetas.appendChild(tarjeta);
	}
  }

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

