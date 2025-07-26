const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let trails = [];

function drawTrail(x, y) {
  trails.push({ x, y, alpha: 1 });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trails.forEach((trail, index) => {
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(152, 251, 152, ${trail.alpha})`; // pale green
    ctx.fill();
    trail.alpha -= 0.01;
    if (trail.alpha <= 0) trails.splice(index, 1);
  });
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  drawTrail(e.clientX, e.clientY);
});

animate();

const addButton = document.getElementById('add-button');
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const form = document.getElementById('song-form');
const cardsContainer = document.getElementById('cards-container');

function loadSongs() {
  const songs = JSON.parse(localStorage.getItem('songs') || '[]');
  cardsContainer.innerHTML = '';
  songs.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = song.image;
    const title = document.createElement('h3');
    title.textContent = song.title;
    const artist = document.createElement('p');
    artist.textContent = song.artist;
    const note = document.createElement('p');
    note.textContent = song.note;
    const actions = document.createElement('div');
    actions.className = 'actions';
    const play = document.createElement('a');
    play.href = song.spotify;
    play.target = '_blank';
    play.textContent = '▶';
    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = () => {
      songs.splice(index, 1);
      localStorage.setItem('songs', JSON.stringify(songs));
      loadSongs();
    };
    actions.appendChild(play);
    actions.appendChild(del);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(artist);
    card.appendChild(note);
    card.appendChild(actions);
    cardsContainer.appendChild(card);
  });
}

addButton.onclick = () => {
  modal.style.display = 'block';
};

closeButton.onclick = () => {
  modal.style.display = 'none';
};

form.onsubmit = (e) => {
  e.preventDefault();
  const reader = new FileReader();
  const file = document.getElementById('image').files[0];
  reader.onload = function(event) {
    const imageData = event.target.result;
    const newSong = {
      title: document.getElementById('title').value,
      artist: document.getElementById('artist').value,
      image: imageData,
      note: document.getElementById('note').value,
      spotify: document.getElementById('spotify').value
    };
    const songs = JSON.parse(localStorage.getItem('songs') || '[]');
    songs.push(newSong);
    localStorage.setItem('songs', JSON.stringify(songs));
    loadSongs();
    modal.style.display = 'none';
    form.reset();
  };
  if (file) {
    reader.readAsDataURL(file);
  }
};

window.onload = loadSongs;
