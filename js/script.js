const fieldSize = 83;
const obstacles = 8;
let tiles = [];
let maxMoves = 3;
let playerActive;
let activePlayer = 1;
let currentWeapon = 1;
let turn = true;
let playerDefend = null;
let player1Active = true;
let player2Active = false;
let move = true;
let attacked = false;


const rules = $('#rules'); 
const card1 = $('.card1-container');
const card2 = $('.card2-container');
const card3 = $('.card3-container');
const attackBtn1 = $('.btn-attack-1');
const attackBtn2 = $('.btn-attack-2');
const defendBtn1 = $('.btn-defend-1');
const defendBtn2 = $('.btn-defend-2');
const playAgainButton = $('#again');
const fieldBox = $('#board-game');
const gameOverContainer =$('#gameOver');
const playerContainerDiv = $('.player-container');
const damage1 = $('.damage-1');
const damage2 = $('.damage-2');
const body = $('body');
let scores = 0;


// field constructor function to create the board with obstacles
   class Field {
    constructor(fieldSize) {
        this.fieldSize = fieldSize;
    }
   createField() {
    for (let i = 0; i <= fieldSize; i += 1) {
        fieldBox.append('<div class="box" boxID="' + i + '"></div>');
        let numTiles = $('.box').length;
        tiles.push(numTiles);
      }
      
   }
   obstacles(itemClass) {
    addComponents(itemClass)
  }
}  
let game = new Field(fieldSize);


// player construction function

class Player {
    constructor(name, lifeScore, itemClass, player, weapon, power) {
        this.name = name;
        this.lifeScore = lifeScore;
        this.itemClass = itemClass;
        this.player = player;
        this.weapon = weapon;
        this.power = power;
    }
    add() {
        addComponents(this.itemClass, this.player); // add players to the field
    }
    setData() { // set information about players
        $('.name-'+this.player).text(this.name);
        $('#life-'+ this.player).text(this.lifeScore);
        $('<img src="image/wp-1.png">').appendTo(".ball-" + this.player);
        $('.damage-' + this.player).text(this.power);
    }
    // players fight
    attack(whichPlayer) {
        if(playerDefend == 1) {
            whichPlayer.lifeScore -= (this.power/2);
            playerDefend = 0;
        } else {
            whichPlayer.lifeScore -= this.power;
            }
            $('#life-' + whichPlayer.player).text(whichPlayer.lifeScore);
            if(whichPlayer.lifeScore <= 0) {
            gameOverBoard();
       }
    }
    winner(whichPlayer) {
        if(whichPlayer.lifeScore <= 0) {
            $('#winner').text(this.name);
        } else if (this.lifeScore <= 0) {
            $('#winner').text(whichPlayer.name);
           
        }
      }  
    }
      
// create Players
let player1 = new Player('Ronaldo', 100, 'player1', 1, 'wp-1', 10);
let player2 = new Player('Messi', 100, 'player2', 2, 'wp-1', 10);

// weapon constructor
class Weapon {
    constructor(type, value, itemClass) {
        this.type = type;
        this.value = value;
        this.itemClass = itemClass;
    }
 //add weapons to the field   
    add() {
        addComponents(this.itemClass);
    }
}
// create weapons with their attributes:
let ball = new Weapon('ball', 10, 'wp-1 weapon');
let shoes = new Weapon('shoes', 30, 'wp-2 weapon');
let cup = new Weapon('cup', 40, 'wp-3 weapon');
let whistle = new Weapon('whistle', 50, 'wp-4 weapon');
let water = new Weapon('water', 60, 'wp-5 weapon');



