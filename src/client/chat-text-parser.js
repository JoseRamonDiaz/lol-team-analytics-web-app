var chatJoinText = " se unió a la sala";

function getSummoners(chatTextParam, ownSummonerNameParam) {
    var chatText = chatTextParam || '';
    var ownSummonerName = ownSummonerNameParam || '';
    var summonersNamesArray = [];
    var lines = chatText.split(/\r*\n/);

    for (var i = 0; i < lines.length; i++) {
        if (isRoomJoinText(lines[i])) {
            var summonerName = getSummonerName(lines[i]);
            if(summonerName.toLowerCase() != ownSummonerName.toLowerCase()){
                summonersNamesArray.push(summonerName);
            }
        }
    }

    return summonersNamesArray;
}

function getSummonerName(line) {
    var line = line || '';
    var summonerName;
    var summonerName = '';
    if(isRoomJoinText(line)){
        summonerName = line.replace(chatJoinText, '') || '';
    }
    return summonerName;
}

function isRoomJoinText(lineParam) {
    var line = lineParam || '';
    if (line.indexOf(chatJoinText) > -1) {
        return true;
    }
    return false;
}

module.exports = {
    getSummoners,
    getSummonerName,
    isRoomJoinText
}