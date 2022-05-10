const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('.header h4')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.app')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const playLisst = $('.play-list')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/nevada.mp3',
            image: './assets/img/nevada.jpg'
        },
        {
            name: 'Attention',
            singer: 'Charlie Puth',
            path: './assets/music/Attention - Charlie Puth.mp3',
            image: './assets/img/attention.jpg'
        },
        {
            name: 'Monody',
            singer: 'The Fat Rat-Laura Brehm',
            path: './assets/music/Monody-TheFatRatLauraBrehm-4174394.mp3',
            image: './assets/img/monody.jpg'
        },
        {
            name: 'Summertime',
            singer: 'Cinnamons Evening Cinema',
            path: './assets/music/Summertime-CinnamonsEveningCinema-6046288.mp3',
            image: './assets/img/sunnertine.jpg'
        },
        {
            name: 'Monster',
            singer: 'KatieSky',
            path: './assets/music/MonstersAlbumVersionEdited-TimefliesKatieSky-6124468.mp3',
            image: './assets/img/artworks-000637445251-79f3pp-t500x500.jpg'
        },
        {
            name: 'My Love',
            singer: 'Westlife',
            path: './assets/music/My Love - Westlife.mp3',
            image: './assets/img/mylove.jpg'
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies_ Janieck Devy',
            path: './assets/music/Reality - Lost Frequencies_ Janieck Devy.mp3',
            image: './assets/img/reality.jpg'
        },
        {
            name: 'Sugar',
            singer: 'Maroon 5',
            path: './assets/music/Sugar - Maroon 5.mp3',
            image: './assets/img/sugar.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}c</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playLisst.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get : function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handlerEvents: function() {
        const _this = this

        document.onscroll = function() {
            console.log(window)
        }

        
        
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }else{ 
                audio.play()
            }
        }

        //  Xử lý CD quay và dừng

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()
        // Khi bài hát đc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Click next button
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Click prev button
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render
            _this.scrollToActiveSong()
        }

        // click random button
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Click repeat button
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Khi bài hát kết thúc sẽ xử lý
        audio.onended = function() {
            if(_this.isRepeat) {
                playBtn.click()
            }else{
                nextBtn.click()
            }
        }

        // click song lắng nghe hành vi click của playList
        playLisst.onclick = function(e) {
            const songElement = e.target.closest('.song:not(.active)')
            if ( songElement || e.target.closest('.option')) {
                
                // Xử lý khi click vào song
                if (songElement) {
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào song option 
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    loadCurrentSong: function() {
        
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
             newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) 
        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 100
        )
    },
    start: function() {

        this.loadConfig()

        this.defineProperties()

        this.handlerEvents()

        this.loadCurrentSong()

        this.render()

        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)

    }
} 

app.start()