// movement of the players
function playerPlay() {
        let gameSq = $('.box'); 
    // by the click method choose the next position of the player 
    gameSq.on('click', function () {
        let sqClicked = $(this).attr('boxID');
        posNew = getCoordinates(sqClicked);
    //new position of the player chosen by mouse click vertically - coordinate X
            for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
            let num = getTileIndex(i, posOld.y);
            let tile = $('.box[boxID= ' + num + ']');
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
            }
        }
        //check possible new position of the player chosen by mouse click vertically
            for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
            let num = getTileIndex(posOld.x, i);
            let tile = $('.box[boxID= ' + num + ']');
           
            // if new tile includes obstacle - don't move
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            // if new tile includes players - don't move
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
              }
            }
            if (player1Active) {
            if ($(this).hasClass('player1')){
                return;
             }
            }else{
            if ($(this).hasClass('player2')){
                return;
             }
            }

        if (move) {
            // check when the player can move maximum 3 tiles (maximumMoves) horizontally or vertically
                if (posNew.y === posOld.y && posNew.x <= posOld.x + maxMoves && posNew.x >= posOld.x - maxMoves
                || posNew.x === posOld.x && posNew.y <= posOld.y + maxMoves && posNew.y >= posOld.y - maxMoves) {
                // check the position X
                for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
                    console.log(i);
                    console.log(posOld.y);
                    let num = getTileIndex(i, posOld.y);
                    checkWeapon(num);
                }
                // check the position Y
                for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
                    let num = getTileIndex(posOld.x, i);
                    checkWeapon(num);
                }
                // show cards to the field when players move 
                extraPoints();
                whoIsActive();
                // if the player moved, his tile lose a class 'active', which is set to opposite player
                if (player1Active) {
                    playerPosition = boxPosition('.player2');
                    posOld = getCoordinates(playerPosition);
                    $('.player1').removeClass('player1').removeClass('active');
                    $(this).addClass('player1');
                    $('.player2').addClass('active');
                    fight(posNew, posOld);
                    player1Active = false;

                
                } else {
                    playerPosition = boxPosition('.player1');
                    posOld = getCoordinates(playerPosition);
                    $('.player2').removeClass('player2').removeClass('active');
                    $(this).addClass('player2');
                    $('.player1').addClass('active');
                    fight(posNew, posOld);
                    player1Active = true;
                }
            }
        }
    });
}

// replace the weapon on the field:
function replaceWeapon(value, weapon, num) {
    let tile = $('.box[boxID= ' + num + ']');
    whoIsActive();
    tile.removeClass(weapon).addClass(playerActive.weapon);
    playerActive.weapon = weapon;    
    playerNotActive.power = value;         
}

// check weapon on the tile and call replace functions (for the player's boards and for the field):
function checkWeapon(num) {
    let tile = $('.box[boxID=' + num + ']');  
    if (tile.hasClass('weapon')) {
        if (tile.hasClass('wp-1')) {
            currentWeapon = 1;
            replaceWeapon(ball.value, 'wp-1', num);
            replaceWeaponOnBoard(ball.value);
            return;
        }
        if (tile.hasClass('wp-2')) {
            currentWeapon = 2;
            replaceWeapon(shoes.value, 'wp-2', num);
            replaceWeaponOnBoard(shoes.value);
            return;
        }
        if (tile.hasClass('wp-3')) {
            currentWeapon = 3;
            replaceWeapon(cup.value,'wp-3',num);
            replaceWeaponOnBoard(cup.value); 
            return;
        }
        if (tile.hasClass('wp-4')) {
            currentWeapon = 4;
            replaceWeapon(whistle.value, 'wp-4', num);
            replaceWeaponOnBoard(whistle.value);
            return;
        }
        if (tile.hasClass('wp-5')) {
            currentWeapon = 5;
            replaceWeapon(water.value,'wp-5', num);
            replaceWeaponOnBoard(water.value);
            return;
            }
        }

}

// add or remove points function
function extraPoints() {
    let posX = Math.abs(posNew.x - posOld.x);
    let posY = Math.abs(posNew.y - posOld.y);

        if (posX === maxMoves || posY === maxMoves){  
            whoIsActive();                                                                                                           
            card3.show();
            card2.hide();
            card1.hide();
            playerNotActive.lifeScore += 20; 
            $('#life-'+ playerNotActive.player).text(playerNotActive.lifeScore); 
        } else if (posX === maxMoves - 1 || posY === maxMoves - 1) {     
            whoIsActive();             
            card1.show();
            card3.hide();
            card2.hide();
            playerNotActive.lifeScore -= 5; 
            $('#life-'+ playerNotActive.player).text(playerNotActive.lifeScore);
        } else if (posX === maxMoves - 2 || posY === maxMoves - 2) {  
            whoIsActive();                      
            card2.show();
            card1.hide();
            card3.hide();    
            playerNotActive.lifeScore -= 10; 
            $('#life-'+ playerNotActive.player).text(playerNotActive.lifeScore);                                       	
        }        
     }

// If players cross over adjacent squares (horizontally or vertically), a battle begins
function fight(posNew, posOld) {
    if (posNew.x === posOld.x && posNew.y <= posOld.y + 1 && posNew.y >= posOld.y - 1 || posNew.y === posOld.y 
        && posNew.x <= posOld.x + 1 && posNew.x >= posOld.x - 1) {
        move = false;
        fightingArea();
        playersFight();
    }
}

//initialize the Game
function loadGame() {
    game.createField();
    for (let i = 0; i < obstacles; i += 1) {
        game.obstacles('obstacle');
    }
    shoes.add();
    cup.add();
    whistle.add();
    water.add();
    player1.add();
    player2.add();
    player1.setData();
    player2.setData();
    $('.player1').addClass('active');
    $('#player-' + activePlayer).addClass('active-board'); 
}

