
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

    if (fileName && area) {
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
                alert(data);
                console.log(data)
                cargarListaAreas();


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


function generarCubiculos(filas, dato) {
    // Obtener el contenedor donde se agregarán los cubículos
    const contenedor = document.getElementById('contenedor_losas');
    contenedor.innerHTML = ''; // Limpiar el contenedor

    // Crear las filas de cubículos
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.className = 'fila'; // Asignar clase para estilos

        // Crear los cubículos dentro de cada fila
        for (let j = 1; j <= 15; j++) {
            const cubiculo = document.createElement('div');
            const id = `losa-${i * 15 + j}`; // Generar ID único para cada cubículo
            cubiculo.id = id;
            cubiculo.className = 'cubiculo'; // Asignar clase para estilos

            // Actualizar cubículo si hay datos disponibles
            dato.losas.forEach(losa => {
                const datos_losa = losa[id]?.[0]; // Obtener datos del cubículo si existen
                if (datos_losa) {
                    // Establecer atributos del cubículo con los datos o valores por defecto
                    cubiculo.setAttribute('data-estado', datos_losa.estado || '0');
                    cubiculo.setAttribute('data-eq', datos_losa.nombre_equipo || 'NULL');
                    cubiculo.setAttribute('data-ip', datos_losa.ip || '0.0.0.0');
                    cubiculo.setAttribute('data-mac', datos_losa.MAC || '00-00-00-00-00');
                    cubiculo.setAttribute('data-img', datos_losa.img || 'losa.png');
                    //cubiculo.onclick = funcionPrueba(id);
                }
            });
            // Agregar evento onclick al cubículo
            cubiculo.onclick = function () {
                funcionPrueba(id);
            };

            fila.appendChild(cubiculo); // Agregar cubículo a la fila
        }
        contenedor.appendChild(fila); // Agregar fila al contenedor
    }
}

function funcionPrueba(id) {
    console.log(id)
}

document.addEventListener('DOMContentLoaded', () => {
    cargarListaAreas();
    //console.log('se cargo de nuevo el DOM')
});

function cargarListaAreas() {
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
        generarCubiculos(data.filas, data)
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


