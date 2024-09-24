import RandomGen1Teams from './gen1/teams';
import { PRNG, PRNGSeed } from "../../sim/prng";

const args = process.argv.slice(2);

if (args.length !== 4) {
    console.error("Please provide exactly 4 numbers.");
    process.exit(1);
}

const seed: number[] = args.map((arg) => {
    const num = Number(arg);
    if (isNaN(num)) {
        console.error(`Invalid number: ${arg}`);
        process.exit(1);
    }
    return num;
});

let gen = new RandomGen1Teams('gen1randombattle', new PRNG(seed as PRNGSeed));
console.log(seed);
console.log(gen.randomTeam());