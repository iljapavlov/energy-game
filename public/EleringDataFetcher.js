export class EleringDataFetcher {

    constructor() {
        this.productionMap = new Map();
        this.consumptionMap = new Map();
        this.fetchData();
    }

    async fetchData() {
        let start = this.getPreviousMidnight();
        let end = this.getCurrentMidnight();
        let url = `https://dashboard.elering.ee/api/system/with-plan?start=${start}&end=${end}`;

        let response = await fetch(url);
        let data = await response.json();

        this.productionMap = this.getProductionMap(data);
        this.consumptionMap = this.getConsumptionMap(data);
    }

    /**
     * Gets the timestamp for the previous midnight in UTC.
     * @returns {string} The timestamp for the previous midnight in UTC.
     */
    getPreviousMidnight() {
        let date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCDate(date.getUTCDate() - 1);
        return date.toISOString();
    }

    /**
     * Gets the timestamp for the current midnight in UTC.
     * @returns {string} The timestamp for the current midnight in UTC.
     */
    getCurrentMidnight() {
        let date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString();
    }

    getProductionMap(data) {
        let map = new Map();
        if (data.success && data.data && data.data.real) {
            data.data.real.forEach(item => {
                let date = new Date(item.timestamp * 1000);
                let key = date.getUTCHours();
                map.set(key, item.production);
            });
        }
        return map;
    }

    getConsumptionMap(data) {
        let map = new Map();
        if (data.success && data.data && data.data.real) {
            data.data.real.forEach(item => {
                let date = new Date(item.timestamp * 1000);
                let key = date.getUTCHours();
                map.set(key, item.consumption);
            });
        }
        return map;
    }

    getProductionForHour(hour) {
        return this.productionMap.get(hour);
    }

    getConsumptionForHour(hour) {
        return this.consumptionMap.get(hour);
    }

    /**
     * Transforms the Elering API data into a map.
     * @param {Object} data - The data received from the Elering API.
     * @returns {Map} A map with timestamps as keys and data objects as values.
     */
    transformDataToMap(data) {
        let map = new Map();
        if (data.success && data.data && data.data.real) {
            data.data.real.forEach(item => {
                let date = new Date(item.timestamp * 1000);
                let key = date.getUTCHours();
                map.set(key, item);
            });
        }
        return map;
    }
}