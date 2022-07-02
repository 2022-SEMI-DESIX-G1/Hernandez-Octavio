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
            console.log(data);
            const evolutionUrl = App.utils.getEvolution(data.data.id);
            const evol = await axios.get(evolutionUrl);
            const renderedTemplate = App.templates.pokemonCard({ data },evol.data);
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
      pokemonCard: ({ data }, info) => {
        let evolutionList = info.evolutions.map(
          (element) => `<li>${element}</li> `
        );
        let locationList = info.locations.map(
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
                      </div>
                  </div>
        `;
      },
    },
  };
  App.init();
})();
