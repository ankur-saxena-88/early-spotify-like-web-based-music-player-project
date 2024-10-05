let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const volumeControl = document.getElementById("volume");
const volumePercentage = document.getElementById("volume-percentage");
const currentSongTitle = document.getElementById("currentSong");
const currentArtist = document.getElementById("currentArtist");
const playlistElement = document.getElementById("currentQueuedSongs");
const browseFilesBtn = document.getElementById("browseFilesBtn");

// Function to load and play a song
function loadSong(song) {
    audio.src = song.file;
    currentSongTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    progress.value = 0;
    audio.load();

    audio.addEventListener('loadedmetadata', () => {
        document.getElementById("totalDuration").textContent = formatTime(audio.duration);
    });
}

// Play the song
function playSong() {
    audio.play();
    playPauseBtn.textContent = "⏸️";
    isPlaying = true;
}

// Pause the song
function pauseSong() {
    audio.pause();
    playPauseBtn.textContent = "⏯️";
    isPlaying = false;
}

// Play or pause song based on the current state
function playPauseSong() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Format time for display
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update song progress and play next with delay when current song ends
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);

    if (audio.currentTime >= audio.duration) {
        nextSongWithDelay();
    }
});

// Function to play the next song after a 2-second delay
function nextSongWithDelay() {
    setTimeout(() => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }, 2000); // 2-second delay
}

// Function to play the previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
}

// Update audio playback progress
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Volume control
volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value / 100;
    volumePercentage.textContent = `${volumeControl.value}%`;
});

// Event listeners for control buttons
playPauseBtn.addEventListener("click", playPauseSong);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSongWithDelay);

// File input for local songs
browseFilesBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.multiple = true;

    input.addEventListener("change", (event) => {
        const files = Array.from(event.target.files);

        songs = files.map(file => ({
            title: file.name.split(".")[0],
            artist: "Unknown Artist",
            file: URL.createObjectURL(file)
        }));

        updatePlaylistDisplay();

        // Instantly play the first song
        currentSongIndex = 0;
        loadSong(songs[currentSongIndex]);
        playSong();
    });

    input.click();
});

// Update playlist display
function updatePlaylistDisplay() {
    playlistElement.innerHTML = "";
    songs.forEach((song, index) => {
        const songItem = document.createElement("div");
        songItem.textContent = song.title;
        songItem.classList.add("song-item");

        songItem.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
        });

        playlistElement.appendChild(songItem);
    });
}
