const lolApi = require('../../server/lol-api');

it('Test getting regions', () => {
    expect.assertions(1);
    return lolApi.getRegions().then(data => {
        expect(data).toEqual(lolApi.regions);
    });
});

it('Test getting seasons', () => {
    expect.assertions(1);
    return lolApi.getSeasons().then(data => {
        expect(data).toEqual(lolApi.seasons);
    });
});