const summoners = require('../../server/summoners');
require('regenerator-runtime/runtime')

it('getting champs from summoners', () => {
    expect.assertions(2);

    function checkSummonersResult(data){
        expect(data.length).toEqual(1);
    }

    function checkChampsResult(data){
        expect(data[0].champs.length).toEqual(12);
    }

    //requieres to use stringify because its not the same a js array than a json array
    return summoners.getSummoners(JSON.stringify(["slayermx117"]), 'lan', 11).then(data => {
        checkSummonersResult(data);
        checkChampsResult(data);
    });

});

test('testing sortByPercentageDesc', () => {
    let championA = {winRatio: 50};
    let championB = {winRatio: 60};
    expect(summoners.sortByPercentageDesc(championA, championB)).toEqual(1);
    expect(summoners.sortByPercentageDesc(championB, championA)).toEqual(-1);
    expect(summoners.sortByPercentageDesc(championA, championA)).toEqual(0);
    expect(summoners.sortByPercentageDesc(championB, championB)).toEqual(0);
});
