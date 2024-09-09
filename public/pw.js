

// function checkOption() {
//     const select = document.getElementById('areas');
//     if (select.value === 'mas') {
//         //select.value = ''
//         const fileName = prompt('Introduce el nombre del archivo:');
//         const area = prompt('Introduce el área:');
//         const total_losas = "10"

//         if (fileName && area && total_losas) {
//             const data = {
//                 fileName,
//                 area,
//                 filas: parseInt(total_losas, 10)
//             };

//             fetch('/create-file', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             })
//                 .then(response => response.text())
//                 .then(data => {
//                     alert(data);
//                     cargarAreas();
//                     obtenerDatosArchivo(fileName)

//                 })
//                 .catch(error => console.error('Error:', error));
//         }
//     } else {
//         obtenerDatosArchivo(select.value)
//     }


// }

function ejecutarObciones(obcion) {
    switch (obcion) {
        case "crear":
            crearArea()
            break;

        case "eliminar":
            console.log('eliminar')

            break;

        case "duplicar":
            console.log('duplicar')

            break;
        default:
            console.log('por defecto')

            break;
    }
}


function crearArea() {
    console.log('crear')
    const fileName = prompt('Introduce el nombre del archivo:');
    const area = prompt('Introduce el área:');
    const total_losas = "10"

    if (fileName && area && total_losas) {
        const data = {
            fileName,
            area,
            filas: parseInt(total_losas, 10)
        };

        fetch('/create-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(data => {
                //alert(data);
                console.log(data)
                cargarAreas();
                //obtenerDatosArchivo(fileName)

            })
            .catch(error => console.error('Error:', error));
    }
}


function updateLosa() {
    const fileName = prompt('Introduce el nombre del archivo:');
    const losa = prompt('Introduce la losa a actualizar (por ejemplo, l1, l2, etc.):');
    const estado = prompt('Introduce el nuevo estado (opcional):');
    const ip = prompt('Introduce la nueva IP (opcional):');
    const MAC = prompt('Introduce la nueva MAC (opcional):');
    const nombre_equipo = prompt('Introduce el nuevo nombre del equipo (opcional):');

    const data = {
        fileName,
        losa
    };

    if (estado) data.estado = estado;
    if (ip) data.ip = ip;
    if (MAC) data.MAC = MAC;
    if (nombre_equipo) data.nombre_equipo = nombre_equipo;

    fetch('/update-losa', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
}


function generarCubiculos(filas) {
    const contenedor = document.getElementById('contenedor_losas');
    contenedor.innerHTML = '';
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.className = 'fila';

        for (let j = 1; j <= 15; j++) {
            const cubiculo = document.createElement('div');
            cubiculo.id = `losa-${i * 15 + j}`;
            cubiculo.className = 'cubiculo';
            cubiculo.setAttribute('data-estado', '0');
            cubiculo.setAttribute('data-eq', '');
            cubiculo.setAttribute('data-mac', '');

            fila.appendChild(cubiculo);
        }

        contenedor.appendChild(fila);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarAreas();
    //console.log('se cargo de nuevo el DOM')
});

function cargarAreas() {
    fetch('/lista-areas-json')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('areas-dropdown');
            dropdown.innerHTML = ''; 
           
            console.log(data)
            data.forEach(item => {
                const dropdownItem = document.createElement('li');
                const dropdownLink = document.createElement('a');
                dropdownLink.className = 'dropdown-item';
                dropdownLink.textContent = item.area;
                dropdownLink.style.cursor = 'pointer'
                dropdownLink.setAttribute('onclick', `obtenerDatosArchivo('${item.fileName}')`);
                dropdownItem.appendChild(dropdownLink);
                dropdown.appendChild(dropdownItem);
            });
            //option_agregar(select);
        })
        .catch(error => console.error('Error:', error));
}


async function obtenerDatosArchivo(fileName) {
    try {
        const response = await fetch(`/datos-archivo-json?fileName=${fileName}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        console.log('Datos del archivo:', data);
        generarCubiculos(data.filas)
        document.getElementById('titulo').textContent = data.area

    } catch (error) {
        console.error('Error:', error);
    }
}

function toggleDropdown() {
    document.getElementById("dropdown-content").classList.toggle("show");
}

// Cerrar el menú desplegable si el usuario hace clic fuera de él
window.onclick = function (event) {
    if (!event.target.matches('.dropdown button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Llamar a la función para generar los cubículos
//generarCubiculos(20);

