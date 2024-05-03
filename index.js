const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const conf = JSON.parse(fs.readFileSync("./conf.json"));

//Set di voti - risultati per addestramento
const voti = [
  [5,8,5,8,5,7,4],
  [6,6,5,5,4,5,7],
  [8,6,6,5,4,7,6],
  [8,4,8,6,4,5,7],
  [8,8,7,8,5,6,7],
  [8,6,5,4,5,6,5],
  [7,5,6,8,4,8,7],
  [6,8,8,5,4,4,8],
  [5,7,6,7,7,6,7],
  [5,4,4,8,8,5,6]
];
const risultati = [
  "bocciato",
  "bocciato",
  "promosso",
  "promosso",
  "promosso",
  "bocciato",
  "promosso",
  "promosso",
  "promosso",
  "bocciato",
];
/**
 *  Funzione per calcolare la distanza tra due set di dati
 */
const dist = (arrayUno, arrayDue) => {
  if (arrayUno.length !== arrayDue.length) {
    return "error distanza";
  } else {
    let sommatoria = 0;
    for (let i = 0; i < arrayUno.length; i++) {
      sommatoria += Math.pow(arrayUno[i] - arrayDue[i], 2);
    }
    return Math.sqrt(sommatoria);
  }
};

/**
 * Funzione per trovare i più vicini
 */
const knn = (votiNew, k) => {
  if (votiNew.length != voti[0].length && voti.length > k) {
    return "error knn";
  } else {
    let distanze = [];
    for (let i = 0; i < voti.length; i++) {
      const distanza = dist(votiNew, voti[i]); //distanza rispetto ad uno studente di test
      distanze.push({ distanza, risultato: risultati[i] });
    }
    //di queste distanze ne prendo solo k più vicine => sort + slice
    distanze = distanze.sort((a, b) => a.distanza - b.distanza);
    return distanze.slice(0, k);
  }
};

/**
 * Funzione per classificare il risultato
 */
const classifica = (vicini) => {
  if (vicini.length > 0) {
    //conto quanti promossi e bocciati sono presenti
    const contatori = { promosso: 0, bocciato: 0 };
    vicini.forEach((element) => {
      contatori[element.risultato] += 1;
    });
    //return del possibile risultato
    return contatori.promosso > contatori.bocciato ? "promosso" : "bocciato";
  } else {
    return "error classifica";
  }
};

(() => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use("/", express.static(path.join(__dirname, "public")));

  app.post("/determina", (request, response) => {
    const { array } = request.body;
    if (array && array.length > 0) {
      const rsUno = knn(array, 3);
      const rsDue = classifica(rsUno);
      response.json({ result: rsDue });
    } else {
      response.json({ result: "Array non settato correttamente" });
    }
  });
  const server = http.createServer(app);
  server.listen(conf.port, () => {
    console.log("-> server running on port: " + conf.port);
  });
})();
