const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = document.querySelector("#prev"),
    nextBtn = document.querySelector("#next"),
    mainAudio = document.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    volumeSlider = document.querySelector(".volume-slider"),
    musicList = wrapper.querySelector(".music-list"),
    moreMusicBtn = wrapper.querySelector("#more-music"),
    closemoreMusic = wrapper.querySelector("#close"),
    ulTag = wrapper.querySelector("ul");

// SONG DATA - REPLACE WITH YOUR FILES
let allMusic = [
    {
        name: "Song 1",
        artist: "Artist 1",
        img: "img-1.jpg",
        src: "music-1"
    },
    {
        name: "Song 2",
        artist: "Artist 2",
        img: "img-2.png",
        src: "music-2"
    },
    {
        name: "Song 3",
        artist: "Artist 3",
        img: "img-3.png",
        src: "music-3"
    }
];

let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// Play Music Function
function playMusic() {
    wrapper.classList.add("paused");
    wrapper.classList.add("playing");
    playPauseBtn.querySelector("i").classList.remove("fa-play-circle");
    playPauseBtn.querySelector("i").classList.add("fa-pause-circle");
    mainAudio.play();
}

// Pause Music Function
function pauseMusic() {
    wrapper.classList.remove("paused");
    wrapper.classList.remove("playing");
    playPauseBtn.querySelector("i").classList.add("fa-play-circle");
    playPauseBtn.querySelector("i").classList.remove("fa-pause-circle");
    mainAudio.pause();
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

// Next Music Function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

// Prev Music Function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

nextBtn.addEventListener("click", nextMusic);
prevBtn.addEventListener("click", prevMusic);

// Update Progress Bar & Time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuration = wrapper.querySelector(".max-duration");

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) currentSec = `0${currentSec}`;
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

mainAudio.addEventListener("loadeddata", () => {
    let musicDuration = wrapper.querySelector(".max-duration");
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    musicDuration.innerText = `${totalMin}:${totalSec}`;
});

// Click Progress Bar
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

// Autoplay
mainAudio.addEventListener("ended", nextMusic);

// Volume Control
volumeSlider.addEventListener("input", () => {
    mainAudio.volume = volumeSlider.value / 100;
});

// Playlist Logic
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});

// Render Playlist
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}" onclick="clicked(this)">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    musicList.classList.remove("show");
}