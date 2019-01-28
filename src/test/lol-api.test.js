const lolApi = require('../server/lol-api');

it('Test getting regions', () => {
    expect.assertions(1);
    return lolApi.getRegions().then(data => {
        console.log(data);
        expect(data).toEqual(['lan', 'na']);
    });
});
