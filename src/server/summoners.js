const cTable = require('console.table');
var gg = new (require('op.gg-api/client'));
let region = 'lan';

async function getSummoners(summoners) {
    let teamSummoners = JSON.parse(summoners);
    let summonersObjectArray = [];

    await updateSummoners(teamSummoners);

    for (sum in teamSummoners) {
        let objectSummoner = { name: '', champs: [] };
        objectSummoner.name = teamSummoners[sum];
        let champs = await getChamps(region, teamSummoners[sum]);
        objectSummoner.champs = champs;
        summonersObjectArray.push(objectSummoner);
    }

    return summonersObjectArray;
}

async function updateSummoners(teamSummoners) {
    
    return new Promise((resolve, reject) => {

        for (summoner in teamSummoners) {
            gg.Summary(region, teamSummoners[summoner]).then((resp) => {
                gg.Renew(region, resp.summonerId).then((resp2) => {
                    resolve(resp2);
                });
            });
        }
    });
}

async function getChamps(region, summonerName) {
    return await gg.Champions(region, summonerName, 11)
        .then((champions) => {
            champions.sort(sortByPercentageDesc);
            let usefulChampStats = getUsefulStats(champions);
            return usefulChampStats;
        })
        .catch((error) => {
            console.log(error);
        });
}

function getUsefulStats(champions) {

    let usefulChampStats = new Array();

    for (element in champions) {
        usefulChampStats.push({ name: champions[element].name, wins: champions[element].wins || 0, losses: champions[element].losses || 0, winRatio: champions[element].winRatio + '%' });
    }

    return usefulChampStats;
}

function sortByPercentageDesc(championA, championB) {

    //a > b
    if (championA.winRatio > championB.winRatio) {
        return -1;
    }

    // a < b
    if (championA.winRatio < championB.winRatio) {
        return 1;
    }

    //a == b
    return 0;
}

module.exports = {
    getSummoners
}