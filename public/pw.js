
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
        case "modoPC":
            console.log('modoPC')

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
    const contenedor = document.getElementById('contenedor_losas');
    const url_img = 'http://localhost:3002/img/';
    contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar los nuevos cubículos

    // Función auxiliar para crear una imagen y establecer su fuente o clase
    function crearImagen(id, imgSrc, defaultSrc) {
        const img = document.createElement('img');
        img.id = id;

        // Si la imagen no es "null", asignar el src; de lo contrario, asignar una clase
        if (imgSrc !== "null") {
            img.src = url_img + imgSrc || defaultSrc;
        } else {
            img.className = 'img_null';
        }
        return img;
    }

    // Función para asignar atributos al cubículo
    function asignarAtributosCubiculo(cubiculo, datos_losa) {
        cubiculo.setAttribute('data-estado', datos_losa.estado || 0);
        //console.log(datos_losa.estado)
        cubiculo.setAttribute('data-ip', datos_losa.ip || '0.0.0.0');
        cubiculo.setAttribute('data-mac', datos_losa.MAC || '00-00-00-00-00');
        cubiculo.setAttribute('data-eq', datos_losa.nombre_equipo || 'sin_nombre');
        cubiculo.setAttribute('data-img-tipo', datos_losa.tipo || 'por_defecto');
        cubiculo.setAttribute('data-img1', datos_losa.img1 || 'losa_central.png');
        cubiculo.setAttribute('data-img2', datos_losa.img2 || 'sin_imagen');
        cubiculo.setAttribute('data-img3', datos_losa.img3 || 'sin_imagen');
    }

    // Crear las filas de cubículos
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.className = 'fila'; // Clase para los estilos de la fila

        // Crear cubículos en cada fila
        for (let j = 1; j <= 15; j++) {
            const id = `losa-${i * 15 + j}`; // Generar un ID único para cada cubículo
            const cubiculo = document.createElement('div');
            cubiculo.id = id;
            cubiculo.className = 'cubiculo'; // Clase para los estilos de cubículo


            // Crear contenedor para las imágenes
            const contenedorImagenes = document.createElement('div');
            contenedorImagenes.className = 'contenedor-imagenes';

            // Buscar datos del cubículo en `dato.losas`
            const losa = dato.losas.find(l => l[id]?.[0]);
            if (losa) {
                const datos_losa = losa[id][0];

                // Asignar atributos del cubículo
                asignarAtributosCubiculo(cubiculo, datos_losa);

                // Crear y agregar las imágenes
                const img1 = crearImagen(id + '_img1', datos_losa.img1, 'losa_central.png');
                const img2 = crearImagen(id + '_img2', datos_losa.img2, 'sin_imagen.png');
                const img3 = crearImagen(id + '_img3', datos_losa.img3, 'sin_imagen.png');

                contenedorImagenes.appendChild(img1);
                contenedorImagenes.appendChild(img2);
                contenedorImagenes.appendChild(img3);
            }

            // Agregar el contenedor de imágenes al cubículo
            cubiculo.appendChild(contenedorImagenes);

            // Agregar evento onclick al cubículo
            cubiculo.onclick = function () {
                funcionPrueba(id);
            };


            fila.appendChild(cubiculo); // Agregar el cubículo a la fila
        }
        contenedor.appendChild(fila); // Agregar la fila completa al contenedor
    }
}



function funcionPrueba(id) {
    console.log(id)
}

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor_losas');
    const contextMenu = document.getElementById('context-menu');
    const checkbox = document.getElementById('check_box');
    const direccionIP = document.getElementById('direccionIP');
    const nombreEquipo = document.getElementById('nombreEquipo');
    const mac = document.getElementById('mac');
    const btnGuardarModoPc = document.getElementById('btnGuardarModoPc');
    const contextMenuHeader = document.getElementById('context-menu-header');
    const closeButton = contextMenu.querySelector('.btn-close');
    const titulo = document.getElementById('title_menu');
    const modoPC_div = document.getElementById('modoPC_div');
    const modo_diseño_div = document.getElementById('modo_diseño_div');


    // Declare variables to store data attributes
    let cubiculoId, data_estado, data_ip, data_mac, data_eq, data_img_tipo, data_img1, data_img2, data_img3;

    const showContextMenu = (event) => {
        event.preventDefault();
        removeCubicleShadows();
        const cubiculo = event.target.closest('.cubiculo');
        if (cubiculo) {
            const rect = cubiculo.getBoundingClientRect();
            contextMenu.style.top = `${rect.top + 30}px`;
            contextMenu.style.left = `${rect.right - 40}px`;
            contextMenu.style.display = 'block';
            cubiculoId = cubiculo.id;
            data_estado = cubiculo.getAttribute('data-estado');
            data_ip = cubiculo.getAttribute('data-ip');
            data_mac = cubiculo.getAttribute('data-mac');
            data_eq = cubiculo.getAttribute('data-eq');
            data_img_tipo = cubiculo.getAttribute('data-img-tipo');
            data_img1 = cubiculo.getAttribute('data-img1');
            data_img2 = cubiculo.getAttribute('data-img2');
            data_img3 = cubiculo.getAttribute('data-img3');
            titulo.textContent = cubiculoId;
            cubiculo.classList.add('cubiculo_selec');
            checkbox.checked = data_estado === '1';
            modos()
            nombreEquipo.value = data_eq;
            mac.value = data_mac;
            direccionIP.value = data_ip;

            console.log(cubiculoId, ' - ', data_eq, data_estado, data_img1, data_img2, data_img3, data_img_tipo);
        }
    };




    const hideContextMenu = () => {
        contextMenu.style.display = 'none';
        removeCubicleShadows();
    };

    const removeCubicleShadows = () => {
        document.querySelectorAll('.cubiculo').forEach(cubiculo => {
            cubiculo.classList.remove('cubiculo_selec');
        });
    };


    // Update data-estado when checkbox is clicked
    checkbox.addEventListener('click', () => {
        const cubiculo = document.querySelector('.cubiculo_selec');
        if (cubiculo) {
            modos()
        }
    });


    function modos() {
        const newEstado = checkbox.checked ? '1' : '0';
        if (newEstado === '1') {
            console.log('VISIBLE')
            modoPC_div.style.display = 'block'
            modo_diseño_div.style.display = 'none'
        } else {
            console.log('INVICIBLE')
            modoPC_div.style.display = 'none'
            modo_diseño_div.style.display = 'block'

        }
    }


    btnGuardarModoPc.addEventListener('click', () => {
        cubiculoId = document.getElementById(cubiculoId);
        
       
        const newEstado = checkbox.checked ? '1' : '0';
        cubiculoId.setAttribute('data-estado', newEstado);

        const newIP = direccionIP.value;
        cubiculoId.setAttribute('data-ip', newIP);

        const newNombreEquipo = nombreEquipo.value;
        cubiculoId.setAttribute('data-eq', newNombreEquipo);

        const newMAC = mac.value;
        cubiculoId.setAttribute('data-mac', newMAC);


        console.log(newEstado);

    });

    const dragElement = (element, header) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    };

    contenedor.addEventListener('contextmenu', showContextMenu);
    closeButton.addEventListener('click', hideContextMenu);
    dragElement(contextMenu, contextMenuHeader);
});



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


