const powerPrices = [
    70.96,
    66.24,
    55.42,
    45.04,
    41.83,
    47.22,
    44.51,
    17.61,
    4.79,
    1.48,
    -1.23,
    -2.57,
    -4.07,
    -5.09,
    -6.58,
    -5.16,
    -2.09,
    0.24,
    10.41,
    94.1,
    115.4,
    125.02,
    116.45,
    107.98,
]
const minPrice = -10;
const maxPrice = 150;
const normalizedPrices = powerPrices.map(price => 100 - (price - minPrice) / (maxPrice - minPrice) * 100);
const graphPoints = powerPrices.map((price, hour) => `${hour},${160 - (price - minPrice)}`).join(' ');
window.onload = function() {
    const polyline = document.querySelector('.line');
    polyline.setAttribute('points', graphPoints);
}

document.getElementById('toggleGame').addEventListener('click', function() {
    const gameDiv = document.getElementById('game');
    if (gameDiv.style.display === 'none') {
        gameDiv.style.display = 'block';
    } else {
        gameDiv.style.display = 'none';
    }
});