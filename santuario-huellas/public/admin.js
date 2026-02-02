//Genero las variables que después haré uso para la funcionalidad de la pantalla
const tablaAnimales = document.querySelector('#tabla-animales tbody');
const formAnimal = document.getElementById("form-animal");
let idAnimalEdiccion = 0;
let fotoAnimal;

  // Obtengo el resultado de obtener todos los animales desde la dirección localhost, dentro de la carpeta api
  const resultado = await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php');
  //Convierto a Json el resultado dado del back y lo devuelvo
  const animales = await resultado.json();

  tablaAnimales.innerHTML = '';
  
  //Recorro a través de una for en caso que se encuentren animales en la base de datos
  if (animales.length > 0) {
    for (const a of animales) {
      //Por cada animal que se encuentre creo un nuevo registro en la tabla añadiendo los datos y tres botones de edicción, marcar como adoptado (en caso que ya no esté adoptado) y eliminar
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.nombre ?? ''}</td>
        <td>${a.especie ?? ''}</td>
        <td>${a.edad ?? ''}</td>
        <td>${a.sexo ?? ''}</td>
        <td>${a.tamano ?? ''}</td>
        <td>${a.raza ?? ''}</td>
        <td>${a.vacunas == 1 ? 'Sí' : 'No'}</td>
        <td>${a.esterilizado == 1 ? 'Sí' : 'No'}</td>
        <td>${a.fecha_adopcion != null ? 'Sí' : 'No'}</td>
      <td>
      <button type="button" class="btn btn--ghost btn-editar">Editar</button>
      ${a.fecha_adopcion == null ? '<button type="button" class="btn btn--ghost btn-adoptar">Adoptado</button>' : ''}
      <button type="button" class="btn btn--ghost btn-borrar">Borrar</button>
      </td>
      `;
    
      //Por cada boton le agrego un evento de escucha de tipo click para realizar la edición, adopción o borrado por cada uno de los animales asignados
      const btnEditar = tr.querySelector('.btn-editar');
      const btnAdoptar = tr.querySelector('.btn-adoptar');
      const btnBorrar = tr.querySelector('.btn-borrar');

      btnEditar.addEventListener('click', function() 
      {
        const tituloAnimal = document.getElementById("titulo-animal");
        tituloAnimal.textContent = a.nombre;
        const nombre = document.getElementById("nombre");
        nombre.value = a.nombre;
        const especie = document.getElementById("especie");
        especie.value = a.especie;
        const edad = document.getElementById("edad");
        edad.value = a.edad;
        const sexo = document.getElementById("sexo");
        sexo.value = a.sexo;
        const tamano = document.getElementById("tamano");
        tamano.value = a.tamano;
        const raza = document.getElementById("raza");
        raza.value = a.raza;
        const vacuna = document.getElementById("checkVacuna");
        vacuna.checked = a.vacunas == 1 ? true : false;
        const esterilizado = document.getElementById("checkEsterilizado");
        esterilizado.checked = a.esterilizado == 1 ? true : false;
        const descripcion = document.getElementById("descripcion");
        descripcion.value = a.descripcion;
        fotoAnimal = a.foto;
        idAnimalEdiccion = a.id;
      }
      );

      if (btnAdoptar != null) {
        //Para el caso de marcar como adoptado pregunto al administrador su desea marcarlo como adoptado
        btnAdoptar.addEventListener('click', async function ()      
        {
          const respuesta = confirm("¿Estás seguro de marcar como adoptado este animal?");

          if (respuesta) {
            // Realizo la adopción del animal en caso que acepte
            await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?id='+a.id+'&adoptar=1', {
              method: 'PATCH', //Especifico que será un PATCH
              headers: {
                'Content-Type': 'application/json' // Lo que se le enviará es una variable json
              }
            });
            await location.reload();          
          }
      });
    }

      btnBorrar.addEventListener('click', async function() {
        //Para el caso de borrar pregunto al administrador su desea borrarlo
        const respuesta = confirm("¿Estás seguro de borrar a este animal?");

        if (respuesta) {
            // Realizo la eliminación del animal en caso que le de a sí
            await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?id='+ a.id,{
              method: 'DELETE', // Especifico que será un DELETE
              headers: {
                'Content-Type': 'application/json' // Lo que se le enviará es una variable json
              }
            });
            await location.reload();
        }
      });
      
      //Al final agrego todos los elementos de la fila nueva a la tabla de animales
      tablaAnimales.appendChild(tr);
  }
}
  
//Agrego al formulario un evento de tipo submit para tratarlo como tal
formAnimal.addEventListener("submit", async function (e) {
  e.preventDefault();

  //Si no se ha subido una foto del animal devuelvo un mensaje indicando que es necesario
  if (formAnimal.foto.files[0] == null && fotoAnimal == null){
    alert("Es obligatorio subir una fotografía del animal");
    return;
  }

  //Genero una variable para guardar la foto que tenía asignada anteriormente el animal o convertirla desde la seleccionada a base64 para poder guardarlo por base de datos
  let fotoBase64;
  //Compruebo si ha agregado una nueva foto
  if (formAnimal.foto.files[0]){
    //Realizo la funcionalidad de conversión indicada en (https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsDataURL)
    const reader = new FileReader();

    reader.onload = async function () {
      //Paso al formato que entiende la base de datos para guardar imágenes 
      const fotoBase64 = reader.result;

      //Realizo el guardado del animal pasando la fotografía nueva
      await guardarAnimal(fotoBase64);
    };
    //Realizo la llamada a la función propia del reader para obtener los datos de la imagen seleccionada
    reader.readAsDataURL(formAnimal.foto.files[0]);
  }
  else{
    //Sino realizo la llamada a la funcion de guardar animal pasando la foto antigua
    await guardarAnimal(fotoAnimal);
  }
});

//Función encargada de guardar el animal pasando la imagen
async function guardarAnimal(fotoBase64) {
  //Genero el animal con los datos informados
  const animal = {
      nombre: formAnimal.nombre.value.trim(),
      descripcion: formAnimal.descripcion.value.trim(),
      especie: formAnimal.especie.value.trim(),
      edad: formAnimal.edad.value ? Number(formAnimal.edad.value) : null,
      sexo: formAnimal.sexo.value.trim(),
      tamano: formAnimal.tamano.value.trim(),
      raza: formAnimal.raza.value.trim(),
      vacunas: formAnimal.vacunas.checked ? 1 : 0,
      esterilizado: formAnimal.esterilizado.checked ? 1 : 0,
      foto: fotoBase64
    };

    //Si el animal que voy a guardar es nuevo realizo la creación directamente
      if (idAnimalEdiccion == 0) {
        // Realizo la creación del animal
        await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php', {
          method: 'POST', // Especifico que será un POST
          headers: {
            'Content-Type': 'application/json' // Lo que se le enviará es una variable json
          },
          body: JSON.stringify(animal) //Le indico en el body la variable convirtiendo en json
        });

        alert("Animal añadido correctamente.");
      }
	  else{
        // Realizo la modificación del animal en caso contrario pasando el id 
        await fetch('http://localhost/santuario-huellas/api/animalesBaseDatos.php?id='+idAnimalEdiccion, {
          method: 'PUT', // Especifico que será un PUT
          headers: {
            'Content-Type': 'application/json' // Lo que se le enviará es una variable json
          },
          body: JSON.stringify(animal) //Le indico en el body la variable convirtiendo en json
        });
		
		    idAnimalEdiccion = 0;
        alert(animal.nombre + " modificado correctamente.");
	  }

    await location.reload();
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