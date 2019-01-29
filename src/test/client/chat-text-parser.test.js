const chatTextParser = require('../../client/chat-text-parser');

test('testing parser isRoomJoinText', () => { 
    expect(chatTextParser.isRoomJoinText('slayer se unió a la sal!')).toEqual(false);
    expect(chatTextParser.isRoomJoinText('slayer se unió a la sala')).toEqual(true);
    expect(chatTextParser.isRoomJoinText(null)).toEqual(false);
});

test('testing parser getSummonerName', () => {
    expect(chatTextParser.getSummonerName('slayer se unió a la sala')).toEqual('slayer');
    expect(chatTextParser.getSummonerName('slayer se unió a la sal')).toEqual('');
    expect(chatTextParser.getSummonerName(null)).toEqual('');
})

test('testing parser getSummoners', () => {
    expect(chatTextParser.getSummoners('slayermx se unió a la sala', 'slayer')).toEqual(['slayermx']);
    expect(chatTextParser.getSummoners('slayermx se unió a la sala\r\nslayer se unió a la sala', 'slayer')).toEqual(['slayermx']);
    expect(chatTextParser.getSummoners(null)).toEqual([]);
    expect(chatTextParser.getSummoners('slayermx se unió a la sal', 'slayer')).toEqual([]);
    expect(chatTextParser.getSummoners('slayermx se unió a la sala', null)).toEqual(['slayermx']);
    expect(chatTextParser.getSummoners('slayermx se unió a la sal', null)).toEqual([]);
});