import RandomGen1Teams from './gen1/teams';
import { PRNG, PRNGSeed } from "../../sim/prng";
import { spawn } from 'child_process';
import assert = require('assert');

const waitForExit = (child: any) => {
    return new Promise((resolve) => {
        child.on('close', (data: any) => {
            resolve(data);
        });
    });
};

function processOutput(str : string) {
    return str
        .replace(/[:,]/g, '')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(str => str.split(' ').filter(name => name != '').map(name => name.trim().toLowerCase()).sort())
        .sort();
};

function processTeam(team : any[]) {
    const simpler = team.map(mon => [mon.species, mon.moves[0], mon.moves[1], mon.moves[2], mon.moves[3]].filter(name => name !== undefined));
    console.log(simpler);
    return simpler
    .map(arr => arr.map(name => name.trim().toLowerCase().replace(/[- .’]/g, '')).sort())
    .sort();
}

function assertEqual (a : string[][], b : string[][]) {
    assert(a.length === 6 && b.length === 6);
    for (let i = 0; i < 6; ++i) {
        const x = a[i];
        const y = b[i];
        assert(x.length == y.length);
        const l = x.length;
        assert(l === 2 || l === 5);
        // assert(x.length === 5 && y.length === 5);
        for (let j = 0; j < l; ++j) {
            assert(x[j] === y[j]);
        }
    }
}

async function test_seeds(n_seeds : number) {
    for (let i = 0; i < n_seeds; ++i) {
        let output = '';

        const seed: PRNGSeed = PRNG.generateSeed();
        let gen = new RandomGen1Teams('gen1randombattle', new PRNG(seed));
        const team = gen.randomTeam();
        const cl_args = seed.map(num => num.toString());

        const abs = "/home/user/oak/build/teamgen";
        const child = spawn(abs, cl_args);
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        child.stderr.on('data', (data) => {
            console.error("teamgen encountered an error.");
            console.error(data);
            process.exit(1);
        });
        await waitForExit(child);

        const x = processOutput(output);
        const y = processTeam(team);
        // console.log(output);
        console.log(x);
        console.log(y);
        // console.log(team);
        assertEqual(x, y);
    }
}

function main () {
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
    
    console.log(`Checking ${n_seeds} seeds...`);
    
    
    (async () => await test_seeds(n_seeds))();
}

main();