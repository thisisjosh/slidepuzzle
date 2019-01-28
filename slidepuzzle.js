// https://github.com/thisisjosh/slidepuzzle

class Tile {
    constructor(num) {
        this.num = num;
        this.down = -1;
        this.across = -1;
    }

    setBoardPosition(down, across) {
        this.down = down;
        this.across = across;
    }
}

class SlideGame {

    constructor(document) {
        this.document = document;
        this.tilesByNum = [];
        this.board = new Array(); // [down][across] jagged 2d array (array of arrays)
        this.spaceTile = new Tile(0);
        this.spaceTile.setBoardPosition(3, 3);
        let i = 0;

        // let generatedTiles = this.generateTiles();

        // Place the tiles on the board

        for (let down = 0; down < 4; down++) {
            this.board[down] = new Array();
            for (let across = 0; across < 4; across++) {
                let tile = new Tile(++i);
                tile.setBoardPosition(down, across);
                this.board[down][across] = tile;
                this.tilesByNum[i] = tile;
                if (i == 15)
                    break;
            }
        }
    }

    scramble() {
        for (let i = 0; i < 1000; i++) {
            let neighbors = [];
            // collect vertical or horizontal neighbors of the space
            for (let n = 0; n < 4; n++) {
                if (i % 2 == 0) {
                    if (n != this.spaceTile.across) {
                        neighbors.push(this.board[n][this.spaceTile.down]);
                    }
                }
                else {
                    if (n != this.spaceTile.down) {
                        neighbors.push(this.board[this.spaceTile.across][n]);
                    }
                }
            }
            // select random neighbor
            let toMove = neighbors[randomIntFromInterval(0, 2)];
            this.tilePressed(toMove.num, false);
        }
    }

    // Render the game to the page
    render() {
        let boardDiv = this.document.createElement("div");
        boardDiv.className = "board";

        for (let down = 0; down < 4; down++) {
            for (let across = 0; across < 4; across++) {
                let tile = this.board[down][across];
                if (!(down == 3 && across == 3)) {
                    let tileDiv = this.document.createElement("div");
                    tileDiv.className = "tile";
                    tileDiv.id = "tile_" + tile.num;
                    tileDiv.style.cssText = "position:absolute; width:50px; height:50px; line-height: 50px;";
                    tileDiv.style.top = (50 * down) + "px";
                    tileDiv.style.left = (50 * across) + "px";
                    tileDiv.innerHTML = "<span class='numLabel'>" + tile.num + "</span>";
                    tileDiv.addEventListener("click", onTilePress, false);
                    tile.tileDiv = tileDiv;
                    boardDiv.appendChild(tileDiv);
                }
                else {
                    console.log("space at " + down + " " + across);
                }
            }
        }

        boardDiv.style.cssText = "position:relative;width:200px;height:200px;";
        document.body.appendChild(boardDiv);
    }

    moveTile(tile, dir) {
        if (dir == "right") {
            console.log("moving right");
            this.board[tile.down][tile.across] = undefined;
            let neighbor = this.board[tile.down][tile.across + 1];
            if (typeof neighbor !== "undefined") {
                this.moveTile(neighbor, "right");
            }
            this.board[tile.down][tile.across + 1] = tile;
            tile.across++;
            tile.tileDiv.style.left = (50 * tile.across) + "px";
        }
        else if (dir == "left") {
            console.log("moving left");
            this.board[tile.down][tile.across] = undefined;
            let neighbor = this.board[tile.down][tile.across - 1];
            if (typeof neighbor !== "undefined") {
                this.moveTile(neighbor, "left");
            }
            this.board[tile.down][tile.across - 1] = tile;
            tile.across--;
            tile.tileDiv.style.left = (50 * tile.across) + "px";
        }
        else if (dir == "down") {
            console.log("moving down");
            this.board[tile.down][tile.across] = undefined;
            let neighbor = this.board[tile.down + 1][tile.across];
            if (typeof neighbor !== "undefined") {
                this.moveTile(neighbor, "down");
            }
            this.board[tile.down + 1][tile.across] = tile;
            tile.down++;
            tile.tileDiv.style.top = (50 * tile.down) + "px";
        }
        else if (dir == "up") {
            console.log("moving up");
            this.board[tile.down][tile.across] = undefined;
            let neighbor = this.board[tile.down - 1][tile.across];
            if (typeof neighbor !== "undefined") {
                this.moveTile(neighbor, "up");
            }
            this.board[tile.down - 1][tile.across] = tile;
            tile.down--;
            tile.tileDiv.style.top = (50 * tile.down) + "px";
        }
    }

    tilePressed(num, checkSolved = true) {
        let target = this.tilesByNum[num];
        let across = target.across;
        let down = target.down;

        // Is the space on this same row or column?
        if (this.spaceTile.down == target.down) {
            console.log("same row as space");
            if (this.spaceTile.across > target.across) {
                this.moveTile(target, "right");
            }
            else {
                this.moveTile(target, "left");
            }

            this.spaceTile.setBoardPosition(down, across);
        }
        else if (this.spaceTile.across == target.across) {
            console.log("same column as space");
            if (this.spaceTile.down > target.down) {
                this.moveTile(target, "down");
            }
            else {
                this.moveTile(target, "up");
            }

            this.spaceTile.setBoardPosition(down, across);
        }
        else {
            console.log("nowhere to move, spaceTile " + this.spaceTile.down + " " + this.spaceTile.across);
        }

        if (checkSolved && this.isSolved()) {
            alert("You Win!")
        }
    }

    isSolved() {
        let n = 0;
        for (let down = 0; down < 4; down++) {
            for (let across = 0; across < 4; across++) {
                let tile = this.board[down][across];
                if (typeof tile == "undefined") {
                    return false;
                }

                if (++n != tile.num) {
                    return false;
                }
                else if (n == 15) {
                    return true;
                }
            }
        }
        return false;
    }
}

// Global

var slideGame = new SlideGame(document);

function start(document) {
    console.log("start");
    slideGame.render();
    slideGame.scramble();
}

function onTilePress(event) {
    let num = event.target.textContent;
    if (event.target.tagName == "SPAN")
        num = event.target.parentElement.textContent;
    console.log("click " + num);
    slideGame.tilePressed(num);
}

// Utilities - TODO: Move to a lib

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}