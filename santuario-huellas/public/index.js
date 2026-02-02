//Obtengo las tarjetas de la página principal para mostrar los animales
const primeratarjeta = document.querySelector('#primera-tarjeta');
const segundatarjeta = document.querySelector('#segunda-tarjeta');
const terceratarjeta = document.querySelector('#tercera-tarjeta');

  // Obtengo el resultado de obtener todos los animales desde la dirección localhost, dentro de la carpeta api
  const resultado = await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?ultimos=1');
  //Convierto a Json el resultado dado del back
  const animales = await resultado.json();
  
  //En caso que obtenga un animal cargo solamente la primera tarjeta con los datos del animal
  if(animales.length === 1) {
	  primeratarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[0].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[0].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[0].especie ?? ''} • ${animales[0].edad ?? ''} años • ${animales[0].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[0].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[0].id}" class="pet-btn">Conoce a ${animales[0].nombre ?? ''}</a>
		 </div>
		`;
  }
  
  //En caso que obtenga dos animales cargo la primera y segunda tarjeta con los datos de los animales
  if(animales.length === 2) {
	  primeratarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[0].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[0].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[0].especie ?? ''} • ${animales[0].edad ?? ''} años • ${animales[0].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[0].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[0].id}" class="pet-btn">Conoce a ${animales[0].nombre ?? ''}</a>
		 </div>
		`;
	  segundatarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[1].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[1].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[1].especie ?? ''} • ${animales[1].edad ?? ''} años • ${animales[1].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[1].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[1].id}" class="pet-btn">Conoce a ${animales[1].nombre ?? ''}</a>
		 </div>
		`;
  }
  
  // En el caso que obtenga los tres animales cargo la primera, segunda y tercera tarjeta con los datos de los animales
  if(animales.length === 3) {
	  primeratarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[0].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[0].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[0].especie ?? ''} • ${animales[0].edad ?? ''} años • ${animales[0].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[0].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[0].id}" class="pet-btn">Conoce a ${animales[0].nombre ?? ''}</a>
		 </div>
		`;
	  segundatarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[1].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[1].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[1].especie ?? ''} • ${animales[1].edad ?? ''} años • ${animales[1].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[1].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[1].id}" class="pet-btn">Conoce a ${animales[1].nombre ?? ''}</a>
		 </div>
		`;
	  terceratarjeta.innerHTML = `
		  <div class="pet-media">
			  <img src="${animales[2].foto ?? ''}">
			</div>
			<div class="pet-body">
			  <h3 class="pet-name">${animales[2].nombre ?? ''}</h3>
			  <p class="pet-meta">${animales[2].especie ?? ''} • ${animales[2].edad ?? ''} años • ${animales[2].tamano ?? ''}</p>
			  <p class="pet-desc">${animales[2].descripcion ?? ''}</p>
			  <a href="ficha.html?id=${animales[2].id}" class="pet-btn">Conoce a ${animales[2].nombre ?? ''}</a>
		 </div>
		`;
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
