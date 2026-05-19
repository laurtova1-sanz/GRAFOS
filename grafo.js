
// CLASE ARISTA - conexion entre dos nodos
class Arista {
    constructor(idDestino, peso) {
        this.idDestino     = idDestino;
        this.peso          = peso;
        this.siguienteArco = null;
    }
}


// CLASE NODO - lugar del mapa
class Nodo {
    constructor(id, nombre) {
        this.id         = id;
        this.nombre     = nombre;
        this.primerArco = null;
    }
}


// CLASE GRAFO
class Grafo {
    constructor() {
        this.vertices = [];
    }

    agregarNodo(id, nombre) {
        this.vertices[id] = new Nodo(id, nombre);
    }

    agregarArco(idOrigen, idDestino, peso) {
        let nodoOrigen = this.vertices[idOrigen];
        if (!nodoOrigen) return;
        let nuevoArco           = new Arista(idDestino, peso);
        nuevoArco.siguienteArco = nodoOrigen.primerArco;
        nodoOrigen.primerArco   = nuevoArco;
    }

    mostrarGrafo() {
        let texto = "=== GRAFO - FACATATIVÁ ===\n";
        for (let id in this.vertices) {
            let nodo = this.vertices[id];
            texto += "\n" + nodo.id + " - " + nodo.nombre + "\n";
            let arco = nodo.primerArco;
            while (arco !== null) {
                let destino = this.vertices[arco.idDestino];
                let label   = arco.peso >= 1000
                    ? (arco.peso / 1000).toFixed(1) + " km"
                    : arco.peso + " m";
                texto += "  → " + destino.nombre + " | " + label + "\n";
                arco = arco.siguienteArco;
            }
        }
        return texto;
    }

    // DIJKSTRA - Camino mas corto
    Dijkstra(idInicio, idFin) {
        let distancias = [];
        let anteriores = [];
        let visitados  = [];
        let ids        = Object.keys(this.vertices);

        for (let i = 0; i < ids.length; i++) {
            distancias[ids[i]] = Infinity;
            anteriores[ids[i]] = null;
        }
        distancias[idInicio] = 0;

        for (let i = 0; i < ids.length; i++) {
            let idActual = null;
            for (let j = 0; j < ids.length; j++) {
                if (!visitados[ids[j]]) {
                    if (idActual === null || distancias[ids[j]] < distancias[idActual]) {
                        idActual = ids[j];
                    }
                }
            }
            if (idActual === null) break;
            visitados[idActual] = true;

            let arco = this.vertices[idActual].primerArco;
            while (arco !== null) {
                let nueva = distancias[idActual] + arco.peso;
                if (nueva < distancias[arco.idDestino]) {
                    distancias[arco.idDestino] = nueva;
                    anteriores[arco.idDestino] = idActual;
                }
                arco = arco.siguienteArco;
            }
        }

        let camino = [];
        let actual = idFin;
        while (actual !== null) {
            camino.unshift(actual);
            actual = anteriores[actual];
        }

        return { camino: camino, distancia: distancias[idFin] };
    }
}

// LUGARES  DE FACATATIVÁ
const mapaUrbano = new Grafo();

mapaUrbano.agregarNodo("P1", "Universidad de Cundinamarca");
mapaUrbano.agregarNodo("P2", "Parque Principal");
mapaUrbano.agregarNodo("P3", "Estación de Policía");
mapaUrbano.agregarNodo("P4", "Hospital San Rafael");
mapaUrbano.agregarNodo("P5", "Villa del Prado");

// Distancias reales en metros
mapaUrbano.agregarArco("P1", "P2", 1400);   // Universidad - Parque Principal
mapaUrbano.agregarArco("P2", "P1", 1400);   // Parque Principal - Universidad

mapaUrbano.agregarArco("P1", "P3", 3000);   // Universidad - Estación Policía
mapaUrbano.agregarArco("P3", "P1", 3000);   // Estación Policía - Universidad

mapaUrbano.agregarArco("P2", "P3", 800);    // Parque Principal - Estación Policía
mapaUrbano.agregarArco("P3", "P2", 800);    // Estación Policía - Parque Principal

mapaUrbano.agregarArco("P2", "P4", 550);    // Parque Principal - Hospital
mapaUrbano.agregarArco("P4", "P2", 550);    // Hospital - Parque Principal

mapaUrbano.agregarArco("P3", "P4", 600);    // Estación Policía - Hospital
mapaUrbano.agregarArco("P4", "P3", 600);    // Hospital - Estación Policía

mapaUrbano.agregarArco("P4", "P5", 500);    // Hospital - Villa del Prado
mapaUrbano.agregarArco("P5", "P4", 500);    // Villa del Prado - Hospital

mapaUrbano.agregarArco("P3", "P5", 300);    // Estación Policía - Villa del Prado
mapaUrbano.agregarArco("P5", "P3", 300);    // Villa del Prado - Estación Policía