loadGame();
playerPlay();

// check which player is active:
function whoIsActive() {
    if (player1Active) {
        activePlayer = 2;
        notActivePlayer = 1;
        setActivePlayer(player2, player1, damage2);
        setActiveBoard(notActivePlayer, activePlayer);
    } else {
        activePlayer = 1; 
        notActivePlayer = 2;
        setActivePlayer(player1, player2, damage1);
        setActiveBoard(notActivePlayer, activePlayer,);
    }
}

// to find position x and y on the field 
function getCoordinates(tile) {
    return {
        x: (tile) % 12  
        ,
        y: Math.floor((tile) / 12    )
    }
    
}
// to find the position of the box with player class
const boxPosition = (itemClass) => {
    return $(itemClass).attr('boxID');
};
let playerPosition = boxPosition('.player1');
// old position is the position of not active player in the moment
let posOld = getCoordinates(playerPosition);

// index of the tile on the field
function getTileIndex(x, y) {
    return y * 12 + x;
}
/* add components to the field function like obstacles, weapon, players, which is used by 'add' function by their function constructor */
function addComponents(itemClass, player) {
    let restOfTiles = tiles;
    let boxes = $('.box');
    let empty = true;
    while (empty) {
        let item = random(fieldSize);
        if (player === 1) {
            startPosition = (item % 12 === 0);
        } else if (player === 2) {
            startPosition = (item % 12 === 11);
        } else {
            startPosition = (item % 12 !== 0 && item % 12 !== 7);
        }
        if (startPosition && restOfTiles.includes(item)) {
            boxes.eq(item).addClass(itemClass);
            let index = restOfTiles.indexOf(item);
            restOfTiles.splice(index, 1);
            empty = false;
        }
    }
}
// randomize the boxes on the map to randomize position of game's components
function random(num) {
    return Math.floor(Math.random() * num);
}

//set attributes to the active player to use them by replacing weapon
function setActivePlayer(Active, notActive, activePowerDiv) {
    playerActive = Active;
    playerNotActive = notActive; 
    activePlayerPowerDiv = activePowerDiv;      
}

// add a class for a board of the active player to display current information about game flow
function setActiveBoard(notActivePlayer, activePlayer) {
    $('#player-' + notActivePlayer).removeClass('active-board');
    $('#player-' + activePlayer).addClass('active-board');
}

// replace the information on the player's board:
function replaceWeaponOnBoard(power){
    whoIsActive();
    $('.ball-' + notActivePlayer).empty();
    $('<img src="image/wp-' + currentWeapon +'.png">').appendTo(".ball-" + notActivePlayer);
    $(".damage-" + notActivePlayer).text(power);
}

// show and hide buttons during the fight
function combat() {
 if (turn == 1) {
        attackBtn2.hide();
        defendBtn2.hide();
        attackBtn1.show();
        defendBtn1.show();
 } else if (turn == 2) {
        attackBtn1.hide();
        defendBtn1.hide();
        attackBtn2.show();
        defendBtn2.show();       
    }
}

// when the players fight, the board game is hidden
function fightingArea() {
    card1.hide();
    card2.hide();
    card3.hide();
    fieldBox.hide();
    rules.hide();
    $('#player-1').css('margin-left', '500px');
    $('#player-2').css('margin-right', '500px');
    $(body).css({
        'backgroundImage' : 'url("image/background.jpg")',
        'backgroundSize'  : 'no-repeat'
    })
    $('#player-' + activePlayer).removeClass('active-board');
    attackBtn1.show();
    defendBtn1.show();
}

// display Game Over board at the end, when battle is finished
function gameOverBoard() {
    card1.hide();
    card2.hide();
    card3.hide();
    rules.hide();
    $('.player-container').hide();
    gameOverContainer.show();
    player1.winner(player2);
    $(body).css({
        'backgroundImage' : 'url("image/fireworks.jpg")',
        'backgroundSize'  : 'no-repeat'
    })
}

// attack and defend buttons connected with attack function mentioned in player function constructor
function playersFight(){
    attackBtn1.click(() => {
        player1.attack(player2);
        playerDefend = 0;
        turn = 2;
        activePlayer = 2;
        combat();
    });
    defendBtn1.click(() => {
        playerDefend = 1;
        turn = 2;
        activePlayer = 2;
        combat();
        
    });
    attackBtn2.click(() => {
        player2.attack(player1);
        playerDefend = 0;
        turn = 1;
        activePlayer = 1;
        combat();
    });
    defendBtn2.click(() => {       
        turn = 1;
        playerDefend = 1;
        activePlayer = 1;
        combat()       
    })
}


function newGame() {
    location.reload();
 }









