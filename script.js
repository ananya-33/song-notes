document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const addBtn = document.getElementById('addSongBtn');
  const bulkBtn = document.getElementById('bulkAddBtn');
  const bulkInput = document.getElementById('bulkFileInput');
  const closeBtn = document.querySelector('.close');
  const form = document.getElementById('songForm');
  const container = document.getElementById('cardContainer');

  let songs = JSON.parse(localStorage.getItem('songs') || '[]');

  function renderCards() {
    container.innerHTML = '';
    songs.forEach((song, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      if (song.image) {
        const img = document.createElement('img');
        img.src = song.image;
        card.appendChild(img);
      }

      card.innerHTML += `
        <strong>${song.title}</strong><br>
        <em>${song.artist}</em><br>
        <p>${song.note}</p>
        <a href="${song.spotify}" target="_blank">Play</a>
        <button class="delete-btn" onclick="deleteSong(${index})">🗑️</button>
        <button class="edit-btn" onclick="editSong(${index})">✏️</button>
      `;
      container.appendChild(card);
    });
  }

  window.deleteSong = (index) => {
    songs.splice(index, 1);
    localStorage.setItem('songs', JSON.stringify(songs));
    renderCards();
  };

  window.editSong = (index) => {
    const song = songs[index];
    form.title.value = song.title;
    form.artist.value = song.artist;
    form.note.value = song.note;
    form.spotify.value = song.spotify;
    modal.style.display = 'block';
    form.onsubmit = (e) => {
      e.preventDefault();
      song.title = form.title.value;
      song.artist = form.artist.value;
      song.note = form.note.value;
      song.spotify = form.spotify.value;
      const file = form.image.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          song.image = reader.result;
          localStorage.setItem('songs', JSON.stringify(songs));
          renderCards();
          modal.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        localStorage.setItem('songs', JSON.stringify(songs));
        renderCards();
        modal.style.display = 'none';
      }
    };
  };

  addBtn.onclick = () => {
    form.reset();
    modal.style.display = 'block';
    form.onsubmit = (e) => {
      e.preventDefault();
      const newSong = {
        title: form.title.value,
        artist: form.artist.value,
        note: form.note.value,
        spotify: form.spotify.value,
        image: null
      };
      const file = form.image.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          newSong.image = reader.result;
          songs.push(newSong);
          localStorage.setItem('songs', JSON.stringify(songs));
          renderCards();
          modal.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        songs.push(newSong);
        localStorage.setItem('songs', JSON.stringify(songs));
        renderCards();
        modal.style.display = 'none';
      }
    };
  };

  bulkBtn.onclick = () => bulkInput.click();
  bulkInput.onchange = () => {
    const file = bulkInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split('\n');
        const headers = lines[0].split(',');
        const songIndex = headers.indexOf('song');
        const artistIndex = headers.indexOf('artist');
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 2) {
            songs.push({
              title: cols[songIndex],
              artist: cols[artistIndex],
              note: '',
              spotify: '',
              image: null
            });
          }
        }
        localStorage.setItem('songs', JSON.stringify(songs));
        renderCards();
      };
      reader.readAsText(file);
    }
  };

  closeBtn.onclick = () => modal.style.display = 'none';
  renderCards();
});
