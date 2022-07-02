(() => {
  const App = {
    config: {
      apiBaseUrl: "http://localhost:3000/pokemon",
    },
    htmlElements: {
      form: document.querySelector(".pokemon-form"),
      input: document.querySelector("#pokemon-input"),
      checkSprites: document.querySelector("#sprites"),
      checkLocation: document.querySelector("#locations"),
      checkEvolution: document.querySelector("#evolutions"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-respose"),
    },
    init: () => {
      App.htmlElements.form.addEventListener(
        "submit",
        App.handlers.handleFormSubmit
      );
      App.htmlElements.checkSprites.addEventListener(
        "change",
        App.handlers.handlerSpriteChecked
      );

      App.htmlElements.checkLocation.addEventListener(
        "change",
        App.handlers.handlerLocationChecked
      );

      App.htmlElements.checkEvolution.addEventListener(
        "change",
        App.handlers.handlerEvolutionChecked
      );
    },
    handlers: {
      handleFormSubmit: async (e) => {
        e.preventDefault();
        const pokemon = App.htmlElements.input.value;
        if (pokemon.length > 0) {
          const url = App.utils.getUrl({ pokemon });
          try {
            const { data } = await axios.post(url);
            console.log({data});
            const renderedTemplate = App.templates.pokemonCard({ data },data.data);
            App.htmlElements.pokemonFinderOutput.style.display = "block";
            App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;
            App.htmlElements.checkEvolution.checked = false;
            App.htmlElements.checkSprites.checked = false;
            App.htmlElements.checkLocation.checked = false;
          } catch (error) {
            console.log(error);
          }
        } else {
          alert("[ERROR]: Llene el campo de busqueda");
        }
      },
      handlerSpriteChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById("container_sprites");
        if (App.htmlElements.checkSprites.checked) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      },
      handlerLocationChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById("container_locations");
        if (App.htmlElements.checkLocation.checked) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      },
      handlerEvolutionChecked: (e) => {
        e.preventDefault();
        let element = document.getElementById("container_evolutions");
        if (App.htmlElements.checkEvolution.checked) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      },
    },
    utils: {
      getUrl: ({ pokemon }) => {
        return `${App.config.apiBaseUrl}/${pokemon}`;
      },
      getEvolution: (id) => {
        return `${App.config.apiBaseUrl}/${id}`;
      },
    },
    templates: {
      pokemonCard: ({ data }) => {
        let evolutionList = data.data.evolutions.map(
          (element) => `<li>${element}</li> `
        );
        let locationList = data.data.location_area.map(
          (element) => `<li>${element}</li> `
        );
        return `
                  <div class="bg-gray card-template">
                  <div class="d-flex">
                      <div class="header_balls_2">
                          <div class="circle"></div>
                          <div class="circle"></div>
                          <div class="circle"></div>
                      </div>
                      <div class="header-title">
                          <h3>DATOS GENERALES</h3>
                      </div>
                  </div>
                  <div class="tarjeta_generales">
                      <div class="d-flex tarjeta_info">
                          <label class="badget">ID: N°${data.data.id}</label>
                          <h5>${data.data.name}</h5>
                          <img src="${
                            data.data.sprites.other.home.front_default
                          }" alt="Pokemon_Fantasy">
                      </div>
                      <div class="d-flex d-between align-center tarjeta_detail">
                          <label>Experiencia:</label><span> ${
                              data.data.base_experience
                              }</span>
                          <label>Altura/Peso:</label><span>${data.data.height}/${
                              data.data.weight
                              }</span>
                          <label>Tipo:</label><span>${
                              data.data.types[0].type.name
                              }<span>
                      </div>
                  </div>
                  <div class="bg-gray" id="container_sprites">
                    <h6>Sprites</h6>
                    <img src="${
                            data.data.sprites.front_default
                          }" alt="sprites_front_default">
                    <img src="${
                            data.data.sprites.back_default
                          }" alt="sprites_back_default">
                    <img src="${
                            data.data.sprites.back_shiny
                            }" alt="sprites_back_shiny">
                    <img src="${
                            data.data.sprites.front_shiny
                          }" alt="sprites_front_shiny">
                    <img src="${
                            data.data.sprites.back_female
                          }" alt="sprites_back_female" 
                            class="${data.data.sprites.back_female != null ? "d-visible" : "d-none" }" >
                    <img src="${
                            data.data.sprites.front_female
                          }" alt="sprites_front_female" 
                            class="${data.data.sprites.front_female != null ? "d-visible" : "d-none" }">
              </div>
              <div class="bg-gray" id="container_evolutions">
                      <h6>Cadena de Evolucion</h6>
                      <ul>
                          ${evolutionList.join("")}
                      </ul>
                  </div>
                  <div class="bg-gray" id="container_locations">
                      <h6>Donde lo puedes encontrar</h6>
                      <ul>
                          ${locationList.join("")}
                      </ul>
                  </div>

        `;
      },
    },
  };
  App.init();
})();
