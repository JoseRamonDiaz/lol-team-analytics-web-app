var gg = new (require('@slayermx/lol/client'));
let region = 'lan';
let season = 11;

async function getSummoners(summoners, passedRegion, passedSeason) {
    region = passedRegion;
    season = passedSeason;
    let teamSummoners = JSON.parse(summoners);
    let summonersObjectArray = [];

    await updateSummoners(teamSummoners);

    for (var i = 0; i < teamSummoners.length; i++) {
        let objectSummoner = { name: '', champs: [] };
        objectSummoner.name = teamSummoners[i];
        let champs = await getChamps(region, teamSummoners[i]);
        objectSummoner.champs = champs;
        summonersObjectArray.push(objectSummoner);
    }

    return summonersObjectArray;
}

async function updateSummoners(teamSummoners) {

    return new Promise((resolve, reject) => {

        for (var i = 0; i < teamSummoners.length; i++) {
            gg.Summary(region, teamSummoners[i]).then((resp) => {
                gg.Renew(region, resp.summonerId).then((resp2) => {
                    resolve(resp2);
                });
            });
        }
    });
}

async function getChamps(region, summonerName) {
    return await gg.Champions(region, summonerName, season)
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

    for (var element = 0; element < champions.length; element++) {
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
    getSummoners,
    sortByPercentageDesc,
    getUsefulStats
}