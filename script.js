"use strict";
const apiKey = `X79EC8SR83BN3PBEJA82FARP9`;

const contentSpace = document.querySelector(".content-space");

class InputBox {
  constructor(type, placeholder, maxlength, className) {
    this.placeholder = placeholder;
    this.type = type;
    this.maxlength = maxlength;
    this.className = className;
  }

  render() {
    const inputContent = document.createElement("div");
    inputContent.classList.add("input-content");

    const inputRow = document.createElement("div");
    inputRow.classList.add("input-row");

    const inputLines = document.createElement("div");
    inputLines.classList.add("input-lines");

    const textRow = document.createElement("p");
    textRow.classList.add("text-row");
    textRow.innerHTML = "Click here to check fishing conditions near you:";

    const input = document.createElement("input");
    input.classList.add("inputs");
    this.input = input;

    input.type = this.type;
    input.placeholder = this.placeholder;
    input.setAttribute("maxlength", this.maxlength);
    input.classList.add(this.className);

    const submitRow = document.createElement("div");
    submitRow.classList.add("submit-row");

    const submit = document.createElement("button");
    submit.classList.add("submit-btn");
    submit.type = this.type;
    submit.innerHTML += "Check";

    inputLines.appendChild(textRow);
    inputContent.appendChild(inputLines);
    contentSpace.appendChild(inputContent);
    submitRow.appendChild(submit);
    inputLines.appendChild(submitRow);
  }
  getValue() {
    return this.input.value.trim();
  }
}

class ResultBox {
  constructor(className) {
    this.className = className;
  }

  render() {
    const outputContent = document.createElement("div");
    outputContent.classList.add("output-content");

    const outputRow = document.createElement("div");
    outputRow.classList.add("output-row");

    const outputLines = document.createElement("div");
    outputLines.classList.add("output-lines");

    const outputTitle = document.createElement("h2");
    outputTitle.classList.add("output-title");
    outputTitle.innerHTML = "Current Fishing Conditions:";

    outputLines.appendChild(outputTitle);
    outputContent.appendChild(outputLines);
    contentSpace.appendChild(outputContent);
  }
}

const mainBox = new InputBox("text", "5 Syllables", "35", "input1");
const outputBox = new ResultBox("output-box");
mainBox.render();
outputBox.render();
const myWeatherButton = document.querySelector(".submit-btn");
const outputContent = document.querySelector(".output-content");
const inputContent = document.querySelector(".input-content");
outputContent.classList.add("hidden");
const inputLines = document.querySelector(".input-lines");
const outputLines = document.querySelector(".output-lines");

myWeatherButton.addEventListener("click", function (e) {
  e.preventDefault;

  const myWeather = async function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude } = position.coords;
          const { longitude } = position.coords;
          const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${apiKey}`;

          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Network response not okay`);
              }
              return response.json();
            })
            .then((data) => {
              inputContent.classList.add("hidden");
              outputContent.classList.remove("hidden");
              outputContent.classList.add("section-animation");
              console.log(data);
              const maxTemp = data.days[0].tempmax;
              const feelsLike = data.currentConditions.feelslike;
              const cloudCover = data.currentConditions.cloudcover;
              const precipProb = data.currentConditions.precipprob;
              const climateDataHTML = `<p class="today-max-temp output-data">Max Temperature: <span class="max-temp-colour">${maxTemp}°C</span></p>
            <p class="today-feels-like output-data">Feels Like: <span class="feels-like-colour">${feelsLike}°C</span></p>
            <p class="today-cloud-cover output-data">Cloud Cover: <span class="cloud-cover-colour">${cloudCover}%</span></p>
            <p class="today-precip-prob output-data">Precipitation Probability: <span class="precip-prob-colour">${precipProb}%</span></p>`;

              outputLines.insertAdjacentHTML("beforeend", climateDataHTML);
              const maxTempColour = document.querySelector(".max-temp-colour");
              const feelsLikeColour =
                document.querySelector(".feels-like-colour");
              const cloudCoverColour = document.querySelector(
                ".cloud-cover-colour"
              );
              const precipProbColour = document.querySelector(
                ".precip-prob-colour"
              );
              if (maxTemp >= 30) {
                maxTempColour.style.color = "#ba170b";
                maxTempColour.insertAdjacentHTML(
                  "beforeend",
                  `<span> Be careful! It's hot!</span>`
                );
              }
              if (feelsLike >= 30) {
                feelsLikeColour.style.color = "#ba170b";
                feelsLikeColour.insertAdjacentHTML(
                  "beforeend",
                  `<span> Be careful! It's hot!</span>`
                );
              }
              if (cloudCover >= 70) {
                cloudCoverColour.style.color = "#39403d";
                cloudCoverColour.insertAdjacentHTML(
                  "beforeend",
                  `<span> Fish are in shallow water.</span>`
                );
              }
              if (cloudCover <= 30) {
                cloudCoverColour.style.color = "#967311";
                cloudCoverColour.insertAdjacentHTML(
                  "beforeend",
                  `<span> Fish are in deeper water.</span>`
                );
              }
              if (precipProb >= 50) {
                precipProbColour.style.color = "#1e1c9c";
                precipProbColour.insertAdjacentHTML(
                  "beforeend",
                  `<span> Watch out for precipitation!</span>`
                );
              }
            })
            .catch((error) => {
              console.error(
                `There was an error with the fetch operation`,
                error
              );
            });
        },
        function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Please enable location access.");
          } else {
            alert("An error occured: " + error.message);
          }
        }
      );
    }
  };
  myWeather();
});
