export const TILE_CONFIG = {
    // TERRAIN TILES
    plains: {
        bgColor: colorNameToHex('green'),
        title: 'Plains'
    },
    sea: {
        bgColor: colorNameToHex('blue'),
        bgImage: 'water',
        rescale: 0.0325,
        title: 'Lake'
    },
    forest: {
        image: 'forest',
        rescale: 0.0325,
        bgColor: colorNameToHex('green'),
        title: 'Forest'
    },
    grass: {
        bgColor: colorNameToHex('green'),
        bgImage: 'grass',
        rescale: 0.0325,
        title: 'Grass'
    },
    grassFlowers: {
        bgColor: colorNameToHex('green'),
        bgImage: 'grass-flowers',
        rescale: 0.0325,
        title: 'Flowery Grass'
    },

    // POWER CONSUMER TILES
    house: {
        bgColor: colorNameToHex('green'),
        image: 'house',
        title: 'House',
    },
    houseBattery: {
        bgColor: colorNameToHex('green'),
        image: 'house-battery',
        title: 'House with battery',
    },
    houseSolar: {
        bgColor: colorNameToHex('dark-green'),
        image: 'house-solar',
        powerOutput: 10,
        title: 'House with solar panels',
    },
    houseSolarBattery: {
        bgColor: colorNameToHex('green'),
        image: 'house-solar-battery-empty',
        rescale: 0.033,
        title: 'House with solar panels \nand battery',
    },

    // POWER PRODUCERS
    biomass: {
        bgColor: colorNameToHex('green'),
        powerOutput: 120,
        isRenewable: false,
        title: 'Biomass Power Plant'
    },
    coal: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 200,
        isRenewable: false,
        image: 'power-plant-on',
        rescale: 0.1,
        title: 'Coal Power Plant'
    },
    gas: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 300,
        isRenewable: false,
        title: 'Gas Power Plant'
    },
    geothermal: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 300,
        isRenewable: true,
        title: 'Geothermal Power Plant'
    },
    nuclear: {
        bgColor: colorNameToHex('green'),
        powerOutput: 1200,
        isRenewable: true,
        title: 'Nuclear Power Plant'
    },
    solarPanel: {
        bgColor: colorNameToHex('green'),
        image: 'solar-panel',
        powerOutput: 10,
        isRenewable: true,
        rescale: 0.02,
        title: 'Solar Panels'
    },
    windMill: {
        bgColor: colorNameToHex('green'),
        powerOutput: 10,
        isRenewable: true,
        title: 'Windmill'
    },
    tidal: {
        bgColor: colorNameToHex('blue'),
        isRenewable: true,
        powerOutput: 10,
        title: 'Tidal Power Plant'
    },
    hydro: {
        bgColor: colorNameToHex('blue'),
        isRenewable: true,
        powerOutput: 12,
        title: 'Hydro Power Plant'
    },

    // POWER STORAGE
    chemicalBattery: {
        bgColor: colorNameToHex('green'),
        storageCapacity: 200,
        image: 'battery-two-bars',
        rescale: 0.045,
        title: 'Energy Storage'
    },

    // CONNECTOR
    connector: {
        bgColor: colorNameToHex('green'),
        title: 'Connector',
    }
}

function colorNameToHex(color) {
    const colorMap = {
        "black": "0x000000",
        "white": "0xFFFFFF",
        "red": "0xFF0000",
        // "green": "0x008000",
        "green": "0x8cbd62",
        "blue": "0x0000FF",
        "yellow": "0xFFFF00",
        "pink": "0xFFC0CB",
        "purple": "0x800080",
        "orange": "0xFFA500",
        "grey": "0x808080",
        "brown": "0xA52A2A",
        "cyan": "0x00FFFF",
        "magenta": "0xFF00FF",
        "dark-green":"0x006400",
        "dark-grey":"0xA9A9A9"
    };

    return colorMap[color.toLowerCase()] || null;
}