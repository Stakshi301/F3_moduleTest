const table = document.querySelector('.table');
const tbody = document.querySelector('.tbody');
const input = document.querySelector('#search-input');
const percentageButton = document.querySelector('#percSort');
const market_cap = document.querySelector('#marketSort');

let coinData = [];

const API = async () => {
    try {
        const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
        const response = await fetch(URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

const renderTable = (data) => {
    tbody.innerHTML = '';
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No Results Found</td></tr>`;
        return;
    }
    data.forEach((coin) => {
        const percentageColor = coin.market_cap_change_percentage_24h < 0 ? 'red' : 'green';
        const row = `
            <tr>
                <td><img src="${coin.image}" alt="${coin.name}" width="30"></td>
                <td class="name">${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price.toLocaleString()}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td style="color:${percentageColor};">${coin.market_cap_change_percentage_24h?.toFixed(2) || 0}%</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
};

const filterTable = () => {
    const searchTerm = input.value.toLowerCase();
    const filteredData = coinData.filter(
        (coin) =>
            coin.name.toLowerCase().includes(searchTerm) ||
            coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
};

const sortByPercentage = () => {
    coinData.sort((a, b) => b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h);
    renderTable(coinData);
};

const sortByMarketCap = () => {
    coinData.sort((a, b) => b.market_cap - a.market_cap);
    renderTable(coinData);
};

const initializeTable = async () => {
    coinData = await API();
    renderTable(coinData);
};

input.addEventListener('input', filterTable);
percentageButton.addEventListener('click', sortByPercentage);
market_cap.addEventListener('click', sortByMarketCap);
initializeTable();
