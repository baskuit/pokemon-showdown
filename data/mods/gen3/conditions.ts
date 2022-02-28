export const Conditions: {[k: string]: ModdedConditionData} = {
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			this.effectState.slept = 0;
            this.effectState.sleptTemp = 0;
            this.effectState.minPossible = 2;
			
			// 1-4 turns
			//this.effectState.time = this.random(2, 6, false, 'slp gen3');
			// Turns spent using Sleep Talk/Snore immediately before switching out while asleep
			//this.effectState.skippedTime = 0;
		},
		onSwitchIn(target) {
			if (target.statusState.hasOwnProperty('time')) {
				this.effectState.time += this.effectState.skippedTime;
				this.effectState.skippedTime = 0;
			} else {
				this.effectState.sleptTemp = this.effectState.slept;
			}	
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.statusState.hasOwnProperty('time')) {
				if (pokemon.hasAbility('earlybird')) {
					pokemon.statusState.time--;
				}
				pokemon.statusState.time--;
				if (pokemon.statusState.time <= 0) {
					delete pokemon.statusState.time;
					pokemon.cureStatus();
					return;
				}
				this.add('cant', pokemon, 'slp');
				if (move.sleepUsable) {
					this.effectState.skippedTime++;
					return;
				}
				this.effectState.skippedTime = 0;
				return false;
			} else {
				if (pokemon.hasAbility('earlybird')) {
					pokemon.statusState.sleptTemp += 1;
				}
				pokemon.statusState.sleptTemp += 1;    
				const q = 6 - pokemon.statusState.minPossible;
				let p = 0;
	
				for (let i = pokemon.statusState.minPossible; i < 6; ++i) {
					if (i <= pokemon.statusState.sleptTemp) {
						p += 1;
					}
				}
				const wake = this.randomChance(p, q, true, 'gen 3 sleep');
				if (wake) {
					pokemon.cureStatus();
					return;
				}
				pokemon.statusState.minPossible = Math.min(5, pokemon.statusState.sleptTemp + 1);
				this.add('cant', pokemon, 'slp');
				if (move.sleepUsable) {
					return;
				}
				pokemon.statusState.slept = pokemon.statusState.sleptTemp;
				return false;
			}
		},
	},
	frz: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			// don't count Hidden Power or Weather Ball as Fire-type
			if (this.dex.moves.get(move.id).type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD() {},
	},
};
