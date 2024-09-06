

function checkOption() {
    const select = document.getElementById('areas');
    if (select.value === 'mas') {
select.value = ''
        const fileName = prompt('Introduce el nombre del archivo:');
        const area = prompt('Introduce el área:');
        const total_losas = prompt('Introduce el total de losas (espacio)');

        if (fileName && area && total_losas) {
            const data = {
                fileName,
                area,
                total_losas: parseInt(total_losas, 10)
            };

            fetch('/create-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.text())
                .then(data => alert(data))
                .catch(error => console.error('Error:', error));
        }
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
    fetch('/lista-areas-json')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('areas');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.fileName;
                option.textContent = item.area;
                select.appendChild(option);
            });
            //se agrega <option value="mas">agregar area +</option>
            const option = document.createElement('option');
            option.value = "mas";
            option.textContent = "Agregar area+";
            select.appendChild(option);
        })
        .catch(error => console.error('Error:', error));
});

// Llamar a la función para generar los cubículos
generarCubiculos(20);

