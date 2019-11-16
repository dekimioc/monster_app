const attackValue = 10;
const monsterAttackValue = 14;
const strongAttackValue = 17;
const healValue = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];

function getMaxLifeValues() {
    const enteredValue = prompt("Please enter maximum life for you and the monster.", "100");

    let parsedValue = parseInt(enteredValue);

    if(isNaN(parsedValue) || parsedValue <= 0) {
        throw {message: 'Invalid user input, not a number!'}
    }
    return parsedValue;
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues();
} catch(error) {
    console.log(error);
    chosenMaxLife = 100;
}


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }

    if(event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = "MONSTER";
    } else if(event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target = "MONSTER";
    } else if(event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = "PLAYER";
    } else if(event === LOG_EVENT_PLAYER_HEAL) {
        logEntry.target = "PLAYER";
    } else if(event === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    battleLog.push(logEntry);
}

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("Bonus life save you");
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You WIN!");
        writeToLog(LOG_EVENT_GAME_OVER, "PLAYER WON", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("Monster WIN");
        writeToLog(LOG_EVENT_GAME_OVER, "MONSTER WON", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("You have a draw");
        writeToLog(LOG_EVENT_GAME_OVER, "DRAW", currentMonsterHealth, currentPlayerHealth);
        reset();
    }
}



function attackMonster(mode) {
    let maxDamage;
    let logEvent;
    if(mode ===  MODE_ATTACK) {
        maxDamage = attackValue;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if(mode === MODE_STRONG_ATTACK) {
        maxDamage = strongAttackValue;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster( MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let HEAL_VALUE;
    if(currentPlayerHealth >= chosenMaxLife - healValue) {
        alert("You can't heal to more than your max health");
        HEAL_VALUE = chosenMaxLife - currentPlayerHealth;
    } else {
        HEAL_VALUE = healValue;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(LOG_EVENT_PLAYER_HEAL, HEAL_VALUE, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogToConsole() {
    console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogToConsole);