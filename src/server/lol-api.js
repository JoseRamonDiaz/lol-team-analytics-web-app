const regions = ['lan', 'na'];
const seasons = ['1', '2', '3', '4', '5', '6', '7', '11', '12'];

function getRegions(){
    return new Promise((resolve, reject) => {
        resolve(regions);
    });
}

function getSeasons(){
    return new Promise((resolve, reject) => {
        resolve(seasons);
    });
}

module.exports = {
    getRegions, 
    getSeasons
}