import RandomGen1Teams from './gen1/teams';
import { PRNG, PRNGSeed } from "../../sim/prng";
import { spawn } from 'child_process';

const args = process.argv.slice(2);

if (args.length !== 1) {
    console.error("This is a test that teamgen.cc matches the showdown team generator.");
    console.error("Please provide the number of seeds to check.");
    process.exit(1);
}

const n_seeds = Number(args[0]);
if (isNaN(n_seeds)) {
    console.error("Invalid input.");
    process.exit(1);
}

const waitForExit = (child: any) => {
    return new Promise((resolve) => {
        child.on('close', (data : any) => {
            resolve(data);
        });
    });
};

console.log(`Checking ${n_seeds} seeds...`);

async function test_seeds() {
    for (let i = 0; i < n_seeds; ++i) {
        let output = '';

        const seed: PRNGSeed = PRNG.generateSeed();
        let gen = new RandomGen1Teams('gen1randombattle', new PRNG(seed));
        const team = gen.randomTeam();

        const cl_args = seed.map(num => num.toString());

        const child = spawn('../../../../../build/teamgen', cl_args);
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        child.stderr.on('data', (data) => {
            console.error("teamgen encountered an error.");
            console.error(data);
            process.exit(1);
        });
        await waitForExit(child);
        console.log(output);
    }
}