/*
1. Render songs --> OK
2. Scroll top  --> OK
3. Play/ pause/ seek --> OK (seek chua chuan)
4. CD rotate --> OK
5. Next/ Prev --> OK
6. Random --> OK
7. Next/ Repeat when ended --> OK
8. Active song --> OK
9. Scroll active song into view --> OK
10. Play song when click --> OK
Bonus: Local Storage
console.log
*/

const PLAY_MUSIC_KEY = "playMusicKey";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const audio = $('#audio');
const cd = $('.cd');
const cdThum = $('.cd-thumb');
const heading = $('header h2');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');



const app = {
	currentIndex: 0,
	isPlaying: false,
	isSeek: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAY_MUSIC_KEY)) || {},
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAY_MUSIC_KEY, JSON.stringify(this.config));
	},
	songs: [
		{
			name: "Anh luon la ly do",
			singer: "Erik",
			pathImg: "./img/anhluonlalydo.jpg",
			pathSong: "./songs/Anh-Luon-La-Ly-Do-ERIK.mp3"
		},
		{
			name: "Thở",
			singer: "Da Lab",
			pathImg: "./img/tho.jpg",
			pathSong: "./songs/tho.mp3"
		},
		{
			name: "Co hen voi bau troi",
			singer: "Touliver",
			pathImg: "./img/co-hen-voi-bau-troi.jpg",
			pathSong: "./songs/co_hen_voi_bau_troi.mp3"
		},
		{
			name: "Vi toi con song",
			singer: "Tien Tien",
			pathImg: "./img/vitoiconsong.jpg",
			pathSong: "./songs/Vi-Toi-Con-Song-Tien-Tien.mp3"
		},
		{
			name: "Em oi cu vui",
			singer: "Chilles",
			pathImg: "./img/emoicuvui.jpg",
			pathSong: "./songs/Em-Oi-Cu-Vui-SlimV-Touliver.mp3"
		},
		{
			name: "Nhat",
			singer: "Phan Manh Quynh",
			pathImg: "./img/nhat.jpg",
			pathSong: "./songs/Nhat.mp3"
		},
		{
			name: "Yeu mot nguoi sao buon den the",
			singer: "Chilles",
			pathImg: "./img/yeumotnguoi.jpg",
			pathSong: "./songs/Yeu-Mot-Nguoi-Sao-Buon-Den-The-Noo-Phuoc-Thinh.mp3"
		},
		{
			name: "Dan ong khong noi",
			singer: "Chilles",
			pathImg: "./img/danongkonoi.jpg",
			pathSong: "./songs/Dan-Ong-Khong-Noi.mp3"
		},
	],

	render: function () {
		let htmls = this.songs.map((song, index) => {
			return `
		  	<div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
		      <div class="thumb" style="background-image: url(${song.pathImg})">
		      </div>
		      <div class="body">
		        <h3 class="title">${song.name}</h3>
		        <p class="author">${song.singer}</p>
		      </div>
		      <div class="option">
		        <i class="fas fa-ellipsis-h"></i>
		      </div>
		    </div>
	  	`
		});
		playList.innerHTML = htmls.join('');
	},

	defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex];
			}
		})
	},

	loadCurrentSong: function () {
		cdThum.style.backgroundImage = `url(${this.currentSong.pathImg})`;
		heading.textContent = `${this.currentSong.name}`;
		audio.src = `${this.currentSong.pathSong}`;
	},

	handleEvents: function () {
		const _this = this;
		const cdWidth = cd.offsetWidth;
		// Khi scroll se thu nho dashboard
		document.onscroll = function () {
			const scrollTop = document.documentElement.scrollTop || window.scrollY;
			let newCdWidth = cdWidth - scrollTop;
			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
			cd.style.opacity = newCdWidth / cdWidth;
		}
		// Khi click btn play
		playBtn.onclick = function () {
			if (_this.isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		}
		// khi dang phat nhac
		audio.onplay = function () {
			_this.isPlaying = true;
			player.classList.add('playing');
			cdAnimate.play();
			_this.setConfig('currentIndex', _this.currentIndex);
		}
		// Khi tam dung bai hat
		audio.onpause = function () {
			_this.isPlaying = false;
			player.classList.remove('playing');
			cdAnimate.pause();
		}

		// update progress bar
		audio.ontimeupdate = function () {
			if (!_this.isSeek) {
				let currentTimePercent = audio.currentTime / audio.duration * 100;
				if (currentTimePercent) {
					progress.value = Math.floor(currentTimePercent);
				}
			}

		}

		progress.onmousedown = function () {
			_this.isSeek = true;
		}
		progress.onmouseup = function () {
			_this.isSeek = false;
		}

		// seek
		progress.onchange = function () {
			let timeSeek = progress.value * audio.duration / 100;
			audio.currentTime = timeSeek;
		}
		// Animate CD Rotate
		const cdAnimate = cdThum.animate({ transform: 'rotate(360deg)' }, {
			duration: 10000,
			iterations: Infinity
		})
		cdAnimate.pause();

		// Next song
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.render();
			_this.scrollActiveIntoView();
		}
		nextBtn.onmousedown = function () {
			this.classList.add('active');
		}
		nextBtn.onmouseup = function () {
			this.classList.remove('active');
		}

		// Prev song
		prevBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.prevSong();
			}
			audio.play();
			_this.render();
			_this.scrollActiveIntoView();
		}
		prevBtn.onmousedown = function () {
			this.classList.add('active');
		}
		prevBtn.onmouseup = function () {
			this.classList.remove('active');
		}

		// Random song
		randomBtn.onclick = function () {
			_this.isRandom = !_this.isRandom;
			_this.setConfig('isRandom', _this.isRandom);
			randomBtn.classList.toggle('active', _this.isRandom);
		}

		// repeat song
		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			repeatBtn.classList.toggle('active', _this.isRepeat);
		}

		// on ended
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play();
			} else {
				nextBtn.click();
			}
		}

		// Play when click the song
		playList.onclick = function (e) {
			let songNode = e.target.closest('.song:not(.active)');
			let optionSong = e.target.closest('.option');
			if (songNode || (optionSong)) {
				// Xu ly khi click vao bai hat
				if (songNode && !optionSong) {
					_this.currentIndex = Number(songNode.dataset.index);
					_this.loadCurrentSong();
					_this.render();
					audio.play();
				}
				// Khi click vao option
				if (optionSong) {

				}
			}
		}
	},

	scrollActiveIntoView: function () {
		$('.song.active').scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	},

	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},

	prevSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadCurrentSong();
	},

	randomSong: function () {
		let randomIndex;
		do {
			randomIndex = Math.floor(Math.random() * this.songs.length);
		} while (this.currentIndex === randomIndex);
		this.currentIndex = randomIndex;
		this.loadCurrentSong();
	},

	loadConfig: function () {
		this.isRepeat = this.config.isRepeat;
		this.isRandom = this.config.isRandom;
		this.currentIndex = Number(this.config.currentIndex) || 0;
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
	},

	start: function () {
		// Load config 
		this.loadConfig();
		// Dinh nghia thuoc tinh cho app
		this.defineProperties();
		// Xu ly cac su kien DOM
		this.handleEvents();

		this.loadCurrentSong();


		this.render();
	},



};

app.start()