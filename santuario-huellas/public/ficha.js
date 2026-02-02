//Genero por cada uno de los elementos que hay en la ficha una variable
const imagenanimal = document.querySelector('#imagen-animal');
const tituloAnimal = document.querySelector('#titulo-animal');
const sobreAnimal = document.querySelector('#sobre-animal');
const descripcionanimnal = document.querySelector('#descripcion-animnal');
const historiaanimnal = document.querySelector('#historia-animnal');
const nombreanimnal = document.querySelector('#nombre-animnal');
const especieanimnal = document.querySelector('#especie-animnal');
const edadanimnal = document.querySelector('#edad-animnal');
const sexoanimnal = document.querySelector('#sexo-animnal');
const tamanoanimnal = document.querySelector('#tamano-animnal');
const razaanimnal = document.querySelector('#raza-animnal');
const vacunasanimnal = document.querySelector('#vacunas-animnal');
const esterilizadoanimnal = document.querySelector('#esterilizado-animnal');
const botoncontacto = document.querySelector('#boton-contacto');

// Obtengo el parámetro id por si viene desde la pantalla de animales
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Obtengo el resultado de obtener todos los animales desde la dirección localhost, dentro de la carpeta api
const resultado = await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?id='+id);
//Convierto a Json el resultado dado del back y lo devuelvo
const animalPorId = await resultado.json();

//Modifico los textos de los elementos para añadirle los datos del animal
tituloAnimal.textContent = animalPorId.nombre;
sobreAnimal.textContent = "Sobre " + animalPorId.nombre;
descripcionanimnal.textContent = animalPorId.descripcion;
historiaanimnal.textContent = animalPorId.historia;
imagenanimal.src = animalPorId.foto;	
nombreanimnal.textContent = animalPorId.nombre;
especieanimnal.textContent = animalPorId.especie;
edadanimnal.textContent = animalPorId.edad + " años";
sexoanimnal.textContent = animalPorId.sexo;
tamanoanimnal.textContent = animalPorId.tamano;
razaanimnal.textContent = animalPorId.raza;
vacunasanimnal.textContent = animalPorId.vacunas == 1 ? "Sí" : "No";
esterilizadoanimnal.textContent = animalPorId.esterilizado == 1 ? "Sí" : "No";
botoncontacto.href = "contacto.html?id=" + animalPorId.id;

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
