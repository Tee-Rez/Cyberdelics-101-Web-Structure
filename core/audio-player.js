/**
 * CYBERDELICS 101 - Audio Player
 * 
 * Manages ambient audio playback for binaural beats and soundscapes.
 * Designed to integrate with LessonUI sidebar.
 */

class AudioPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            basePath: options.basePath || 'assets/audio/binaural/',
            autoLoad: options.autoLoad !== false,
            loop: options.loop !== false,
            defaultVolume: options.defaultVolume || 0.5
        };

        // State
        this.tracks = [];
        this.currentTrack = null;
        this.isPlaying = false;
        this.isLocked = options.locked !== false; // Default: locked
        this.audio = new Audio();
        this.audio.loop = this.options.loop;
        this.audio.volume = this.options.defaultVolume;

        // DOM Elements
        this.elements = {};

        // Bind events
        this.audio.addEventListener('ended', () => this._onTrackEnd());
        this.audio.addEventListener('play', () => this._onPlayStateChange(true));
        this.audio.addEventListener('pause', () => this._onPlayStateChange(false));

        // Render UI
        this._render();

        // Auto-load tracks
        if (this.options.autoLoad) {
            this.loadTracks(`${this.options.basePath}tracks.json`);
        }

        console.log('[AudioPlayer] Initialized');
    }

    // ========== PUBLIC API ==========

    async loadTracks(manifestUrl) {
        try {
            const response = await fetch(manifestUrl);
            if (!response.ok) throw new Error('Failed to load tracks');
            const data = await response.json();
            this.tracks = data.tracks || [];
            this._renderTrackList();
            console.log('[AudioPlayer] Loaded', this.tracks.length, 'tracks');
        } catch (err) {
            console.warn('[AudioPlayer] Could not load tracks:', err.message);
            // Show placeholder message
            this._showMessage('No audio tracks available');
        }
    }

    play(trackId) {
        if (this.isLocked) return; // Can't play when locked

        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        this.currentTrack = track;
        this.audio.src = `${this.options.basePath}${track.file}`;
        this.audio.play().catch(err => {
            console.warn('[AudioPlayer] Playback blocked:', err.message);
        });
        this._updateNowPlaying();
    }

    pause() {
        this.audio.pause();
    }

    toggle() {
        if (this.isLocked) return; // Can't toggle when locked

        if (this.isPlaying) {
            this.pause();
        } else if (this.currentTrack) {
            this.audio.play();
        } else if (this.tracks.length > 0) {
            this.play(this.tracks[0].id);
        }
    }

    setVolume(value) {
        this.audio.volume = Math.max(0, Math.min(1, value));
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.value = this.audio.volume;
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.currentTrack = null;
        this._updateNowPlaying();
    }

    unlock() {
        if (!this.isLocked) return;
        this.isLocked = false;

        // Update UI
        const wrapper = this.container.querySelector('.ap-player');
        if (wrapper) {
            wrapper.classList.remove('ap-locked');
        }
        if (this.elements.nowPlaying) {
            this.elements.nowPlaying.querySelector('.ap-track-name').textContent = 'Select a track';
        }

        console.log('[AudioPlayer] Unlocked!');
    }

    // ========== PRIVATE ==========

    _render() {
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'ap-player' + (this.isLocked ? ' ap-locked' : '');

        // Header
        const header = document.createElement('div');
        header.className = 'ap-header';
        header.innerHTML = `<span class="ap-title">🎧 AMBIENT</span>`;
        wrapper.appendChild(header);

        // Now Playing
        const nowPlaying = document.createElement('div');
        nowPlaying.className = 'ap-now-playing';
        nowPlaying.innerHTML = this.isLocked
            ? `<span class="ap-track-name">🔒 Locked</span>`
            : `<span class="ap-track-name">Select a track</span>`;
        wrapper.appendChild(nowPlaying);
        this.elements.nowPlaying = nowPlaying;

        // Controls
        const controls = document.createElement('div');
        controls.className = 'ap-controls';

        // Play/Pause Button
        const playBtn = document.createElement('button');
        playBtn.className = 'ap-btn ap-play-btn';
        playBtn.innerHTML = '▶';
        playBtn.addEventListener('click', () => this.toggle());
        controls.appendChild(playBtn);
        this.elements.playBtn = playBtn;

        // Volume Slider
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.className = 'ap-volume';
        volumeSlider.min = 0;
        volumeSlider.max = 1;
        volumeSlider.step = 0.05;
        volumeSlider.value = this.audio.volume;
        volumeSlider.addEventListener('input', (e) => this.setVolume(parseFloat(e.target.value)));
        controls.appendChild(volumeSlider);
        this.elements.volumeSlider = volumeSlider;

        wrapper.appendChild(controls);

        // Track Selector (Dropdown)
        const trackSelector = document.createElement('select');
        trackSelector.className = 'ap-track-selector';
        trackSelector.innerHTML = '<option value="">-- Select a track --</option>';
        trackSelector.addEventListener('change', (e) => {
            const trackId = e.target.value;
            if (trackId) {
                this.selectTrack(trackId);
            } else {
                // User selected "-- Select a track --", stop playback
                this.stop();
                if (this.elements.trackInfo) {
                    this.elements.trackInfo.innerHTML = '';
                }
            }
        });
        wrapper.appendChild(trackSelector);
        this.elements.trackSelector = trackSelector;

        // Loop Option
        const loopContainer = document.createElement('label');
        loopContainer.className = 'ap-loop-option';
        loopContainer.innerHTML = `
            <input type="checkbox" class="ap-loop-checkbox" checked>
            <span>Loop</span>
        `;
        const loopCheckbox = loopContainer.querySelector('.ap-loop-checkbox');
        loopCheckbox.addEventListener('change', (e) => {
            this.audio.loop = e.target.checked;
        });
        wrapper.appendChild(loopContainer);
        this.elements.loopCheckbox = loopCheckbox;

        // Track Info (shows description when selected)
        const trackInfo = document.createElement('div');
        trackInfo.className = 'ap-track-info-display';
        wrapper.appendChild(trackInfo);
        this.elements.trackInfo = trackInfo;

        this.container.appendChild(wrapper);
    }

    /**
     * Select a track (but don't play yet)
     */
    selectTrack(trackId) {
        if (this.isLocked) return;

        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        this.currentTrack = track;
        this.audio.src = `${this.options.basePath}${track.file}`;
        this._updateNowPlaying();

        // Show track info
        if (this.elements.trackInfo) {
            this.elements.trackInfo.innerHTML = `
                <div class="ap-info-name">${track.name}</div>
                <div class="ap-info-desc">${track.description}</div>
                <div class="ap-info-duration">Duration: ${track.duration}</div>
            `;
        }
    }

    _renderTrackList() {
        if (!this.elements.trackSelector) return;

        // Clear existing options (except placeholder)
        this.elements.trackSelector.innerHTML = '<option value="">-- Select a track --</option>';

        // Add track options
        this.tracks.forEach(track => {
            const option = document.createElement('option');
            option.value = track.id;
            option.textContent = track.name;
            this.elements.trackSelector.appendChild(option);
        });
    }

    _updateNowPlaying() {
        if (!this.elements.nowPlaying) return;

        if (this.currentTrack) {
            this.elements.nowPlaying.innerHTML = `
                <span class="ap-track-name">${this.currentTrack.name}</span>
            `;
        } else {
            this.elements.nowPlaying.innerHTML = `<span class="ap-track-name">Select a track</span>`;
        }

        // Update track list selection
        if (this.elements.trackList) {
            this.elements.trackList.querySelectorAll('.ap-track-item').forEach(el => {
                el.classList.toggle('active', el.dataset.trackId === this.currentTrack?.id);
            });
        }
    }

    _onPlayStateChange(playing) {
        this.isPlaying = playing;
        if (this.elements.playBtn) {
            this.elements.playBtn.innerHTML = playing ? '❚❚' : '▶';
            this.elements.playBtn.classList.toggle('playing', playing);
        }

        // Call external callback if provided
        if (typeof this.onPlayStateChange === 'function') {
            this.onPlayStateChange(playing);
        }
    }

    _onTrackEnd() {
        // If not looping, could auto-advance to next track
        console.log('[AudioPlayer] Track ended');
    }

    _showMessage(msg) {
        if (this.elements.trackList) {
            this.elements.trackList.innerHTML = `<div class="ap-message">${msg}</div>`;
        }
    }
}

// Export to window
window.AudioPlayer = AudioPlayer;
