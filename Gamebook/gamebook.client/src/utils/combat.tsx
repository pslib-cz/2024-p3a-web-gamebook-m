// utils/combat.ts
interface Combatant {
    strength: number;
    will: number;
    lives: number; // HP
    name: string;
    pointsOfDestiny: number;
}

export const handleFight = (player: Combatant, enemy: Combatant, fatePointUsed: boolean, updateLives: (newLives: number) => void): string => {
    // 1. Určení typu boje:
    const fightType = player.strength > enemy.will ? "physical" : "mental";
    const playerStat = fightType === "physical" ? player.strength : player.will;
    const enemyStat = fightType === "physical" ? enemy.strength : enemy.will;
    const statName = fightType === "physical" ? "Sílu" : "Vůli";

    // 2. Hod kostkou:
    const playerRoll = Math.floor(Math.random() * 6) + 1; // Počáteční hod - const
    const enemyRoll = Math.floor(Math.random() * 6) + 1;
    let playerTotal = playerStat + playerRoll;
    const enemyTotal = enemyStat + enemyRoll; // fixed by changing let to const

    let message = `Boj: Hráč (total ${playerTotal} s ${statName} ${playerStat} + hod ${playerRoll}), Nepřítel (total ${enemyTotal} s ${statName} ${enemyStat} + hod ${enemyRoll})`;

    // 3. Použití bodu osudu:
    if (playerTotal <= enemyTotal && fatePointUsed) { // Changed to fatePointUsed
        const newPlayerRoll = Math.floor(Math.random() * 6) + 1;
        playerTotal = playerStat + newPlayerRoll;
        message += `\nHráč použil bod osudu a přehodil kostku! Nový hod: ${newPlayerRoll}, nový total: ${playerTotal}`;
    }

    // 4. Vyhodnocení boje:
    if (playerTotal > enemyTotal) {
        message += "\nHráč vyhrál!";
        return message; // Hráč vyhrál
    } else if (playerTotal < enemyTotal) {
        const damage = 1; // Ztráta 1 života
        const newLives = Math.max(0, player.lives - damage);
        updateLives(newLives);
        message += `\nHráč prohrál a ztratil ${damage} život! Zbývající životy: ${newLives}`;
        return message; // Hráč prohrál a ztratil život
    } else {
        message += "\nRemíza! Nikdo neztratil život.";
        return message; // Remíza
    }
};