import RandomGen1Teams from './gen1/teams';
import { PRNG, PRNGSeed } from "../../sim/prng";

const args = process.argv.slice(2);

if (args.length !== 1) {
    console.error("This is a test that teamgen.cc matches the showdown team generator.");
    console.error("Please provide the number of seeds to check.");
    process.exit(1);
}

const n_seeds = Number(args[0]);
if (NaN(n_seeds)) {
    console.error("Invalid input.");
    process.exit(1);
}

console.log(`Checking ${n_seeds} seeds...`);

for (let i = 0; i < n_seeds; ++i) {
    const seed: PRNGSeed = PRNG.generateSeed();
    let gen = new RandomGen1Teams('gen1randombattle', new PRNG(seed));
    const team = gen.randomTeam();

    const cl_args = seed.map(num => num.toString());


    const child = process.spawn('../../../../build/teamgen', args);
    let output = '';
    child.stdout.on('data', (data) => {
        output += data.toString();
    });
    child.stderr.on('data', (data) => {
        console.error("teamgen encountered an error.");
        console.error(data);
        process.exit(1);
    });
}

