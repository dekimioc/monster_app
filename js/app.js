const attackValue = 10;
const monsterAttackValue = 14;
const strongAttackValue = 17;
const healValue = 20;

let chosenMaxLife = 100;

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth -= playerDamage;

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("Bonus life save you");
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You WIN!");
        reset();
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("Monster WIN");
        reset();
    } else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("You have a draw");
        reset();
    }
}



function attackMonster(mode) {
    let maxDamage;
    if(mode === "ATTACK") {
        maxDamage = attackValue;
    } else if(mode === "STRONG_ATTACK") {
        maxDamage = strongAttackValue;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler() {
    attackMonster("ATTACK")
}

function strongAttackHandler() {
    attackMonster("STRONG_ATTACK")
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
    endRound();
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);