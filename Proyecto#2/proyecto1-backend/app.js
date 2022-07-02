require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
//const ERROR = {};
app.use(cors());

//** Conexion a Mongoose */
async function main() {
  await mongoose.connect("mongodb://localhost:27017/pokemondb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //** Modelo de Colección */
  const schema = new mongoose.Schema({
    name: "string",
    id: "string",
    weight: "string",
    height: "string",
    time: "number",
    types: "array",
    sprites: "object",
    base_experience: "number",
    evolutions: "array",
    location_area: "array",
  });
  const Pokemon = mongoose.model("Pokemon", schema);

  app.post("/pokemon/:name", async function (req, res) {
    const { name } = req.params;
    const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
    const urlEncounters = `https://pokeapi.co/api/v2/pokemon/${name}/encounters`;
    const species_pokemon = await axios(urlSpecies);
    const evolutions = await axios(species_pokemon.data.evolution_chain.url);
    let allEvolutions = getEvolutionPokemon(evolutions.data.chain);
    let locationPokemon = await axios(urlEncounters);
    let locationArray = [];

    //*Locación de los pokemones/
    locationPokemon.data.forEach((data) =>
      locationArray.push(data.location_area.name)
    );

    //* Función para obtencion de Cadena de Evolucion /
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

    //* Locación de Pokemones/
    const evoltionList = allEvolutions.map(({ species }) => `${species.name}`);
    const resultPokemon = await Pokemon.findOne({ name: name });

    //* Verifica el Cache de la BD con el atributo time
    if (resultPokemon) {
      if (resultPokemon.time < new Date()) {
        resultPokemon.delete();
      }
      return res.json({ name, data: resultPokemon, isCached: true });
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let responseData;
    try {
      const { data } = await axios.get(url);
      const timerCache = 5000;//* Timer del [CACHE] de los Pokemones //
      responseData = data;
      data.time = new Date(Date.now() + timerCache);
      data.evolutions = evoltionList;
      data.location_area = locationArray;
      Pokemon.create(data);
    } catch {
      responseData = data;
      //ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
    }
    res.json({ name, data: responseData, isCached: false });
  });

  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}...`);
  });
}
main();
