
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const songTitle = document.getElementById("songTitle");

let playlist = [];
let currentTrack = 0;
let isPlaying = false;

function loadSong(index) {
  const song = playlist[index];
  audio.src = song.file;
  songTitle.textContent = song.name;
  audio.play();
  playPauseBtn.src = 'assets/pause icon.png';
  isPlaying = true;
}

function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.src = "assets/pause icon.png";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.src = "assets/menu.png";
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadSong(currentTrack);
  playSong();
}

function prevSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadSong(currentTrack);
  playSong();
}

playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("ended", nextSong);

// 🔥 On startup: fetch playlist from system music folder
window.addEventListener("DOMContentLoaded", async () => {
  playlist = await window.electronAPI.getPlaylist();
  if (playlist.length > 0) {
    loadSong(currentTrack);
  } else {
    songTitle.textContent = "No music files found!";
  }
});
