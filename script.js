const form = document.getElementById('songForm');
const container = document.getElementById('songCards');

function getSongs() {
  return JSON.parse(localStorage.getItem('songs') || '[]');
}

function saveSongs(songs) {
  localStorage.setItem('songs', JSON.stringify(songs));
}

function createCard(song, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${song.image}" alt="${song.title}">
    <div class="card-content">
      <h3>${song.title}</h3>
      <p><strong>${song.artist}</strong></p>
      <p>${song.note}</p>
      <div class="actions">
        <a href="${song.spotify}" target="_blank">▶️ Play</a>
        <span class="delete" onclick="deleteSong(${index})">🗑️</span>
      </div>
    </div>
  `;
  return card;
}

function renderSongs() {
  container.innerHTML = '';
  const songs = getSongs();
  songs.forEach((song, index) => {
    container.appendChild(createCard(song, index));
  });
}

function deleteSong(index) {
  const songs = getSongs();
  songs.splice(index, 1);
  saveSongs(songs);
  renderSongs();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const song = {
    title: form.title.value,
    artist: form.artist.value,
    image: form.image.value,
    note: form.note.value,
    spotify: form.spotify.value
  };
  const songs = getSongs();
  songs.push(song);
  saveSongs(songs);
  form.reset();
  renderSongs();
});

// Add 5 mock songs if localStorage is empty
if (getSongs().length === 0) {
  saveSongs([
    {
      title: "Vienna",
      artist: "Billy Joel",
      image: "https://i.scdn.co/image/ab67616d0000b273e0c3c2f6f3e2b6b8f0f3e0c3",
      note: "This song reminds me to slow down and trust the timing of life.",
      spotify: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20"
    },
    {
      title: "Holocene",
      artist: "Bon Iver",
      image: "https://i.scdn.co/image/ab67616d0000b273c8b9c3f6f3e2b6b8f0f3e0c3",
      note: "A reminder of how small and beautiful we are.",
      spotify: "https://open.spotify.com/track/0U0ldCRmgCqhVvD6ksG63j"
    },
    {
      title: "Motion Sickness",
      artist: "Phoebe Bridgers",
      image: "https://i.scdn.co/image/ab67616d0000b273f0f3e0c3c8b9c3f6f3e2b6b8",
      note: "Captures the ache of letting go.",
      spotify: "https://open.spotify.com/track/3ZOEytgrvLwQaqXreDs2Jx"
    },
    {
      title: "Nights",
      artist: "Frank Ocean",
      image: "https://i.scdn.co/image/ab67616d0000b273e0c3c2f6f3e2b6b8f0f3e0c3",
      note: "A song that shifts like memory.",
      spotify: "https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8"
    },
    {
      title: "New Slang",
      artist: "The Shins",
      image: "https://i.scdn.co/image/ab67616d0000b273c8b9c3f6f3e2b6b8f0f3e0c3",
      note: "The soundtrack to a turning point.",
      spotify: "https://open.spotify.com/track/3cHyrEgdyYRjgJKSOiOtcS"
    }
  ]);
}

renderSongs();
