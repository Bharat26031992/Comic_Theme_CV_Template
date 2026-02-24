const playlist = [
    { title: "Bhairav", file: "track1.mp3" },
    { title: "Kalawati", file: "track2.mp3" },
    { title: "Malkauns", file: "track3.mp3" },
    { title: "Yaman", file: "track4.mp3" },
    { title: "Bad Bitch", file: "track5.mp3" },
    { title: "Vienna Calling", file: "track13.mp3" },
    { title: "Babaji ki Booti", file: "track22.mp3" }
];

let currentTrackIndex = Math.floor(Math.random() * playlist.length);
const audioPlayer = new Audio();

window.initJukebox = () => {
    const jukeboxHTML = `
    <div id="jukebox-card" style="position: fixed; top: 100px; left: 20px; width: 170px; z-index: 999999; background: rgba(5,5,10,0.95); border: 1px solid var(--warning-orange); border-left: 4px solid var(--warning-orange); padding: 12px; pointer-events: all; cursor: default; box-shadow: 0 0 20px rgba(0,0,0,0.8); font-family: 'Fira Code', monospace;">
        <div id="jukebox-header" style="color:var(--warning-orange); font-size:0.5rem; font-weight:bold; margin-bottom:8px; display:flex; justify-content:space-between; cursor: move; border-bottom: 1px solid #444;">
            <span>[ SYSTEM_JUKEBOX ]</span><span>☊</span>
        </div>
        <div id="track-info" style="font-size: 0.6rem; color: #00ffff; overflow: hidden; white-space: nowrap; margin-bottom: 10px;">
            <span id="track-text">PLAYING: IDLE</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 4px;">
            <button onclick="prevTrack()" class="btn-mini">⟪</button>
            <button id="play-pause" onclick="togglePlay()" class="btn-mini" style="flex-grow: 1;">▶</button>
            <button onclick="nextTrack()" class="btn-mini">⟫</button>
        </div>
    </div>
    <style>.btn-mini { background: #222; border: 1px solid var(--warning-orange); color: var(--warning-orange); cursor: pointer; padding: 5px; font-size: 0.7rem; }</style>`;

    document.body.insertAdjacentHTML('beforeend', jukeboxHTML);
    loadTrack(currentTrackIndex);
    
    // Dragging Logic
    const card = document.getElementById('jukebox-card');
    const header = document.getElementById('jukebox-header');
    let isDragging = false, offset = { x: 0, y: 0 };
    header.onmousedown = (e) => { isDragging = true; offset.x = e.clientX - card.offsetLeft; offset.y = e.clientY - card.offsetTop; };
    document.onmousemove = (e) => { if (!isDragging) return; card.style.left = (e.clientX - offset.x) + 'px'; card.style.top = (e.clientY - offset.y) + 'px'; };
    document.onmouseup = () => isDragging = false;
};

function loadTrack(index) {
    audioPlayer.src = playlist[index].file;
    document.getElementById('track-text').innerText = `TRACK: ${playlist[index].title}`;
}

function togglePlay() {
    const btn = document.getElementById('play-pause');
    if (audioPlayer.paused) { audioPlayer.play(); btn.innerText = "‖"; }
    else { audioPlayer.pause(); btn.innerText = "▶"; }
}

function nextTrack() { currentTrackIndex = (currentTrackIndex + 1) % playlist.length; loadTrack(currentTrackIndex); audioPlayer.play(); }
function prevTrack() { currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length; loadTrack(currentTrackIndex); audioPlayer.play(); }