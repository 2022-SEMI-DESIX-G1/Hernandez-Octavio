const express = require("express");
const app = express();

app.get("/fibonacci/:number", function (req, res) {
  const valor  = req.params.number;
  let fiboArray = [0,1];
  let data ={
    sequence:[]
  };
  for(let i =2;i<valor;i++){
    fiboArray[i]= fiboArray[i-1]+fiboArray[i-2];
  }
  data.sequence =data.sequence.concat(fiboArray);
  res.json(data);
});

app.listen(3000);
console.log(" Servidor corriendo en el puerto [3000] ");
