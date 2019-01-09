'use strict'
const chatJoinText = " se unió a la sala";

async function getMySummonerName(){
    return new Promise(
        (resolve, reject) => {
            
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream('my-user')
            });
    
            lineReader.on('line', function(line){
                resolve(line.trim());
            });
        }
    );
}

async function getSNFromChat(mySummonerName){
    let snArray = [];
    return new Promise(
        (resolve, reject) => {
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream('team')
                });
                
            lineReader.on('line', function (line) {
            //we need only the room joined text, because it give us the secure that it contains a summoner name
            //some users write on chat before all users join so we need to filter it
            
            if(isRoomJoinText(line)){
                let summonerName = getSummonerName(line);
                if(mySummonerName.toLowerCase() != summonerName.toLowerCase()){
                    snArray.push(summonerName);
                }
            }
            resolve(snArray);
            });
        }
    );   
}

function isRoomJoinText(line){
    if(line.indexOf(chatJoinText) > -1){
        return true;
    }
    return false;
}

function getSummonerName(line){
    return line.replace(chatJoinText, '');
}

async function startToGeTeamSummoners(){
    return new Promise(
        async(resolve, reject)=>{
            let mySummonerName = await getMySummonerName();
            let summonersArray = await getSNFromChat(mySummonerName);
            resolve(summonersArray);
        }
    );
}

module.exports = {
    startToGeTeamSummoners    
}