document.addEventListener('DOMContentLoaded', function () {
	var playButtons = document.querySelectorAll('.playButton')

	playButtons.forEach(function (playButton) {
		var audioPlayer = new Audio(playButton.dataset.audioSrc)
		audioPlayer.loop = true

		var isPlaying = false

		playButton.addEventListener('click', function (event) {
			if (event.target.classList.contains('fa-circle-play')) {
				playAudio()
			} else if (event.target.classList.contains('fa-stop')) {
				stopAudio()
			}
		})

		function playAudio() {
			audioPlayer.play()
			playButton.innerHTML = '<i class="fas fa-stop"></i>'
			playButton.classList.add('isPlaying')
		}

		function stopAudio() {
			audioPlayer.pause()
			audioPlayer.currentTime = 0
			playButton.innerHTML = '<i class="fas fa-circle-play"></i>'
			playButton.classList.remove('isPlaying')
		}

		audioPlayer.addEventListener('ended', function () {
			stopAudio()
		})
	})
})

// Music Player od "klienci" card

const audioPlayers = document.querySelectorAll('.audio-player')

audioPlayers.forEach(audioPlayer => {
	const audio = new Audio(audioPlayer.dataset.audio)

	audio.addEventListener('loadeddata', () => {
		audioPlayer.querySelector('.time .length').textContent = getTimeCodeFromNum(audio.duration)
		audio.volume = 0.75
	})

	//click on timeline to skip around
	const timeline = audioPlayer.querySelector('.timeline')
	timeline.addEventListener('click', e => {
		const timelineWidth = window.getComputedStyle(timeline).width
		const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration
		audio.currentTime = timeToSeek
	})

	//click volume slider to change volume
	const volumeSlider = audioPlayer.querySelector('.controls .volume-slider')
	volumeSlider.addEventListener('click', e => {
		const sliderWidth = window.getComputedStyle(volumeSlider).width
		const newVolume = e.offsetX / parseInt(sliderWidth)
		audio.volume = newVolume
		audioPlayer.querySelector('.controls .volume-percentage').style.width = newVolume * 100 + '%'
	})

	//check audio percentage and update time accordingly
	setInterval(() => {
		const progressBar = audioPlayer.querySelector('.progress')
		progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%'
		audioPlayer.querySelector('.time .current').textContent = getTimeCodeFromNum(audio.currentTime)
	}, 500)

	//toggle between playing and pausing on button click
	const playBtn = audioPlayer.querySelector('.controls .toggle-play')

	playBtn.addEventListener('click', () => {
		if (audio.paused) {
			playBtn.classList.remove('play')
			playBtn.classList.add('pause')
			audio.play()
		} else {
			playBtn.classList.remove('pause')
			playBtn.classList.add('play')
			audio.pause()
		}
	})

	// Dodano zdarzenie click na volume button w obrębie konkretnego audio playera
	audioPlayer.querySelector('.volume-button').addEventListener('click', () => {
		const volumeEl = audioPlayer.querySelector('.volume-container .volume')
		audio.muted = !audio.muted
		if (audio.muted) {
			volumeEl.classList.remove('icono-volumeMedium')
			volumeEl.classList.add('icono-volumeMute')
		} else {
			volumeEl.classList.add('icono-volumeMedium')
			volumeEl.classList.remove('icono-volumeMute')
		}
	})
})

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
	let seconds = parseInt(num)
	let minutes = parseInt(seconds / 60)
	seconds -= minutes * 60
	const hours = parseInt(minutes / 60)
	minutes -= hours * 60

	if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`
	return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`
}
