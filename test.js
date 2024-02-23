ps = require('module')._load('./dist/sim/index.js', module, true);

const options = {
    formatid: 'gen1randombattle',
    p1: {team: null},
    p2: {team: null},
};

for (let i = 0; i < 1; ++i) {

    let ps_battle = new ps.Battle(options);
    let s0 = ps_battle.sides[0];
    let s1 = ps_battle.sides[1];
    
    s0.choose('move 1');
    s1.choose('move 1');
    ps_battle.commitDecisions();

}
