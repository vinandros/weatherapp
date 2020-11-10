const container = document.querySelector(".container");
const result = document.querySelector("#resultado");
const form = document.querySelector("#formulario");

window.addEventListener("load", () => {
  form.addEventListener("submit", searchWeather);
});

function searchWeather(e) {
  e.preventDefault();

  const town = document.querySelector("#ciudad").value;
  const country = document.querySelector("#pais").value;

  if (town === "" || country === "") {
    showError("Todos los campos son obligatorios");
    return;
  }
  requestAPI(town, country);
}

function requestAPI(town, country) {
  const APIKey = "c88f4c5618aa18629aabec2904c77051";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${town},${country}&appid=${APIKey}`;

  Spinner();
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === "404") {
        showError("Ciudad no encontrada.");
        return;
      }
      setTimeout(() => {
        clearHTML();
        showResponseWeather(data);
      }, 3000);
    })
    .catch((error) => console.log("Error de red!"));
}

function showResponseWeather(data) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = data;

  const centegrades = kelvinToCenti(temp);
  const centegradesMax = kelvinToCenti(temp_max);
  const centegradesMin = kelvinToCenti(temp_min);

  const nameCountry = document.createElement("p");
  nameCountry.textContent = `Clima en ${name}`;
  nameCountry.classList.add("font-bold", "text-2xl");

  const actual = document.createElement("p");
  actual.innerHTML = `${centegrades} &#8451;`;
  actual.classList.add("font-bold", "text-6xl");

  const tempMAx = document.createElement("p");
  tempMAx.innerHTML = `Max: ${centegradesMax} &#8451;`;
  tempMAx.classList.add("text-xl");

  const tempMin = document.createElement("p");
  tempMin.innerHTML = `Min: ${centegradesMin} &#8451;`;
  tempMin.classList.add("text-xl");

  const resultDiv = document.createElement("div");
  resultDiv.classList.add("text-center", "text-white");
  resultDiv.appendChild(nameCountry);
  resultDiv.appendChild(actual);
  resultDiv.appendChild(tempMAx);
  resultDiv.appendChild(tempMin);

  result.appendChild(resultDiv);
}

const kelvinToCenti = (grados) => parseInt(grados - 273.15);

function showError(msg) {
  const alert = document.querySelector(".bg-red-100");
  if (!alert) {
    const alert = document.createElement("div");
    alert.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alert.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${msg}</span>
    `;

    container.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function clearHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function Spinner() {
  clearHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");
  divSpinner.innerHTML = `
    <div class="dot1"></div>
    <div class="dot2"></div>
`;
  result.appendChild(divSpinner);
}
