//Genero una variavle para usar la tabla de mensajes
const tablaMensajes = document.querySelector('#tabla-mensajes tbody');

// Obtengo el resultado de obtener todos los mensajes
const resultado = await fetch('http://localhost/santuario-huellas/api/mensajesBaseDatos.php');
//Convierto a Json el resultado dado del back y lo devuelvo
const mensajes = await resultado.json();
tablaMensajes.innerHTML = '';

//En caso que existan más de un mensaje los agrego a la tabla de mensajes
if (mensajes.length > 0) {
  for (const m of mensajes) {
    //Genero un nuevo elemento de fila en la talba de mesnajes
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.nombre_apellidos ?? ''}</td>
      <td>${m.animal_nombre ?? ''}</td>
      <td>${m.fecha_envio ?? ''}</td>
      <td>${m.contestado == 1 ? 'Sí' : 'No'}</td>
	  <td>
	  <button type="button" class="btn btn--ghost btn-ver">Ver</button>
	  </td>
    `;
    //Obtengo el botón que acabo de generar a la fila
	  const botonVer = tr.querySelector('.btn-ver');
    //Le agrego un evento al click para abrir con su id de mensaje a la ventana de mensaje
	  botonVer.addEventListener('click', function() 
    {
      window.location.href = "mensaje.html?id="+m.mensaje_id;
    });
	
    tablaMensajes.appendChild(tr);
  }
}

//Controlo si esta logeado como admin para devolverlo a la pantalla principal en caso que no lo esté
const isLogin = localStorage.getItem("usuarioLogeado");
const botonLogout = document.querySelector('#botonLogout');

if (isLogin != "true"){
	window.location.href = "index.html";
}

// En el botón cerrar sesión elimino el usuario logueado 
botonLogout.addEventListener('click', (e) => {
  localStorage.removeItem("usuarioLogeado");
  localStorage.removeItem("idAdmin");
	window.location.href = "index.html";
});