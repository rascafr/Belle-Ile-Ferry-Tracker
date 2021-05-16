const fetch = require('node-fetch');
const schedule = require('node-schedule');
const crypto = require('crypto');
const TelegramBot = require('./lib/telegramBot');
const END_URL = 'https://www.compagnie-oceane.fr/e-boutique-rest/web/ListeCroisieres?';
const SCHEDULE_CONF = '* * * * *';
const { version } = require('./package.json');

const [ DATE_TRIP_SEARCH, PORT_FROM, PORT_TO ] = process.argv.slice(2);

const paramsSearch = {
    DateCroisiere: DATE_TRIP_SEARCH,
    idPortDepart: PORT_FROM,
    idPortArrivee: PORT_TO,
    codeOrigine: 101
}
const strSearch = Object.keys(paramsSearch).map(k => `${k}=${paramsSearch[k]}`).join('&');

if (process.argv.length < 5) {
    console.error('Usage: node service.js <timestamp_start> <port_id_from> <port_id_to>');
    process.exit(-1);
}

let lastHash = null; // flag diff checker

schedule.scheduleJob(SCHEDULE_CONF, async () => {
    const boatTrips = await getBoats();
    const sign = md5(JSON.stringify(boatTrips));
    if (lastHash !== sign) {
        console.log('Found difference:', lastHash, sign, ', checking seats...');
        const dispo = filterAvailablePassengerTrips(boatTrips);
        if (dispo.length > 0) {
            const msg = dispo.map(d => tripToString(d)).join('\n');
            TelegramBot.notifyMe(`🛳️ 🙋‍♂️ Yooo. ${dispo.length} trip(s) have some seats availables!\n\n${msg}`);
        }
        lastHash = sign;
    } else {
        console.log('No diff hash:', lastHash, sign);
    }
});

(async () => {
    await TelegramBot.notifyMe(`⛴️ FerryTracker ${version} ⛴️ Bot has started! Looking for available seats...`)
})();

async function getBoats() {
    let trips = [];
    try {
        const resp = await fetch(`${END_URL}${strSearch}`).then(res => res.json());
        trips = resp.Response.ListeCroisieres || [];
    } catch(e) {
        // N/U
    }
    return trips;
}

function filterAvailablePassengerTrips(trips) {
    // P = passenger
    // V = car / vehicule
    // B = bike
    return trips.filter(t => parseInt(t.listeplacesDispo[0].P, 10) > 0);
}

function tripToString(trip) {
    const {
        jourCroisiereFr, heureCroisiereFr, nomNavire,
        libellePortDepart, libellePortArrivee, listeplacesDispo
    } = trip;
    return `📅 ${jourCroisiereFr} ${heureCroisiereFr} ⛴️  ${nomNavire} ${libellePortDepart} ➡️ ${libellePortArrivee} 💺 ${listeplacesDispo[0].P}`;
}

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
