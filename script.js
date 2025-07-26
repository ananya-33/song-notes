
let songs = JSON.parse(localStorage.getItem('songs') || '[]');

function renderSongs() {
  const container = document.getElementById('card-container');
  container.innerHTML = '';
  songs.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${song.image || ''}" alt="Album Art" />
      <h3>${song.title}</h3>
      <p><strong>${song.artist}</strong></p>
      <p>${song.note || ''}</p>
      <div class="actions">
        <a href="${song.url}" target="_blank">▶️ Play</a>
        <button onclick="editSong(${index})">✏️</button>
        <button onclick="deleteSong(${index})">🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function addSong() {
  const title = document.getElementById('song-title').value;
  const artist = document.getElementById('song-artist').value;
  const note = document.getElementById('song-note').value;
  const url = document.getElementById('song-url').value;
  const imageInput = document.getElementById('song-image');
  const reader = new FileReader();
  reader.onload = function(e) {
    const image = e.target.result;
    songs.push({ title, artist, note, url, image });
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
    closeModal('song-modal');
  };
  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    songs.push({ title, artist, note, url, image: '' });
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
    closeModal('song-modal');
  }
}

function deleteSong(index) {
  songs.splice(index, 1);
  localStorage.setItem('songs', JSON.stringify(songs));
  renderSongs();
}

function editSong(index) {
  const song = songs[index];
  document.getElementById('song-title').value = song.title;
  document.getElementById('song-artist').value = song.artist;
  document.getElementById('song-note').value = song.note;
  document.getElementById('song-url').value = song.url;
  openModal('song-modal');
  deleteSong(index);
}

function handleCSV() {
  const file = document.getElementById('csv-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n');
    const headers = lines[0].split(',');
    const songIndex = headers.indexOf('Song');
    const artistIndex = headers.indexOf('Artist');
    const idIndex = headers.indexOf('Spotify Track Id');
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length > Math.max(songIndex, artistIndex, idIndex)) {
        const title = row[songIndex].replace(/^"|"$/g, '');
        const artist = row[artistIndex].replace(/^"|"$/g, '');
        const id = row[idIndex].replace(/^"|"$/g, '');
        const url = 'https://open.spotify.com/track/' + id;
        songs.push({ title, artist, note: '', url, image: '' });
      }
    }
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
    closeModal('bulk-modal');
  };
  reader.readAsText(file);
}

if (songs.length === 0) {
  songs = [
    { title: 'Vienna', artist: 'Billy Joel', note: 'Reminds me to slow down.', url: 'https://open.spotify.com/track/3FCto7hnn1shUyZL42YgfO', image: '' },
    { title: 'Holocene', artist: 'Bon Iver', note: 'A moment of clarity.', url: 'https://open.spotify.com/track/0U0ldCRmgCqhVvD6ksG63j', image: '' },
    { title: 'Motion Sickness', artist: 'Phoebe Bridgers', note: 'Bittersweet and raw.', url: 'https://open.spotify.com/track/3ZOEytgrvLwQaqXreDs2Jx', image: '' },
    { title: 'Nights', artist: 'Frank Ocean', note: 'Two moods in one song.', url: 'https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8', image: '' }
  ];
  localStorage.setItem('songs', JSON.stringify(songs));
}


document.getElementById('view-only-toggle').addEventListener('change', function () {
  const isViewOnly = this.checked;
  const buttons = document.querySelectorAll('.edit-button, .delete-button, .add-button, .bulk-add-button');
  buttons.forEach(button => {
    button.style.display = isViewOnly ? 'none' : 'inline-block';
  });
});

// Function to update last added song info
function updateLastAdded(songName, date) {
  document.getElementById('last-song-name').textContent = songName;
  document.getElementById('last-added-date').textContent = date;
}


renderSongs();
