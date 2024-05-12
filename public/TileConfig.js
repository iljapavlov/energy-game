export const TILE_CONFIG = {
    // TERRAIN TILES
    plains: {
        bgColor: colorNameToHex('green'),
    },
    sea: {
        bgColor: colorNameToHex('blue'),
        image: 'water',
        rescale: 0.0325
    },
    forest: {
        bgColor: colorNameToHex('dark-green'),
    }, 
    grass: {
        bgColor: colorNameToHex('green'),
        image: 'grass'
    },

    // POWER CONSUMER TILES
    house: {
        bgColor: colorNameToHex('dark-green'),
        image: 'house',
    },
    houseBattery: {
        bgColor: colorNameToHex('dark-green'),
    },
    houseSolar: {
        bgColor: colorNameToHex('dark-green'),
        image: 'house-solar',
        powerOutput: 10,
    },
    houseSolarBattery: {
        bgColor: colorNameToHex('dark-green'),
    },

    // POWER PRODUCERS
    biomass: {
        bgColor: colorNameToHex('green'),
        powerOutput: 120,
        isRenewable: false
    },
    coal: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 200,
        isRenewable: false,
        image: 'power-plant-on',
        rescale: 0.1
    },
    gas: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 300,
        isRenewable: false
    },
    geothermal: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 300,
        isRenewable: true
    },
    nuclear: {
        bgColor: colorNameToHex('green'),
        powerOutput: 1200,
        isRenewable: true
    },
    solarPanel: {
        bgColor: colorNameToHex('dark-green'),
        image: 'solar-panel',
        powerOutput: 10,
        isRenewable: true,
        rescale: 0.02
    },
    windMill: {
        bgColor: colorNameToHex('dark-green'),
        powerOutput: 10,
        isRenewable: true
    },
    tidal: {
        bgColor: colorNameToHex('blue'),
        isRenewable: true,
        powerOutput: 10
    },
    hydro: {
        bgColor: colorNameToHex('blue'),
        isRenewable: true,
        powerOutput: 12
    },

    // POWER STORAGE
    chemicalBattery: {
        bgColor: colorNameToHex('dark-green'),
        storageCapacity: 200,
        image: 'battery-two-bars',
        rescale: 0.2
    },

    // CONNECTOR
    connector: {
        bgColor: colorNameToHex('dark-green'),
        // image: 'wire-straight',
        // animation: 'wire',
        // rescale: 1.4
    }
}

function colorNameToHex(color) {
    const colorMap = {
        "black": "0x000000",
        "white": "0xFFFFFF",
        "red": "0xFF0000",
        "green": "0x008000",
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