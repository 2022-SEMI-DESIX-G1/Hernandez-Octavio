let fiboArray = [0,1];

function fibonacci (number){
    for(let i =2;i<number;i++){
        fiboArray[i]= fiboArray[i-1]+fiboArray[i-2];
    }
    return fiboArray
}

console.log(fibonacci(5));

