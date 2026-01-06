import './style.css'

const URL = "https://mhw-db.com/monsters";

let monsters = []; // Store the full list of monsters

async function getData(URL) {
  try {
    const response = await fetch(URL);
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json(); //makes the data into JSON object we can use
      console.log(data);
      monsters = data; // Store the data
      populateLocations(data);
      displayMonsters(data);
    }
  } catch (error) {
    console.log(error);
    console.log("no bueno");
  }
}
getData(URL);

function displayMonsters(monsters) {
  const container = document.getElementById('monsters');
  container.innerHTML = ''; // Clear any existing content

  monsters.forEach(monster => {
    const card = document.createElement('div');
    card.className = 'monster-card';

    let html = `
      <h3>${monster.name}</h3>
      <p><strong>Size:</strong> ${monster.type}</p>
      <p><strong>Type:</strong> ${monster.species}</p>
      <p><strong>Locations:</strong> ${monster.locations ? monster.locations.map(loc => loc.name).join(', ') : 'None'}</p>
      <p><strong>Weaknesses:</strong> ${monster.weaknesses ? monster.weaknesses.map(weak => weak.element).join(', ') : 'None'}</p>
    `;

    if (monster.rewards && monster.rewards.length > 0) {
      html += `<p><strong>Drops:</strong> ${monster.rewards.map(reward => reward.item.name).join(', ')}</p>`;
    }

    html += `<p>${monster.description}</p>`;

    card.innerHTML = html;

    container.appendChild(card);
  });
}

function populateLocations(monsters) {
  const locationSelect = document.getElementById('Locations');
  const locations = new Set();

  monsters.forEach(monster => {
    if (monster.locations) {
      monster.locations.forEach(loc => {
        locations.add(loc.name);
      });
    }
  });

  // Clear existing options except the first one
  locationSelect.innerHTML = '<option value="">All Locations</option>';

  // Add unique locations
  Array.from(locations).sort().forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });
}

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedWeakness = document.getElementById('Weaknesses').value;
  const selectedType = document.getElementById('Types').value;
  const selectedLocation = document.getElementById('Locations').value;
  let filtered = monsters;
  if (searchTerm) {
    filtered = filtered.filter(monster => monster.name.toLowerCase().includes(searchTerm));
  }
  if (selectedWeakness) {
    filtered = filtered.filter(monster => monster.weaknesses && monster.weaknesses.some(weak => weak.element === selectedWeakness));
  }
  if (selectedType) {
    filtered = filtered.filter(monster => monster.species === selectedType);
  }
  if (selectedLocation) {
    filtered = filtered.filter(monster => monster.locations && monster.locations.some(loc => loc.name === selectedLocation));
  }
  displayMonsters(filtered);
}

// Add event listeners
document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('Weaknesses').addEventListener('change', applyFilters);
document.getElementById('Types').addEventListener('change', applyFilters);
document.getElementById('Locations').addEventListener('change', applyFilters);
