import { WEATHER_CONFIG } from './weatherConfig.js';

export class WeatherManager {
  static getRandomWeatherTexture() {
    return Object.keys(WEATHER_CONFIG)[Math.floor(Math.random() * Object.keys(WEATHER_CONFIG).length)];
  }

  static setWeather(weatherType) {
    return Object.keys(WEATHER_CONFIG)[weatherType];
  }

  constructor(scene) {
    this.weather = null;

    this.image = scene.add.image(840,110).setInteractive();

    this.setRandomWeather();
  }

  setRandomWeather() {
    const randomWeatherTexture = WeatherManager.getRandomWeatherTexture();

    this.setWeather(randomWeatherTexture);
  }

  setWeather(weather) {
    const config = WEATHER_CONFIG[weather];

    if (!!config) {
        this.weather = weather;

        this.image.setTexture(config.image);

        const rescale = config.rescale || 0.2;
        this.image.setScale(rescale).setDepth(1);
    }
  }
}