import { global, p_on } from './vars.js';
import { vBind, popover, tagEvent, clearElement, adjustCosts } from './functions.js';
import { races } from './races.js';
import { actions, checkCityRequirements, housingLabel, wardenLabel, updateQueueNames, checkAffordable } from './actions.js';
import { govCivics } from './civics.js';
import { crateGovHook } from './resources.js';
import { checkHellRequirements, mechSize, drawMechList, mechCost } from './portal.js';
import { loc } from './locale.js';

export const gmen = {
    soldier: {
        name: loc('governor_soldier'),
        desc: loc('governor_soldier_desc'),
        title: [loc('governor_soldier_t1'),loc('governor_soldier_t2'),loc('governor_soldier_t3')],
        traits: {
            tactician: 1,
            militant: 1
        }
    },
    criminal: {
        name: loc('governor_criminal'),
        desc: loc('governor_criminal_desc'),
        title: [loc('governor_criminal_t1'),loc('governor_criminal_t2'),{ m: loc('governor_criminal_t3m'), f: loc('governor_criminal_t3f') }],
        traits: {
            noquestions: 1,
            racketeer: 1
        }
    },
    entrepreneur: {
        name: loc('governor_entrepreneur'),
        desc: loc('governor_entrepreneur_desc'),
        title: [loc('governor_entrepreneur_t1'),loc('governor_entrepreneur_t2'),{ m: loc('governor_entrepreneur_t3m'), f: loc('governor_entrepreneur_t3f') }],
        traits: {
            dealmaker: 1,
            risktaker: 1
        }
    },
    educator: {
        name: loc('governor_educator'),
        desc: loc('governor_educator_desc'),
        title: [loc('governor_educator_t1'),loc('governor_educator_t2'),loc('governor_educator_t3')],
        traits: {
            teacher: 1,
            theorist: 1
        }
    },
    spiritual: {
        name: loc('governor_spiritual'),
        desc: loc('governor_spiritual_desc'),
        title: [loc('governor_spiritual_t1'),loc('governor_spiritual_t2'),loc('governor_spiritual_t3')],
        traits: {
            inspirational: 1,
            pious: 1
        }
    },
    bluecollar: {
        name: loc('governor_bluecollar'),
        desc: loc('governor_bluecollar_desc'),
        title: [{ m: loc('governor_bluecollar_t1m'), f: loc('governor_bluecollar_t1f') },loc('governor_bluecollar_t2'),{ m: loc('governor_bluecollar_t3m'), f: loc('governor_bluecollar_t3f') }],
        traits: {
            pragmatist: 1,
            dirty_jobs: 1
        }
    },
    noble: {
        name: loc('governor_noble'),
        desc: loc('governor_noble_desc'),
        title: [{ m: loc('governor_noble_t1m'), f: loc('governor_noble_t1f') },{ m: loc('governor_noble_t2m'), f: loc('governor_noble_t2f') },{ m: loc('governor_noble_t3m'), f: loc('governor_noble_t3f') },{ m: loc('governor_noble_t4m'), f: loc('governor_noble_t4f') }],
        traits: {
            extravagant: 1,
            aristocrat: 1
        }
    },
    media: {
        name: loc('governor_media'),
        desc: loc('governor_media_desc'),
        title: [loc('governor_media_t1'),{ m: loc('governor_media_t2m'), f: loc('governor_media_t2f') },loc('governor_media_t3')],
        traits: {
            gaslighter: 1,
            muckraker: 1
        }
    },
    sports: {
        name: loc('governor_sports'),
        desc: loc('governor_sports_desc'),
        title: [loc('governor_sports_t1'),loc('governor_sports_t2'),loc('governor_sports_t3')],
        traits: {
            athleticism: 1,
            nopain: 1
        }
    },
    bureaucrat: {
        name: loc('governor_bureaucrat'),
        desc: loc('governor_bureaucrat_desc'),
        title: [loc('governor_bureaucrat_t1'),{ m: loc('governor_bureaucrat_t2m'), f: loc('governor_bureaucrat_t2f') },loc('governor_bureaucrat_t3')],
        traits: {
            organizer: 1
        }
    }
};

