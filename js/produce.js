
var gtProduce = {
    bell_pepper: {
        label: "Bell Pepper",
        maturity: 85,
        seedling: 7,
        harvest: 12,
        spacing: 12,
        vertical: false,
        rowsPerBed: 2
    },
    bell_pepper_flavorburst: {
       label: "Flavorburst",
        parent: "bell_pepper"
    },
    bell_pepper_ace: {
       label: "Ace",
        parent: "bell_pepper"
    },
    broccoli: {
        label: "Broccoli",
        maturity: 60,
        seedling: 4,
        harvest: 4,
        spacing: 14,
        vertical: false,
        rowsPerBed: 2
    },
    broccoli_arcadia: {
        label: "Arcadia",
        //maturity: 63,
        parent: "broccoli"
    },
    broccoli_belstar: {
        label: "Belstar",
        //maturity: 66,
        parent: "broccoli"
    },
    brussel_sprouts: {
        label: "Brussel Sprouts",
        maturity: 90,
        seedling: 6,
        harvest: 4,
        spacing: 18,
        vertical: false,
        rowsPerBed: 1
    },
    carrot: {
        label           : "Carrot",
        startType       : 'Direct Sow',
        hardiness       : 'Moderately-Hardy',
        spacing         : 1,
        rowsPerBed      : 2,
        seedDepth       : 0.125,
        yield           : 90,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 12,
        plantInside     : 0,
        plantOutside    : -2,
        maturity        : 75,
        harvest         : 16,
        vertical        : false
    },
    cucumber: {
        label: "Cucumber",
        startType       : 'Seedling',
        hardiness       : 'Frost-Intolerant',
        spacing         : 9,
        rowsPerBed      : 1,
        seedDepth       : 0.5,
        yield           : 410,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 84,
        plantInside     : -1,
        plantOutside    : 2,
        maturity        : 60,
        harvest         : 4,
        vertical        : true
    },
    cucumber_diva: {
        label: "Diva",
        //maturity: 60,
        parent: "cucumber"
    },
    lettuce: {
        label           : "Lettuce",
        startType       : 'Either',
        hardiness       : 'Hardy',
        spacing         : 12,
        rowsPerBed      : 2,
        seedDepth       : 0.125,
        yield           : 112,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 12,
        plantInside     : -7,
        plantOutside    : -4,
        maturity        : 55,
        harvest         : 6,
        vertical        : false
    },
    melon: {
        label           : 'Melon',
        startType       : 'Either',
        hardiness       : 'Frost-Intolerant',
        spacing         : 9,
        rowsPerBed      : 1,
        seedDepth       : 0.25,
        yield           : 246,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 84,
        plantInside     : -1,
        plantOutside    : 2,
        maturity        : 85,
        harvest         : 8,
        vertical        : true
    },
    melon_earlichamp: {
        label: "Earlichamp Cantalope",
        maturity: 72,
        parent: "melon"
    },
    melon_diplomat: {
        label: "Diplomat Galia",
        maturity: 70,
        parent: "melon"
    },
    melon_serenade: {
        label: "Serenade Butterscotch",
        maturity: 80,
        parent: "melon"
    },
    melon_sapomiel: {
        label: "Sapomiel Piel Del Sapo",
        maturity: 80,
        parent: "melon"
    },
    potato: {
        label: "Potatos",
        maturity: 65,
        seedling: 4,
        harvest: 8,
        spacing: 8,
        vertical: false,
        rowsPerBed: 2
    },
    potato_yukon_gold: {
        label: "Yukon Gold",
        maturity: 80,
        parent: "potato"
    },
    potato_kennebec: {
        label: "Kennebec",
        maturity: 100,
        parent: "potato"
    },
    pumpkin: {
        label: "Pumpkin",
        maturity: 100,
        seedling: 3,
        harvest: 4,
        spacing: 24,
        vertical: false,
        rowsPer: 1
    },
    spinach: {
        label           : "Spinach",
        startType       : 'Either',
        hardiness       : 'Hardy',
        spacing         : 6,
        rowsPerBed      : 2,
        seedDepth       : .25,
        yield           : 46,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 8,
        plantInside     : -7,
        plantOutside    : -4,
        maturity        : 45,
        harvest         : 4,
        vertical        : false
    },
    sweet_potato: {
        label           : "Sweet Potato",
        startType       : 'Slip',
        hardiness       : 'Frost-Intolerant',
        spacing         : 12,
        rowsPerBed      : 2,
        seedDepth       : 3,
        yield           : 600,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 12,
        plantInside     : -2,
        plantOutside    : 6,
        maturity        : 120,
        harvest         : 1,
        vertical        : false
    },
    squash: {
        label: "Squash",
        startType       : 'either',
        hardiness       : 'Frost-Intolerant',
        spacing         : 9,
        rowsPerBed      : 1,
        seedDepth       : 0.5,
        yield           : 154,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 84,
        plantInside     : -1,
        plantOutside    : 2,
        maturity        : 90,
        harvest         : 14,
        vertical        : true
    },
    squash_butternut: {
        label: "Waltham Butternut",
        //maturity: 105,
        parent: "squash"
    },
    squash_butternut_butterscotch: {
        label: "Butterscotch PMR",
        //maturity: 100,
        parent: "squash"
    },
    squash_acorn_honeybear: {
        label: "Honey Bear",
        //maturity: 85,
        parent: "squash"
    },
    swiss_chard: {
        label: "Swiss Chard",
        maturity: 50,
        seedling: 4,
        harvest: 20,
        spacing: 12,
        vertical: false,
        rowsPer: 2
    },
    tomato: {
        label           : "Tomato",
        startType       : 'Either',
        hardiness       : 'Frost-Sensitive',
        spacing         : 24,
        rowsPerBed      : 1,
        seedDepth       : 0.25,
        yield           : 615,
        yieldType       : 'lbs',
        //numPlants       : 41,
        plantHeight     : 84,
        plantInside     : -8,
        plantOutside    : 0,
        maturity        : 90,
        harvest         : 16,
        vertical        : true
    },
    tomato_big_beef: {
        label: "Big Beef",
        //maturity: 70,
        parent: "tomato"
    },
    tomato_sun_gold: {
        label: "Sun Gold",
        //maturity: 57,
        parent: "tomato"
    },
    tomato_black_cherry: {
        label: "Black Cherry",
        //maturity: 64,
        parent: "tomato"
    },
    tomato_matts_wild_cherry: {
        label: "Matts Wild Cherry",
        //maturity: 60,
        parent: "tomato"
    },
    tomato_supersweet_100: {
        label: "Supersweet 100",
        //maturity: 60,
        parent: "tomato"
    }
};