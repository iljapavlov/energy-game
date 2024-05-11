export const TILE_CONFIG = {
    // TERRAIN TILES
    plains: {
        bgColor: colorNameToHex('green'),
    },
    sea: {
        bgColor: colorNameToHex('blue'),
        image: 'water',
        rescale: 0.03
    },
    forest: {
        bgColor: colorNameToHex('dark-green'),
    }, 
    grass: {
        bgColor: colorNameToHex('green'),
    },
    mountain: {
        bgColor: colorNameToHex('dark-grey'),
    },

    // POWER CONSUMER TILES
    house: {
        bgColor: colorNameToHex('dark-green'),
        image: 'house'
    },
    houseBattery: {
        bgColor: colorNameToHex('dark-green'),
        image: 'houseBattery',
    },
    houseSolar: {
        bgColor: colorNameToHex('dark-green'),
        image: 'house-solar'
    },
    houseSolarBattery: {
        bgColor: colorNameToHex('dark-green'),
    },

    // POWER PRODUCERS
    coal: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 200,
        isRenewable: false
    },
    gas: {
        bgColor: colorNameToHex('dark-grey'),
        powerOutput: 300,
        isRenewable: false
    },
    solarPanel: {
        bgColor: colorNameToHex('dark-green'),
        image: 'solar-panel.png',
        powerOutput: 10,
        isRenewable: true
    },
    windMill: {
        bgColor: colorNameToHex('dark-green'),
        image: 'windMill',
        powerOutput: 10,
        isRenewable: true
    },

    // POWER STORAGE
    chemicalBattery: {
        bgColor: colorNameToHex('cyan'),
        storageCapacity: 200,
    },
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