// [ ACOUSTIC_RESONANCE_SYSTEM_V2.3 - RANDOMIZED ]
const playlist = [
    { title: "Bhairav", file: "track1.mp3" },
    { title: "Kalawati", file: "track2.mp3" },
    { title: "Malkauns", file: "track3.mp3" },
    { title: "Yaman", file: "track4.mp3" },
    { title: "Bad Bitch", file: "track5.mp3" },
    { title: "Перепутала", file: "track6.mp3" },
    { title: "Acenda o farol", file: "track7.mp3" },
    { title: "O Descobridor Dos Sete Mares", file: "track8.mp3" },
    { title: "Amores Lejanos", file: "track9.mp3" },
    { title: "Mi Manera de querer", file: "track10.mp3" },
    { title: "Aja mahi", file: "track11.mp3" },
    { title: "خونه ی ما", file: "track12.mp3" },
    { title: "Vienna Calling", file: "track13.mp3" },
    { title: "Ciudad de la furia", file: "track14.mp3" },
    { title: "ВИРТУАЛЬНАЯ ЛЮБОВЬ", file: "track15.mp3" },
    { title: "Oye mi amor", file: "track16.mp3" },
    { title: "Come", file: "track17.mp3" },
    { title: "Mas que nada", file: "track18.mp3" },
    { title: "Ring my bell", file: "track19.mp3" },
    { title: "Soledad y el mar", file: "track20.mp3" },
    { title: "Take 5", file: "track21.mp3" },
    { title: "Babaji ki Booti", file: "track22.mp3" },
];

let currentTrackIndex = Math.floor(Math.random() * playlist.length);
let isShuffle = false; 

const audio = new Audio();
audio.volume = 0.5;

const initJukebox = () => {
    const jukeboxHTML = `
    <div id="jukebox-card" style="position: fixed; top: 100px; left: 20px; width: 160px; z-index: 999999; background: rgba(5,5,10,0.98); border: 1px solid var(--warning-orange); border-left: 3px solid var(--warning-orange); padding: 12px; pointer-events: all; cursor: default; box-shadow: 0 0 20px rgba(0,0,0,0.8); user-select: none;">
        
        <div id="jukebox-header" style="color:var(--warning-orange); font-size:0.55rem; font-weight:bold; margin-bottom:10px; display:flex; justify-content:space-between; cursor: move; border-bottom: 1px solid #333; padding-bottom: 5px;">
            <span>[ MULTIVERSE_JUKEBOX ]</span>
            <span>☊</span>
        </div>

        <div id="track-info" style="font-size: 0.7rem; margin-bottom: 10px; color: #fff; white-space: nowrap; overflow: hidden; font-family: 'Fira Code', monospace; position: relative; width: 100%;">
            <span id="track-text">TRACK: IDLE</span>
        </div>
        
        <div id="progress-container" style="width: 100%; height: 6px; background: #111; margin-bottom: 12px; cursor: pointer; position: relative; border-radius: 2px;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: var(--warning-orange); box-shadow: 0 0 8px var(--warning-orange); border-radius: 2px;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 10px;">
            <button id="prev-btn" class="btn-mini">⟪</button>
            <button id="play-pause" class="btn-mini" style="color: var(--plasma-cyan); border-color: var(--plasma-cyan); font-size: 1rem; flex-grow: 1;">▶</button>
            <button id="next-btn" class="btn-mini">⟫</button>
            <button id="shuffle-btn" class="btn-mini" title="Toggle Shuffle">🔀</button>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
            <button id="mute-btn" class="btn-mini" style="font-size: 0.7rem; padding: 2px 4px;">🔊</button>
            <input type="range" id="vol-slider" min="0" max="1" step="0.01" value="0.5" 
                   style="flex-grow: 1; accent-color: var(--warning-orange); cursor: pointer; height: 3px; margin: 0;">
        </div>
    </div>

    <style>
        .btn-mini {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--warning-orange);
            color: var(--warning-orange);
            cursor: pointer;
            font-family: 'Fira Code', monospace;
            padding: 4px 6px;
            font-size: 0.75rem;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-mini:hover { background: rgba(255, 174, 0, 0.2); box-shadow: 0 0 8px var(--warning-orange); }
        .btn-mini.active { color: var(--plasma-cyan); border-color: var(--plasma-cyan); box-shadow: 0 0 8px var(--plasma-cyan); }
        #jukebox-card:active { cursor: grabbing; }

        #track-text {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 10s linear infinite;
        }

        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', jukeboxHTML);

    const card = document.getElementById('jukebox-card');
    const header = document.getElementById('jukebox-header');
    const progressContainer = document.getElementById('progress-container');
    const playBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const muteBtn = document.getElementById('mute-btn');
    const volSlider = document.getElementById('vol-slider');

    // --- DRAGGING LOGIC (MOVE ANYWHERE) ---
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Calculate the mouse position relative to the card's top-left corner
        offset.x = e.clientX - card.getBoundingClientRect().left;
        offset.y = e.clientY - card.getBoundingClientRect().top;
        card.style.transition = 'none'; // Disable transitions during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Update position based on mouse movement and initial offset
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        card.style.left = newX + 'px';
        card.style.top = newY + 'px';
        card.style.right = 'auto'; // Ensure 'right' doesn't fight with 'left'
        card.style.bottom = 'auto'; 
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        card.style.transition = ''; // Restore transition if any
    });

    // --- VOLUME BUTTON LOGIC ---
    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.innerText = audio.muted ? '🔇' : '🔊';
        muteBtn.classList.toggle('active', audio.muted);
    });

    // --- LOGIC FUNCTIONS ---
    const setNextTrack = () => {
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            currentTrackIndex = newIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
    };

    // --- CONTROLS ---
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => console.log("User interaction required"));
            playBtn.innerText = "‖";
        } else {
            audio.pause();
            playBtn.innerText = "▶";
        }
    });

    nextBtn.addEventListener('click', () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "‖";
    });

    prevBtn.addEventListener('click', () => {
        if (isShuffle) {
            setNextTrack(); 
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        }
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "‖";
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pos * audio.duration;
    });

    volSlider.oninput = (e) => { 
        audio.volume = e.target.value; 
        if (audio.volume > 0) {
            audio.muted = false;
            muteBtn.innerText = '🔊';
        }
    };
    
    audio.ontimeupdate = () => {
        const pct = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = (pct || 0) + "%";
    };
    
    audio.onended = () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
    };

    function loadTrack(index) {
        const track = playlist[index];
        audio.src = track.file;
        document.getElementById('track-text').innerText = `TRACK: ${track.title}`;
    }

    loadTrack(currentTrackIndex);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJukebox);
} else {
    initJukebox();
}