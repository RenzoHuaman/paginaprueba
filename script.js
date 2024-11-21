// Variables globales
let map, directionsService, directionsRenderer, trafficLayer, heatmap;
let currentRouteIndex = 0; // Índice para rutas alternativas
let currentMode = 'conductores'; // Modo actual (conductores o deportistas)

// Inicializar el mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
        zoom: 13,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    trafficLayer = new google.maps.TrafficLayer();

    directionsRenderer.setMap(map);

    // Configurar autocompletado para los inputs
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    new google.maps.places.Autocomplete(fromInput);
    new google.maps.places.Autocomplete(toInput);
}

// Mostrar el formulario de conductores
function showConductores() {
    currentMode = 'conductores';
    document.getElementById('location-form').style.display = 'flex';
    document.getElementById('air-quality-info').style.display = 'none';

    document.getElementById('btn-conductores').style.display = 'none';
    document.getElementById('btn-deportistas').style.display = 'none';
    document.getElementById('btn-inicio').style.display = 'block'; // Mostrar el botón "Inicio"

    if (heatmap) heatmap.setMap(null); // Limpiar el mapa de calor
    directionsRenderer.setMap(map);
    trafficLayer.setMap(map);
}

// Mostrar el mapa de calor para deportistas
function showDeportistas() {
    currentMode = 'deportistas';
    document.getElementById('location-form').style.display = 'none';
    document.getElementById('air-quality-info').style.display = 'block';

    document.getElementById('btn-conductores').style.display = 'none';
    document.getElementById('btn-deportistas').style.display = 'none';
    document.getElementById('btn-inicio').style.display = 'block'; // Mostrar el botón "Inicio"

    directionsRenderer.setMap(null);
    trafficLayer.setMap(null);

    // Crear un mapa de calor
    const heatMapData = [
        { location: new google.maps.LatLng(-33.4489, -70.6693), weight: 1 },
        { location: new google.maps.LatLng(-33.456, -70.65), weight: 0.8 },
        { location: new google.maps.LatLng(-33.44, -70.68), weight: 0.6 },
    ];

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map,
        radius: 50,
    });
}

// Regresar a la vista inicial
function backToStart() {
    document.getElementById('btn-conductores').style.display = 'block';
    document.getElementById('btn-deportistas').style.display = 'block';
    document.getElementById('btn-inicio').style.display = 'none'; // Ocultar el botón "Inicio"

    document.getElementById('location-form').style.display = 'none';
    document.getElementById('air-quality-info').style.display = 'none';

    if (heatmap) heatmap.setMap(null);
    directionsRenderer.setMap(null);
    trafficLayer.setMap(null);
}

// Buscar y mostrar rutas para conductores
function calculateAndDisplayRoute(event) {
    event.preventDefault(); // Evitar el envío del formulario
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    if (from && to) {
        directionsService.route(
            {
                origin: from,
                destination: to,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true, // Habilitar rutas alternativas
            },
            (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    currentRouteIndex = 0; // Iniciar con la primera ruta
                    document.getElementById('change-route').style.display = 'block'; // Mostrar botón de cambio
                } else {
                    alert('No se pudo calcular la ruta: ' + status);
                }
            }
        );
    } else {
        alert('Por favor, ingresa ambas ubicaciones.');
    }
}

// Cambiar entre rutas alternativas
function changeRoute() {
    const directions = directionsRenderer.getDirections();
    if (directions) {
        currentRouteIndex = (currentRouteIndex + 1) % directions.routes.length;
        directionsRenderer.setRouteIndex(currentRouteIndex);
    }
}

// Limpiar ruta
function clearRoute() {
    directionsRenderer.setDirections({ routes: [] });
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('change-route').style.display = 'none';
}

// Inicialización y eventos
window.onload = function () {
    initMap();
};

document.getElementById('btn-conductores').addEventListener('click', showConductores);
document.getElementById('btn-deportistas').addEventListener('click', showDeportistas);
document.getElementById('btn-inicio').addEventListener('click', backToStart);
document.getElementById('location-form').addEventListener('submit', calculateAndDisplayRoute);
document.getElementById('change-route').addEventListener('click', changeRoute);
document.getElementById('clear-route').addEventListener('click', clearRoute);
