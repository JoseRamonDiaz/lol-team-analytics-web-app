const summoners = require('../server/summoners');
require('regenerator-runtime/runtime')

it('getting champs from summoners', () => {
    expect.assertions(2);
    //requieres to use stringify because its not the same a js array than a json array
    return summoners.getSummoners(JSON.stringify(["slayermx117"]), 'lan', 11).then(data => {
        checkSummonersResult(data);
        checkChampsResult(data);
    });
});

function checkSummonersResult(data){
    expect(data.length).toEqual(1);
}

function checkChampsResult(data){
    expect(data[0].champs.length).toEqual(12);
}