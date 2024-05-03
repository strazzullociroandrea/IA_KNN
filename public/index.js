const voto1 = document.getElementById("voto1");
const voto2 = document.getElementById("voto2");
const voto3 = document.getElementById("voto3");
const voto4 = document.getElementById("voto4");
const voto5 = document.getElementById("voto5");
const voto6 = document.getElementById("voto6");
const voto7 = document.getElementById("voto7");
const crea = document.getElementById("crea");

crea.onclick = async () => {
  if (
    voto1.value != "" &&
    voto2.value != "" &&
    voto3.value != "" &&
    voto4.value != "" &&
    voto5.value != ""
  ) {
    let rsp = await fetch("/determina", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        array: [
          parseInt(voto1.value),
          parseInt(voto2.value),
          parseInt(voto3.value),
          parseInt(voto4.value),
          parseInt(voto5.value),
          parseInt(voto6.value),
          parseInt(voto7.value),
        ],
      }),
    });
    rsp = await rsp.json();
    alert("Lo studente risulta essere: " + rsp.result + ".");
    voto1.value =
      voto2.value =
      voto3.value =
      voto4.value =
      voto5.value =
      voto6.value =
      voto7.value =
        "";
  } else {
    alert("Assicurati di aver inserito tutti i voti.");
  }
};
