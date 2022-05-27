// Ejemplo del fetch
const axios = require("axios").default;

const main = async () => {
  const { data } = await axios("https://pokeapi.co/api/v2/pokemon/pikachu");
  //console.log({ data });
  name({data});
};

function name({data}){
    console.log(`El Nombre del Pokemon es: [${data.name}]`);
    console.log(`El ID del Pokemon es: [${data.id}]`);
    console.log(`Su alrura/Peso es: [${data.height}/${data.weight}] `);
    const abilidadList = data.abilities.map(
        ({ability}) =>
          `${ability.name}`
        );
    console.log(`Habilidades del Pokemon: [${abilidadList.join(',')}]`);


}

main();