export const gov_traits = {
    tactician: {
        name: loc(`gov_trait_tactician`),
        effect(){ return loc(`gov_trait_tactician_effect`,[$(this)[0].vars[0]]); },
        vars: [5]
    },
    militant: {
        name: loc(`gov_trait_militant`),
        effect(){ return loc(`gov_trait_militant_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [25,10]
    },
    noquestions: {
        name: loc(`gov_trait_noquestions`),
        effect(){ return loc(`gov_trait_noquestions_effect`,[$(this)[0].vars[0]]); },
        vars: [0.005]
    },
    racketeer: {
        name: loc(`gov_trait_racketeer`),
        effect(){ return loc(`gov_trait_racketeer_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [20,35]
    },
    dealmaker: {
        name: loc(`gov_trait_dealmaker`),
        effect(){ return loc(`gov_trait_dealmaker_effect`,[$(this)[0].vars[0]]); },
        vars: [75]
    },
    risktaker: {
        name: loc(`gov_trait_risktaker`),
        effect(){ return loc(`gov_trait_risktaker_effect`,[$(this)[0].vars[0]]); },
        vars: [10]
    },
    teacher: {
        name: loc(`gov_trait_teacher`),
        effect(){ return loc(`gov_trait_teacher_effect`,[$(this)[0].vars[0]]); },
        vars: [5]
    },
    theorist: {
        name: loc(`gov_trait_theorist`),
        effect(){ return loc(`gov_trait_theorist_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [50,4]
    },
    inspirational: {
        name: loc(`gov_trait_inspirational`),
        effect(){ return loc(`gov_trait_inspirational_effect`,[$(this)[0].vars[0]]); },
        vars: [10]
    },
    pious: {
        name: loc(`gov_trait_pious`),
        effect(){
            let val = $(this)[0].vars[1];
            let xeno = global.tech['monument'] && global.tech.monument >= 3 && p_on['s_gate'] ? 3 : 1;
            val = (global.civic.govern.type === 'corpocracy' ? (val * 2) : val) * xeno;
            return loc(`gov_trait_pious_effect`,[$(this)[0].vars[0],val]);
        },
        vars: [10,2]
    },
    pragmatist: {
        name: loc(`gov_trait_pragmatist`),
        effect(){ return loc(`gov_trait_pragmatist_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [50,2]
    },
    dirty_jobs: {
        name: loc(`gov_trait_dirty_jobs`),
        effect(){ return loc(`gov_trait_dirty_jobs_effect`,[$(this)[0].vars[0]]); },
        vars: [0.015]
    },
    extravagant: {
        name: loc(`gov_trait_extravagant`),
        effect(){ return loc(`gov_trait_extravagant_effect`,[$(this)[0].vars[0],housingLabel('large',true),$(this)[0].vars[1],$(this)[0].vars[2]+5]); },
        vars: [10,1.25,1]
    },
    aristocrat: {
        name: loc(`gov_trait_aristocrat`),
        effect(){ return loc(`gov_trait_aristocrat_effect`,[$(this)[0].vars[0],$(this)[0].vars[1],$(this)[0].vars[2]]); },
        vars: [50,10,10]
    },
    gaslighter: {
        name: loc(`gov_trait_gaslighter`),
        effect(){
            return loc(`gov_trait_gaslighter_effect`,[$(this)[0].vars[0],wardenLabel(),$(this)[0].vars[1],$(this)[0].vars[2]]);
        },
        vars: [0.5,0.75,0.5]
    },
    muckraker: {
        name: loc(`gov_trait_muckraker`),
        effect(){
            return loc(`gov_trait_muckraker_effect`,[$(this)[0].vars[1],$(this)[0].vars[2]]);
        },
        vars: [8,10,3]
    },
    athleticism: {
        name: loc(`gov_trait_athleticism`),
        effect(){ return loc(`gov_trait_athleticism_effect`,[$(this)[0].vars[0],$(this)[0].vars[1],$(this)[0].vars[2],wardenLabel()]); },
        vars: [1.5,2,4]
    },
    nopain: {
        name: loc(`gov_trait_nopain`),
        effect(){ return loc(`gov_trait_nopain_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [50,10]
    },
    organizer: {
        name: loc(`gov_trait_organizer`),
        effect(){ return loc(`gov_trait_organizer_effect`,[$(this)[0].vars[0]]); },
        vars: [1]
    }
};

const names = {
    humanoid: ['Sanders','Smith','Geddon','Burgundy','Cristo','Crunch','Berg','Morros','Bower','Maximus'],
    carnivore: ['Instinct','Prowl','Paws','Fluffy','Snarl','Claws','Fang','Stalker','Pounce','Sniff'],
    herbivore: ['Sense','Grazer','Paws','Fluffy','Fern','Claws','Fang','Grass','Stampy','Sniff'],
    omnivore: ['Pelt','Munchy','Paws','Fluffy','Snarl','Claws','Fang','Skavers','Pounce','Sniff'],
    small: ['Bahgins','Banks','Shorty','Parte','Underfoot','Shrimp','Finkle','Littlefoot','Cub','Runt'],
    giant: ['Slender','Titan','Colossus','Bean','Tower','Cloud','Bigfoot','Mountain','Crusher','Megaton'],
    reptilian: ['Scale','Chimera','Ecto','Bask','Forks','Croc','Slither','Sunny','Coldfoot','Webtoe'],
    avian: ['Sparrow','Soar','Shiney','Raven','Squaks','Eddy','Breeze','Flap','Kettle','Flock'],
    insectoid: ['Compound','Centi','Hiver','Buzz','Carpace','Swarm','Devour','Carpi','Chitter','Burrow'],
    plant: ['Grover','Blossom','Leaf','Sapper','Stem','Seed','Sprout','Greensly','Root','Fruit'],
    fungi: ['Detritus','Psychedelic','Cap','Rotface','Patch','Spore','Infecto','Filament','Symbiote','Shade'],
    aquatic: ['Seawolf','Finsley','Inko','Sucker','McBoatFace','Wave','Riptide','Shell','Coral','Pearl'],
    fey: ['Whisper','Prank','Mischief','Flutter','Nature','Dirt','Story','Booker','Tales','Spirit'],
    heat: ['Ash','Magnus','Pumice','Vulcano','Sweat','Flame','Lava','Ember','Smoke','Tinder','Spark'],
    polar: ['Frosty','Snowball','Flake','Chiller','Frost','Cooler','Icecube','Arctic','Tundra','Avalanche'],
    sand: ['Dune','Oasis','Sarlac','Spice','Quick','Grain','Spike','Storm','Glass','Castle'],
    demonic: ['Yekun','Kesabel','Gadreel','Penemue','Abaddon','Azazyel','Leviathan','Samyaza','Kasyade','Typhon'],
    angelic: ['Lightbringer','Illuminous','Sparks','Chrub','Halo','Star','Pompous','Radiant','Fluffy','Fabio']
};

function genGovernor(setSize){
    let governors = [];
    let genus = races[global.race.species].type;
    let backgrounds = Object.keys(gmen);
    let nameList = JSON.parse(JSON.stringify(names[genus]));

    setSize = setSize || backgrounds.length;
    for (let i=0; i<setSize; i++){
        if (nameList.length === 0){
            nameList = JSON.parse(JSON.stringify(names[genus]));
        }
        if (backgrounds.length === 0){
            backgrounds = Object.keys(gmen);
        }

        let bgIdx = Math.floor(Math.seededRandom(0,backgrounds.length));
        let nameIdx = Math.floor(Math.seededRandom(0,nameList.length));

        let bg = backgrounds.splice(bgIdx,1)[0];
        let name = nameList.splice(nameIdx,1)[0];

        let title = gmen[bg].title[Math.floor(Math.seededRandom(0,gmen[bg].title.length))];
        if (typeof title === 'object'){
            title = Math.floor(Math.seededRandom(0,2)) === 0 ? title.m : title.f;
        }
        governors.push({ bg: bg, t: title, n: name });
    }
    
    return governors;
}

export function govern(){
    if (global.genes['governor'] && global.tech['governor'] && global.race['governor'] && global.race.governor['g'] && global.race.governor['tasks']){
        let cnt = [0,1,2];
        if (govActive('organizer',0)){ cnt.push(3); }
        cnt.forEach(function(n){
            if (gov_tasks[global.race.governor.tasks[`t${n}`]] && gov_tasks[global.race.governor.tasks[`t${n}`]].req()){
                gov_tasks[global.race.governor.tasks[`t${n}`]].task()
            }
        });
    }
}

export function defineGovernor(){
    if (global.genes['governor'] && global.tech['governor']){
        clearElement($('#r_govern1'));
        if (global.race.hasOwnProperty('governor') && !global.race.governor.hasOwnProperty('candidates')){
            drawnGovernOffice();
        }
        else {
            appointGovernor();
        }
    }
}

function drawnGovernOffice(){
    let govern = $(`<div id="govOffice" class="govOffice"></div>`);
    $('#r_govern1').append(govern);

    let govHeader = $(`<div class="head"></div>`);
    govern.append(govHeader);

    let govTitle = $(`<div></div>`);
    govTitle.append($(`<div class="has-text-caution">${loc(`governor_office`,[global.race.governor.g.n])}</div>`));
    govTitle.append($(`<div><span class="has-text-warning">${loc(`governor_background`)}:</span> <span class="bg">${gmen[global.race.governor.g.bg].name}</span></div>`));

    govHeader.append(govTitle);
    govHeader.append($(`<div class="fire"><b-button v-on:click="fire" v-html="fireText()">${loc(`governor_fire`)}</b-button></div>`));

    let cnt = [0,1,2];
    if (govActive('organizer',0)){ cnt.push(3); }
    cnt.forEach(function(num){
        let options = `<b-dropdown-item v-on:click="setTask('none',${num})">{{ 'none' | label }}</b-dropdown-item>`;
        Object.keys(gov_tasks).forEach(function(task){
            if (gov_tasks[task].req()){
                options += `<b-dropdown-item v-on:click="setTask('${task}',${num})">{{ '${task}' | label }}</b-dropdown-item>`;
            }
        });

        govern.append(`<div class="govTask"><span>${loc(`gov_task`,[num+1])}</span><b-dropdown hoverable>
            <button class="button is-primary" slot="trigger">
                <span>{{ t.t${num} | label }}</span>
                <i class="fas fa-sort-down"></i>
            </button>
            ${options}
        </b-dropdown></div>`);
    });

    if (!global.race.governor.hasOwnProperty('config')){
        global.race.governor['config'] = {};
    }

    let options = $(`<div class="options"><div>`);
    govern.append(options);

    {
        if (!global.race.governor.config.hasOwnProperty('storage')){
            global.race.governor.config['storage'] = {
                crt: 1000,
                cnt: 1000
            };
        }

        let storeContain = $(`<div class="tConfig" v-show="showTask('storage')"><div class="has-text-warning">${loc(`gov_task_storage`)}</div></div>`);
        options.append(storeContain);
        let storage = $(`<div class="storage"></div>`);
        storeContain.append(storage);

        let crt_mat = global.race['kindling_kindred'] || global.race['smoldering'] ? (global.race['smoldering'] ? 'Chrysotile' : 'Stone') : 'Plywood';
        let cnt_mat = 'Steel';

        storage.append($(`<b-field>${loc(`gov_task_storage_reserve`,[global.resource[crt_mat].name])}<b-numberinput min="0" :max="Number.MAX_SAFE_INTEGER" v-model="c.storage.crt" :controls="false"></b-numberinput></b-field>`));
        storage.append($(`<b-field>${loc(`gov_task_storage_reserve`,[global.resource[cnt_mat].name])}<b-numberinput min="0" :max="Number.MAX_SAFE_INTEGER" v-model="c.storage.cnt" :controls="false"></b-numberinput></b-field>`));
    }

    {
        if (!global.race.governor.config.hasOwnProperty('bal_storage')){
            global.race.governor.config['bal_storage'] = {};
        }
        if (!global.race.governor.config.bal_storage.hasOwnProperty('adv')){
            global.race.governor.config.bal_storage['adv'] = false;
        }

        let storeContain = $(`<div class="tConfig" v-show="showTask('bal_storage')"><div class="hRow"><div class="has-text-warning">${loc(`gov_task_bal_storage`)}</div><div class="chk"><b-checkbox v-model="c.bal_storage.adv">${loc(`advanced`)}</b-checkbox></div></div></div>`);
        options.append(storeContain);
        let storage = $(`<div class="bal_storage"></div>`);
        storeContain.append(storage);

        Object.keys(global.resource).forEach(function(res){
            if (global.resource[res].stackable){
                if (!global.race.governor.config.bal_storage.hasOwnProperty(res)){
                    global.race.governor.config.bal_storage[res] = "2";
                }

                storage.append($(`<div class="ccmOption" :class="bStrEx()" v-show="showStrRes('${res}')"><span>${global.resource[res].name}</span>
                <b-field>
                    <b-radio-button class="b1" v-show="c.bal_storage.adv" v-model="c.bal_storage.${res}" native-value="0" type="is-danger is-light">0x</b-radio-button>
                    <b-radio-button class="b2" v-show="c.bal_storage.adv" v-model="c.bal_storage.${res}" native-value="1" type="is-danger is-light">1/2</b-radio-button>
                    <b-radio-button class="b3" v-model="c.bal_storage.${res}" native-value="2" type="is-danger is-light">1x</b-radio-button>
                    <b-radio-button class="b4" v-model="c.bal_storage.${res}" native-value="4" type="is-danger is-light">2x</b-radio-button>
                    <b-radio-button class="b5" v-model="c.bal_storage.${res}" native-value="6" type="is-danger is-light">3x</b-radio-button>
                    <b-radio-button class="b6" v-show="c.bal_storage.adv" v-model="c.bal_storage.${res}" native-value="8" type="is-danger is-light">4x</b-radio-button>
                </b-field>
                </div>`));
            }
        });
    }

    {
        if (!global.race.governor.config.hasOwnProperty('merc')){
            global.race.governor.config['merc'] = {
                buffer: 1,
                reserve: 100
            };
        }

        let contain = $(`<div class="tConfig" v-show="showTask('merc')"><div class="has-text-warning">${loc(`gov_task_merc`)}</div></div>`);
        options.append(contain);
        let merc = $(`<div class="storage"></div>`);
        contain.append(merc);

        merc.append($(`<b-field>${loc(`gov_task_merc_buffer`)}<b-numberinput min="0" :max="Number.MAX_SAFE_INTEGER" v-model="c.merc.buffer" :controls="false"></b-numberinput></b-field>`));
        merc.append($(`<b-field>${loc(`gov_task_merc_reserve`)}<b-numberinput min="0" :max="100" v-model="c.merc.reserve" :controls="false"></b-numberinput></b-field>`));
    }

    {
        if (!global.race.governor.config.hasOwnProperty('spy')){
            global.race.governor.config['spy'] = {
                reserve: 100
            };
        }

        let contain = $(`<div class="tConfig" v-show="showTask('spy')"><div class="has-text-warning">${loc(`gov_task_spy`)}</div></div>`);
        options.append(contain);
        let spy = $(`<div class="storage"></div>`);
        contain.append(spy);

        spy.append($(`<b-field>${loc(`gov_task_merc_reserve`)}<b-numberinput min="0" :max="100" v-model="c.spy.reserve" :controls="false"></b-numberinput></b-field>`));
    }

    {
        if (!global.race.governor.config.hasOwnProperty('tax')){
            global.race.governor.config['tax'] = {
                min: 20
            };
        }

        let contain = $(`<div class="tConfig" v-show="showTask('tax')"><div class="has-text-warning">${loc(`gov_task_tax`)}</div></div>`);
        options.append(contain);
        let tax = $(`<div class="storage"></div>`);
        contain.append(tax);

        tax.append($(`<b-field>${loc(`gov_task_tax_min`)}<b-numberinput min="0" :max="20" v-model="c.tax.min" :controls="false"></b-numberinput></b-field>`));
    }

    {
        if (!global.race.governor.config.hasOwnProperty('slave')){
            global.race.governor.config['slave'] = {
                reserve: 100
            };
        }

        let contain = $(`<div class="tConfig" v-show="showTask('slave')"><div class="has-text-warning">${loc(`gov_task_slave`)}</div></div>`);
        options.append(contain);
        let slave = $(`<div class="storage"></div>`);
        contain.append(slave);

        slave.append($(`<b-field>${loc(`gov_task_merc_reserve`)}<b-numberinput min="0" :max="100" v-model="c.slave.reserve" :controls="false"></b-numberinput></b-field>`));
    }

    vBind({
        el: '#govOffice',
        data: { 
            t: global.race.governor.tasks,
            c: global.race.governor.config,
            r: global.resource
        },
        methods: {
            setTask(t,n){
                global.race.governor.tasks[`t${n}`] = t;
                tagEvent('govtask',{
                    'task': t
                });
            },
            showTask(t){
                return Object.values(global.race.governor.tasks).includes(t);
            },
            showStrRes(r){
                return global.resource[r].display;
            },
            bStrEx(){
                return global.race.governor.config.bal_storage.adv ? 'm' : '';
            },
            fire(){
                let inc = global.race.governor.hasOwnProperty('f') ? global.race.governor.f : 0;
                let cost = ((10 + inc) ** 2) - 50;
                let affix = global.race.universe === 'antimatter' ? 'anti' : 'count';
                if (global.race.Plasmid[affix] >= cost){
                    global.race.Plasmid[affix] -= cost;
                    global.race.governor['candidates'] = genGovernor(10);
                    if (global.race.governor.hasOwnProperty('f')){
                        global.race.governor.f++;
                    }
                    else {
                        global.race.governor['f'] = 1;
                    }
                    delete global.race.governor.g;
                    delete global.race.governor.tasks;
                    updateQueueNames(false, ['city-amphitheatre', 'city-apartment']);
                    defineGovernor();
                }
            },
            fireText(){
                let inc = global.race.governor.hasOwnProperty('f') ? global.race.governor.f : 0;
                let cost = ((10 + inc) ** 2) - 50;
                return `<div>${loc(`governor_fire`)}</div><div>${cost} ${loc(global.race.universe === 'antimatter' ? `resource_AntiPlasmid_plural_name` : `resource_Plasmid_plural_name`)}</div>`
            }
        },
        filters: {
            label(t){
                return loc(`gov_task_${t}`);
            }
        }
    });

    popover(`govOffice`, function(){
        let desc = '';
        Object.keys(gmen[global.race.governor.g.bg].traits).forEach(function (t){
            desc += (gov_traits[t].hasOwnProperty('effect') ? gov_traits[t].effect() : '') + ' ';
        });
        return desc;
    },
    {
        elm: `#govOffice .bg`,
    });
}

function appointGovernor(){
    let govern = $(`<div id="candidates" class="governor candidates"></div>`);
    $('#r_govern1').append(govern);

    if (!global.race.hasOwnProperty('governor') || !global.race.governor.hasOwnProperty('candidates')){
        global.race['governor'] = {
            candidates: genGovernor(10)
        };
    }

    govern.append($(`<div class="appoint header"><span class="has-text-caution">${loc(`governor_candidate`)}</span><span class="has-text-caution">${loc(`governor_background`)}</span><span></span><div>`));
    for (let i=0; i<global.race.governor.candidates.length; i++){
        let gov = global.race.governor.candidates[i];
        govern.append($(`<div class="appoint ${gov.bg}"><span class="has-text-warning">${gov.t} ${gov.n}</span><span class="bg">${gmen[gov.bg].name}</span><span><button class="button" v-on:click="appoint(${i})">${loc(`governor_appoint`)}</button></span><div>`));
    }

    vBind({
        el: '#candidates',
        data: global.race.governor,
        methods: {
            appoint(gi){
                if (global.genes['governor'] && global.tech['governor']){
                    let gov = global.race.governor.candidates[gi];
                    global.race.governor['g'] = gov;
                    delete global.race.governor.candidates;
                    global.race.governor['tasks'] = {
                        t0: 'none', t1: 'none', t2: 'none', t3: 'none'
                    };
                    updateQueueNames(false, ['city-amphitheatre', 'city-apartment']);
                    defineGovernor();
                    tagEvent('governor',{
                        'appoint': global.race.governor.g.bg
                    });
                }
            }
        }
    });

    global.race.governor.candidates.forEach(function(gov){
        popover(`candidates-${gov.bg}`, function(){
            let desc = '';
            Object.keys(gmen[gov.bg].traits).forEach(function (t){
                desc += (gov_traits[t].hasOwnProperty('effect') ? gov_traits[t].effect() : '') + ' ';
            });
            return desc;
        },
        {
            elm: `#candidates .${gov.bg} .bg`,
        });
    });
}

export function govActive(trait,val){
    if (global.race.hasOwnProperty('governor') && global.race.governor.hasOwnProperty('g')){
        return gmen[global.race.governor.g.bg].traits[trait] ? gov_traits[trait].vars[val] : false;
    }
    return false;
}

export const gov_tasks = {
    tax: { // Dynamic Taxes
        name: loc(`gov_task_tax`),
        req(){
            return global.tech['currency'] && global.tech.currency >= 3 && global.civic.taxes.display ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                let max = govCivics('tax_cap',false);
                if (global.city.morale.current < 100 && global.civic.taxes.tax_rate > (global.civic.govern.type === 'oligarchy' ? 45 : 25)){
                    while (global.city.morale.current < 100 && global.civic.taxes.tax_rate > (global.civic.govern.type === 'oligarchy' ? 45 : 25)){
                        govCivics('adj_tax','sub');
                    }
                }
                else if (global.city.morale.potential > global.city.morale.cap + 1 && global.civic.taxes.tax_rate < max){
                    govCivics('adj_tax','add');
                }
                else if (global.city.morale.current < global.city.morale.cap + 1 && global.civic.taxes.tax_rate > global.race.governor.config.tax.min){
                    govCivics('adj_tax','sub');
                }
            }
        }
    },
    storage: { // Crate/Container Construction
        name: loc(`gov_task_storage`),
        req(){
            return checkCityRequirements('storage_yard') && global.tech['container'] && global.resource.Crates.display ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                if (global.resource.Crates.amount < global.resource.Crates.max){
                    let mat = global.race['kindling_kindred'] || global.race['smoldering'] ? (global.race['smoldering'] ? 'Chrysotile' : 'Stone') : 'Plywood';
                    let cost = global.race['kindling_kindred'] || global.race['smoldering'] ? 200 : 10;
                    let reserve = global.race.governor.config.storage.crt;
                    if (global.resource[mat].amount + cost > reserve){
                        let build = Math.floor((global.resource[mat].amount - reserve) / cost);
                        crateGovHook('crate',build);
                    }
                }
                if (checkCityRequirements('warehouse') && global.resource.Containers.display && global.resource.Containers.amount < global.resource.Containers.max){
                    let cost = 125;
                    let reserve = global.race.governor.config.storage.cnt;
                    if (global.resource.Steel.amount + cost > reserve){
                        let build = Math.floor((global.resource.Steel.amount - reserve) / cost);
                        crateGovHook('container',build);
                    }
                }
            }
        }
    },
    bal_storage: { // Balanced Storage
        name: loc(`gov_task_bal_storage`),
        req(){
            return checkCityRequirements('storage_yard') && global.tech['container'] && global.resource.Crates.display ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                let crates = global.resource.Crates.amount;
                let sCrate = crates;
                let containers = global.resource.Containers.amount;
                let sCon = containers;
                let active = 0;

                let res_list = Object.keys(global.resource).slice().reverse();

                res_list.forEach(function(res){
                    if (global.resource[res].display && global.resource[res].stackable){
                        crates += global.resource[res].crates;
                        containers += global.resource[res].containers;
                        active++;
                    }
                });

                let crateSet = Math.floor(crates / active);
                let containerSet = Math.floor(containers / active);

                let dist = {
                    Food: { m: 0.1, cap: 100 },
                    Coal: { m: 0.25 },
                };

                Object.keys(global.race.governor.config.bal_storage).forEach(function(res){
                    let val = Number(global.race.governor.config.bal_storage[res]);
                    if (res === 'Coal'){
                        dist[res] = { m: 0.125 * val };
                    }
                    else if (res === 'Food'){
                        dist[res] = { m: 0.05 * val, cap: 50 * val };
                    }
                    else if (global.resource[res]){
                        dist[res] = { m: val };
                    }
                });

                Object.keys(dist).forEach(function(r){
                    if (global.resource[r].display){
                        if (dist[r].hasOwnProperty('cap')){
                            active--;
                            {
                                let set = Math.floor(crateSet * dist[r].m);
                                if (dist[r].hasOwnProperty('cap') && set > dist[r].cap){ set = dist[r].cap; }
                                global.resource[r].crates = set;
                                crates -= set;
                            }
                            if (global.resource.Containers.display){
                                let set = Math.floor(containerSet * dist[r].m);
                                if (dist[r].hasOwnProperty('cap') && set > dist[r].cap){ set = dist[r].cap; }
                                global.resource[r].containers = set;
                                containers -= set;
                            }
                        }
                        else {
                            active += dist[r].m - 1;
                        }
                    }
                });
                
                crateSet = active !== 0 ? Math.floor(crates / active) : 0;
                containerSet = active !== 0 ? Math.floor(containers / active): 0;
                crates -= Math.floor(crateSet * active);
                containers -= Math.floor(containerSet * active);

                res_list.forEach(function(res){
                    if (dist[res] && dist[res].hasOwnProperty('cap')){
                        return;
                    }
                    if (global.resource[res].display && global.resource[res].stackable){
                        let multiplier = dist[res] ? dist[res].m : 1;
                        let crtAssign = Math.floor(crateSet > 0 ? crateSet * multiplier : 0);
                        global.resource[res].crates = crtAssign;
                        if (global.resource.Containers.display){
                            let cntAssign = Math.floor(containerSet > 0 ? containerSet * multiplier : 0);
                            global.resource[res].containers = cntAssign;
                        }
                        if (crates > 0 && multiplier >= 1){
                            let adjust = Math.ceil(multiplier / 2);
                            if (crates < adjust){ adjust = crates; }
                            global.resource[res].crates += adjust;
                            crates -= adjust;
                        }
                        if (containers > 0 && multiplier >= 1){
                            let adjust = Math.ceil(multiplier / 2);
                            if (containers < adjust){ adjust = containers; }
                            global.resource[res].containers += adjust;
                            containers -= adjust;
                        }
                    }
                });

                let max = 3;
                while (max > 0 && (crates > 0 || containers > 0)){
                    max--;
                    res_list.forEach(function(res){
                        if (dist[res] && dist[res].hasOwnProperty('cap')){
                            return;
                        }
                        if (global.resource[res].display && global.resource[res].stackable){
                            if (crates > 0){
                                global.resource[res].crates++;
                                crates--;
                            }
                            if (containers > 0){
                                global.resource[res].containers++;
                                containers--;
                            }
                        }
                    });
                }

                global.resource.Crates.amount = crates;
                global.resource.Containers.amount = containers;
                if (active){
                    global.resource.Crates.max -= sCrate;
                    global.resource.Containers.max -= sCon;
                }
            }
        }
    },
    merc: { // Hire Mercs
        name: loc(`gov_task_merc`),
        req(){
            return checkCityRequirements('garrison') && global.tech['mercs'] ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                let cashCap = global.resource.Money.max * (global.race.governor.config.merc.reserve / 100);
                while (global.civic.garrison.max > global.civic.garrison.workers + global.race.governor.config.merc.buffer && global.resource.Money.amount >= govCivics('m_cost') && (global.resource.Money.amount + global.resource.Money.diff >= cashCap || global.resource.Money.diff >= govCivics('m_cost')) ){
                    govCivics('m_buy');
                }
            }
        }
    },
    spy: { // Spy Recruiter
        name: loc(`gov_task_spy`),
        req(){
            return global.tech['spy'] && !global.tech['world_control'] ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                let cashCap = global.resource.Money.max * (global.race.governor.config.spy.reserve / 100);
                for (let i=0; i<3; i++){
                    let cost = govCivics('s_cost',i);
                    if (!global.civic.foreign[`gov${i}`].anx && !global.civic.foreign[`gov${i}`].buy && !global.civic.foreign[`gov${i}`].occ && global.civic.foreign[`gov${i}`].trn === 0 && global.resource.Money.amount >= cost && (global.resource.Money.diff >= cost || global.resource.Money.amount + global.resource.Money.diff >= cashCap)){
                        govCivics('t_spy',i);
                    }
                }
            }
        }
    },
    spyop: { // Spy Operator
        name: loc(`gov_task_spyop`),
        req(){
            return global.tech['spy'] && global.tech.spy >= 2 && !global.tech['world_control'] ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                [0,1,2].forEach(function(gov){
                    if (global.civic.foreign[`gov${gov}`].sab === 0 && global.civic.foreign[`gov${gov}`].spy > 0 && !global.civic.foreign[`gov${gov}`].anx && !global.civic.foreign[`gov${gov}`].buy && !global.civic.foreign[`gov${gov}`].occ){
                        if (global.civic.foreign[`gov${gov}`].mil > 50){
                            govCivics('s_sabotage',gov)
                        }
                        else if (global.civic.foreign[`gov${gov}`].unrest < 100 && global.civic.foreign[`gov${gov}`].spy > 2){
                            govCivics('s_incite',gov)
                        }
                        else if (global.civic.foreign[`gov${gov}`].hstl > 0 && global.civic.foreign[`gov${gov}`].spy > 1){
                            govCivics('s_influence',gov)
                        }
                    }
                });
            }
        }
    },
    slave: { // Replace Slaves
        name: loc(`gov_task_slave`),
        req(){
            return checkCityRequirements('slave_market') && global.race['slaver'] && global.city['slave_pen'] ? true : false;
        },
        task(){
            let cashCap = global.resource.Money.max * (global.race.governor.config.slave.reserve / 100);
            if ( $(this)[0].req() && global.resource.Money.amount >= 25000 && (global.resource.Money.diff >= 25000 || global.resource.Money.amount + global.resource.Money.diff >= cashCap) ){
                let max = global.city.slave_pen.count * 4;
                if (max > global.city.slave_pen.slaves){
                    actions.city.slave_market.action();
                }
            }
        }
    },
    sacrifice: { // Sacrifice Population
        name: loc(`gov_task_sacrifice`),
        req(){
            return checkCityRequirements('s_alter') && global.city.hasOwnProperty('s_alter') && global.city['s_alter'].count >= 1 ? true : false;
        },
        task(){
            if ( $(this)[0].req() && global.resource[global.race.species].amount === global.resource[global.race.species].max ){
                if ((!global.race['kindling_kindred'] && !global.race['smoldering'] && global.city.s_alter.harvest <= 10000) || global.city.s_alter.mind <= 10000 || global.city.s_alter.mine <= 10000 || global.city.s_alter.rage <= 10000 || global.city.s_alter.regen <= 10000){
                    actions.city.s_alter.action();
                }
            }
        }
    },
    horseshoe: { // Forge horseshoes
        name: loc(`gov_task_horseshoe`),
        req(){
            return global.race['hooved'] ? true : false;
        },
        task(){
            let cost = actions.city.horseshoe.cost;
            if ( $(this)[0].req() && checkAffordable(cost)){
                cost = adjustCosts(cost);
                let res = 'Copper';
                let amount = 10;
                Object.keys(cost).forEach(function(r){
                    if (cost[r]() > 0){
                        res = r;
                        amount = cost[r]();
                    }
                });
                if (global.resource[res].amount > amount && (global.resource[res].diff >= amount || global.resource[res].amount + global.resource[res].diff >= global.resource[res].max) ){
                    actions.city.horseshoe.action();
                }
            }
        }
    },
    mech: { // Mech Builder
        name: loc(`gov_task_mech`),
        req(){
            return global.stats.achieve.hasOwnProperty('corrupted') && global.stats.achieve.corrupted.l > 0 && checkHellRequirements('prtl_spire','mechbay') && global.portal.hasOwnProperty('mechbay') ? true : false;
        },
        task(){
            if ( $(this)[0].req() ){
                let ctype = 'large';
                let mCosts = mechCost(ctype,false);
                let cost = mCosts.c;
                let soul = mCosts.s;
                let size = mechSize(ctype);

                let mechs = {
                    type: {}
                };

                ['small','medium','large','titan','collector'].forEach(function(type){
                    mechs.type[type] = 0;
                    mechs[type] = {
                        chassis: {},
                        weapon: {},
                        equip: {}
                    };
                    ['hover','spider','wheel','tread','biped','quad'].forEach(function(chassis){
                        mechs[type].chassis[chassis] = 0;
                    });
                    ['plasma','laser','kinetic','shotgun','missile','flame','sonic','tesla'].map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value).forEach(function(weapon){
                        mechs[type].weapon[weapon] = 0;
                    });
                    ['shields','flare','seals','grapple','sonar','ablative','radiator','infrared','coolant','stabilizer'].forEach(function(equip){
                        mechs[type].equip[equip] = 0;
                    });
                });

                global.portal.mechbay.mechs.forEach(function(mech){
                    mechs.type[mech.size]++;
                    mechs[mech.size].chassis[mech.chassis]++;
                    mech.hardpoint.forEach(function(wep){
                        mechs[mech.size].weapon[wep]++;
                    });
                    mech.equip.forEach(function(equip){
                        mechs[mech.size].equip[equip]++;
                    });
                });

                if ((mechs.type.large >= 6 && mechs.type.small < 12) || (mechs.type.large >= 12 && mechs.type.titan >= 2 && mechs.type.small < 24)){
                    ctype = 'small';
                    mCosts = mechCost(ctype,false);
                    cost = mCosts.c;
                    soul = mCosts.s;
                    size = mechSize(ctype);
                }
                else if (mechs.type.large >= 6 && mechs.type.medium < 12){
                    ctype = 'medium';
                    mCosts = mechCost(ctype,false);
                    cost = mCosts.c;
                    soul = mCosts.s;
                    size = mechSize(ctype);
                }
                else if (mechs.type.large >= 12 && mechs.type.titan < 2){
                    mCosts = mechCost('titan',false);
                    if (mCosts.c <= global.portal.purifier.sup_max){
                        ctype = 'titan';
                        cost = mCosts.c;
                        soul = mCosts.s;
                        size = mechSize(ctype);
                    }
                }

                let avail = global.portal.mechbay.max - global.portal.mechbay.bay;
                if (avail < size && global.blood['prepared'] && global.blood.prepared >= 3){
                    if (global.queue.queue.some(q => ['portal-purifier','portal-port','portal-base_camp','portal-mechbay','portal-waygate'].includes(q.id))){
                        return;
                    }

                    for (let i=0; i<global.portal.mechbay.mechs.length; i++){
                        if (!global.portal.mechbay.mechs[i]['infernal']){
                            let pattern = global.portal.mechbay.mechs[i];
                            ctype = pattern.size;
                            mCosts = mechCost(ctype,true);
                            cost = mCosts.c;
                            soul = mCosts.s;

                            let gems = Math.floor(soul / 2);
                            let supply = global.portal.purifier.supply + Math.floor(cost / 3);
                            if (supply > global.portal.purifier.sup_max){
                                supply = global.portal.purifier.sup_max;
                            }

                            if (supply >= cost && global.resource.Soul_Gem.amount + gems >= soul){
                                global.resource.Soul_Gem.amount += gems;
                                global.resource.Soul_Gem.amount -= soul;
                                global.portal.purifier.supply = supply;
                                global.portal.purifier.supply -= cost;
                                global.portal.mechbay.mechs[i]['infernal'] = true;

                                if (pattern.size === 'small' && pattern.equip.length === 0){
                                    global.portal.mechbay.mechs[i].equip.push('special');
                                }
                                else if ((pattern.size === 'medium' && pattern.equip.length === 1) || (pattern.size === 'large' && pattern.equip.length === 2) || (pattern.size === 'titan' && pattern.equip.length < 5)){
                                    let equip = '???';
                                    Object.keys(mechs[ctype].equip).forEach(function(val){
                                        if (equip === '???' || mechs[ctype].equip[val] < mechs[ctype].equip[equip]){
                                            if (equip !== val){
                                                equip = val;
                                            }
                                        }
                                    });
                                    if (!pattern.equip.includes('special')){
                                        global.portal.mechbay.mechs[i].equip.push('special');
                                    }
                                    else {
                                        global.portal.mechbay.mechs[i].equip.push(equip);
                                    }
                                }
                                drawMechList();
                            }
                            break;
                        }
                    }
                }
                else if (global.portal.purifier.supply >= cost && avail >= size && global.resource.Soul_Gem.amount >= soul){
                    let c_val = 99;
                    let chassis = 'hover';
                    Object.keys(mechs[ctype].chassis).forEach(function(val){
                        if (mechs[ctype].chassis[val] < c_val){
                            c_val = mechs[ctype].chassis[val];
                            chassis = val;
                        }
                    });
                    let weapons = ctype === 'titan' ? ['???','???','???','???'] : ['???','???'];
                    let wCap = ctype === 'titan' ? 4 : 2;
                    for (let i=0; i<wCap; i++){
                        Object.keys(mechs[ctype].weapon).forEach(function(val){
                            if (weapons[i] === '???' || mechs[ctype].weapon[val] < mechs[ctype].weapon[weapons[i]]){
                                if (!weapons.includes(val)){
                                    weapons[i] = val;
                                }
                            }
                        });
                    }
                    let equip = ['???','???','???','???'];
                    for (let i=0; i<4; i++){
                        Object.keys(mechs[ctype].equip).forEach(function(val){
                            if (equip[i] === '???' || mechs[ctype].equip[val] < mechs[ctype].equip[equip[i]]){
                                if (!equip.includes(val)){
                                    equip[i] = val;
                                }
                            }
                        });
                    }

                    let equipment = global.blood['prepared'] ? equip : [equip[0],equip[1]];
                    if (ctype === 'small'){
                        weapons = [weapons[0]];
                        equipment = global.blood['prepared'] ? ['special'] : [];
                    }
                    else if (ctype === 'medium'){
                        weapons = [weapons[0]];
                        equipment = global.blood['prepared'] ? ['special',equip[0]] : ['special'];
                    }
                    else if (ctype === 'large'){
                        equipment = global.blood['prepared'] ? ['special',equip[0],equip[1]] : ['special',equip[0]];
                    }
                    else if (ctype === 'titan'){
                        equipment = global.blood['prepared'] ? ['special',equip[0],equip[1],equip[2],equip[3]] : ['special',equip[0],equip[1],equip[2]];
                    }

                    global.portal.purifier.supply -= cost;
                    global.resource.Soul_Gem.amount -= soul;
                    global.portal.mechbay.mechs.push({
                        chassis: chassis,
                        size: ctype,
                        equip: equipment,
                        hardpoint: weapons,
                        infernal: false
                    });
                    global.portal.mechbay.bay += size;
                    drawMechList();
                }
            }
        }
    },
};