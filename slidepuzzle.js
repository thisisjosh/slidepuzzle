class Tile {
    constructor(num){
        this.num = num;
    }
}

class Board {
    constructor(){

        // Generate the tile tiles
        let generatedTiles = [];
        for(let i = 1; i <= 15; i++) {
            generatedTiles.push(new Tile(i));
        }
        
        for(let i = 1; i <= 15; i++) {
            let tile = removeRandomItem(generatedTiles);
            console.log(tile.num);
        }
    }
}

// remove a random item from a collection
function removeRandomItem(items){
    let index = randomIntFromInterval(0, items.length - 1);
    let item = items.splice(index, 1)[0]; // remove element at index
    return item;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function start(){
    console.log("start");
    let board = new Board();

}