const compuestos = {
  metano: {
    nombre: "Metano",
    formula: "CH₄",
    clasificacion: "Hidrocarburo",
    grupo: "No aplica",
    atomos: ["C", "H", "H", "H", "H"],
    grafo: {
      0: [1, 2, 3, 4],
      1: [0],
      2: [0],
      3: [0],
      4: [0]
    }
  },

  etanol: {
    nombre: "Etanol",
    formula: "C₂H₆O",
    clasificacion: "Alcohol",
    grupo: "Hidroxilo (-OH)",
    atomos: ["C", "C", "O", "H", "H", "H", "H", "H", "H"],
    grafo: {
      0: [1, 3, 4, 5],
      1: [0, 2, 6, 7],
      2: [1, 8],
      3: [0],
      4: [0],
      5: [0],
      6: [1],
      7: [1],
      8: [2]
    }
  },

  acidoAcetico: {
    nombre: "Ácido acético",
    formula: "C₂H₄O₂",
    clasificacion: "Ácido carboxílico",
    grupo: "Carboxilo (-COOH)",
    atomos: ["C", "C", "O", "O", "H", "H", "H", "H"],
    grafo: {
      0: [1, 4, 5, 6],
      1: [0, 2, 3],
      2: [1],
      3: [1, 7],
      4: [0],
      5: [0],
      6: [0],
      7: [3]
    }
  }
};

let compuestoActual = compuestos.metano;

const selector = document.getElementById("selectorCompuesto");
const nombre = document.getElementById("nombre");
const formula = document.getElementById("formula");
const clasificacion = document.getElementById("clasificacion");
const grupo = document.getElementById("grupo");
const listaAtomos = document.getElementById("listaAtomos");
const molecula = document.getElementById("molecula");
const resultadoBFS = document.getElementById("resultadoBFS");
const resultadoClasificacion =
  document.getElementById("resultadoClasificacion");

function mostrarCompuesto() {
  compuestoActual = compuestos[selector.value];

  nombre.textContent = compuestoActual.nombre;
  formula.textContent = compuestoActual.formula;
  clasificacion.textContent = compuestoActual.clasificacion;
  grupo.textContent = compuestoActual.grupo;

  mostrarAtomos();
  mostrarGrafo();

  resultadoBFS.textContent = "Esperando análisis...";
  resultadoClasificacion.textContent = "Esperando análisis...";
}

function mostrarAtomos() {
  listaAtomos.innerHTML = "";

  compuestoActual.atomos.forEach((atomo, indice) => {
    const elemento = document.createElement("span");
    elemento.className = "atomo";
    elemento.textContent = `${atomo}${indice + 1}`;
    listaAtomos.appendChild(elemento);
  });
}

function mostrarGrafo() {
  molecula.innerHTML = "";

  const contenedor = document.createElement("div");
  contenedor.className = "molecule-visual";

  compuestoActual.atomos.forEach((atomo, indice) => {
    const nodo = document.createElement("div");
    nodo.className = "node";
    nodo.textContent = `${atomo}${indice + 1}`;

    contenedor.appendChild(nodo);

    if (indice < compuestoActual.atomos.length - 1) {
      const enlace = document.createElement("div");
      enlace.className = "edge";
      contenedor.appendChild(enlace);
    }
  });

  molecula.appendChild(contenedor);
}

function recorridoBFS(grafo, inicio = 0) {
  const visitados = new Set();
  const cola = [inicio];
  const orden = [];

  while (cola.length > 0) {
    const actual = cola.shift();

    if (!visitados.has(actual)) {
      visitados.add(actual);
      orden.push(actual);

      grafo[actual].forEach(vecino => {
        if (!visitados.has(vecino)) {
          cola.push(vecino);
        }
      });
    }
  }

  return orden;
}

function ejecutarBFS() {
  const recorrido = recorridoBFS(compuestoActual.grafo);

  const etiquetas = recorrido.map(indice =>
    `${compuestoActual.atomos[indice]}${indice + 1}`
  );

  resultadoBFS.innerHTML =
    `<strong>Recorrido completado:</strong><br>` +
    etiquetas.join(" → ") +
    `<br><br>Se visitaron ${etiquetas.length} nodos utilizando una cola.`;
}

function clasificarCompuesto() {
  let resultado;

  if (compuestoActual.grupo.includes("Carboxilo")) {
    resultado =
      "Se detectó el grupo carboxilo (-COOH). " +
      "Clasificación: ácido carboxílico.";
  } else if (compuestoActual.grupo.includes("Hidroxilo")) {
    resultado =
      "Se detectó un grupo hidroxilo (-OH). " +
      "Clasificación: alcohol.";
  } else {
    resultado =
      "El compuesto contiene carbono e hidrógeno y no tiene " +
      "un grupo funcional adicional registrado. " +
      "Clasificación: hidrocarburo.";
  }

  resultadoClasificacion.innerHTML =
    `<strong>Análisis automático:</strong><br>${resultado}`;
}

document
  .getElementById("btnAnalizar")
  .addEventListener("click", mostrarCompuesto);

document
  .getElementById("btnBFS")
  .addEventListener("click", ejecutarBFS);

document
  .getElementById("btnClasificar")
  .addEventListener("click", clasificarCompuesto);

selector.addEventListener("change", mostrarCompuesto);

mostrarCompuesto();
