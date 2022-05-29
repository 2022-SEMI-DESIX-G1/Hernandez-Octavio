// Ejemplo del fetch
const axios = require("axios").default;

const main = async () => {
  const { data } = await axios("https://pokeapi.co/api/v2/pokemon/tauros");
  const species_pokemon = await axios(data.species.url);
  const evolutions= await axios(species_pokemon.data.evolution_chain.url)
  allEvolutions = getEvolutionPokemon(evolutions.data.chain);
  //console.log(evolutions.data.chain)
  name({data},allEvolutions);
};

function name({data},allEvolutions){
    console.log(`El Nombre del Pokemon es: [${data.name}]`);
    console.log(`El ID del Pokemon es: [${data.id}]`);
    console.log(`Su alrura/Peso es: [${data.height}/${data.weight}] `);
    const abilidadList = data.abilities.map(
        ({ability}) =>
          `${ability.name}`
        );
    console.log(`Habilidades del Pokemon: [${abilidadList.join(',')}]`);

    const evoltionList = allEvolutions.map(
        ({ species }) => `${species.name}`
    )
    console.log(`Evoluciones del Pokemon: [${evoltionList.join(',')}]`);
   
}

function getEvolutionPokemon(evolutions) {
  let evolutionChainArray = [evolutions];
  while (evolutions.evolves_to.length > 0) { 
      for(let i=0; i<evolutions.evolves_to.length; i++){
          evolutionChainArray.push(evolutions.evolves_to[i]);
      }
      evolutions = evolutions.evolves_to[0];
  }
  return evolutionChainArray;
}
main();

