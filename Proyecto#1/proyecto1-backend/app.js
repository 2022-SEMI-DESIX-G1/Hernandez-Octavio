require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;

const { PORT = 3000 } = process.env;

const CACHE = {};
const ERROR = {};

app.use(cors());

app.get("/cache", function (req, res) {
  res.json({ data: CACHE });
});

app.post("/pokemon/:name", async function (req, res) {
  const { name } = req.params;

  if (CACHE[name]) {
    if (JSON.parse(CACHE[name]).time > new Date()) {
      delete CACHE[name];
    } else {
      return res.json({name,data: JSON.parse(CACHE[name]),isCached: true,Hi: true});
    }
  }

  if (ERROR[name]) {
    return res.json({ name, data: JSON.parse(ERROR[name]), isCached: true });
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  let responseData;
  try {
    const { data } = await axios.get(url);
    console.log(data);
    responseData = data;
    data.time = new Date(Date.now() + 1000);
    CACHE[name] = JSON.stringify(data);
  } catch {
    responseData = data;
    ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
  }
  res.json({ name, data: responseData, isCached: false });
});

app.get("/pokemon/:name", async function (req, res) {
  const id = req.params.name;
  const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

  const urlEncounters = `https://pokeapi.co/api/v2/pokemon/${id}/encounters`;

  const species_pokemon = await axios(urlSpecies);
  const evolutions = await axios(species_pokemon.data.evolution_chain.url);
  let allEvolutions = getEvolutionPokemon(evolutions.data.chain);
  let locationPokemon = await axios(urlEncounters);
  let locationArray = [];

  locationPokemon.data.forEach((data) =>
    locationArray.push(data.location_area.name)
  );

  function getEvolutionPokemon(evolutions) {
    let evolutionChainArray = [evolutions];
    while (evolutions.evolves_to.length > 0) {
      for (let i = 0; i < evolutions.evolves_to.length; i++) {
        evolutionChainArray.push(evolutions.evolves_to[i]);
      }
      evolutions = evolutions.evolves_to[0];
      evolutions.evolves_to.length + 1;
    }
    return evolutionChainArray;
  }
  /** LUGAR DONDE ENCUENTRAS EL POKEMON  */
  const evoltionList = allEvolutions.map(({ species }) => `${species.name}`);
  res.json({ locations: locationArray, evolutions: evoltionList });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
});
