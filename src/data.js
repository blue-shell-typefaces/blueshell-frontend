export const fonts = [{
    name: 'Gates',
    slug: 'gates',
    stylePrice: 70.00,
    familyPrice: 300.00,
    axes: {
        wght: {
            min: 0,
            max: 1000,
            origin: 400,
            markers: {
                0: 'Light',
                400: 'Regular',
                600: 'Bold',
                1000: 'Black',
            },
        },
    },
    presets: [{
        name: 'Light',
        values: {
            wdth: 0,
        },
        group: null,
    }, {
        name: 'Regular',
        values: {
            wdth: 400,
        },
        group: null,
    }, {
        name: 'Bold',
        values: {
            wdth: 600,
        },
        group: null,
    }, {
        name: 'Black',
        values: {
            wdth: 1000,
        },
        group: null,
    }],
    groups: {}, // todo
}, {
    name: 'Zaum',
    slug: 'zaum',
    stylePrice: 70.00,
    familyPrice: 300.00,
}]