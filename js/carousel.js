// Inicjalizacja zmiennej currentIndex, przechowującej aktualny indeks obrazu w karuzeli. Domyślnie ustawiona na 0, co oznacza pierwszy obraz.
let currentIndex = 0

// Inicjalizacja zmiennej intervalId, przechowującej identyfikator interwału używanego do automatycznego obracania karuzeli.
let intervalId

// Zmienna przechowująca informację o stanie automatycznego obracania karuzeli.
let isAutoRotating = true

// Funkcja changeSlide(n) zwiększa lub zmniejsza currentIndex o wartość n (1 lub -1) i wywołuje funkcję showSlide().
function changeSlide(n) {
	currentIndex += n
	showSlide()
	updateDots() // Aktualizacja kropek po zmianie slajdu.
}

// Pobranie elementu .carousel-inner, który zawiera obrazy karuzeli (aktualny slajd).
function showSlide() {
	const slides = document.querySelector('.carousel-inner')

	// Sprawdzenie, czy currentIndex wykracza poza zakres obrazów. Jeśli tak, ustawia currentIndex na odpowiedni indeks, zapętlając karuzelę.
	if (currentIndex < 0) {
		currentIndex = slides.children.length - 1
	} else if (currentIndex >= slides.children.length) {
		currentIndex = 0
	}

	// Ustawienie transformacji CSS, aby przesunąć obrazy w bok w zależności od currentIndex.
	slides.style.transform = `translateX(${-currentIndex * 100}%)`
}

// Uruchomienie automatycznego obracania karuzeli poprzez wywołanie changeSlide(1) co 2000 milisekund (2 sekundy).
function startAutoRotate() {
	intervalId = setInterval(() => {
		changeSlide(1)
	}, 2000)
}

// Zatrzymanie automatycznego obracania karuzeli przez wyczyszczenie interwału.
function stopAutoRotate() {
	clearInterval(intervalId)
}

// Funkcja tworząca kropki pod zdjęciami i dodająca obsługę kliknięć.
function createDots() {
	const carouselInner = document.querySelector('.carousel-inner')
	const dotContainer = document.querySelector('.carousel-dots')

	for (let i = 0; i < carouselInner.children.length; i++) {
		const dot = document.createElement('div')
		dot.classList.add('dot')
		dotContainer.appendChild(dot)

		// Dodanie obsługi kliknięcia na kropkę.
		dot.addEventListener('click', () => {
			currentIndex = i
			showSlide()
			updateDots()
		})
	}
	updateDots()
}

// Funkcja aktualizująca kropki na podstawie aktualnego indeksu.
function updateDots() {
	const dots = document.querySelectorAll('.dot')

	dots.forEach((dot, index) => {
		if (index === currentIndex) {
			dot.classList.add('active')
		} else {
			dot.classList.remove('active')
		}
	})
}

// Rejestracja nasłuchiwania na zdarzenie DOMContentLoaded, co oznacza, że startAutoRotate() zostanie wywołane po załadowaniu strony.
document.addEventListener('DOMContentLoaded', () => {
	createDots() // Tworzenie kropek po załadowaniu strony.
	startAutoRotate() // Start automatycznego obracania karuzeli.
})

// Pobranie elementu karuzeli.
const carousel = document.querySelector('.carousel')

// Dodanie ikony do karuzeli
carousel.innerHTML += '<i class="fas fa-pause carousel-icon"></i>'

// Dodanie ikony do karuzeli
carousel.innerHTML += '<i class="fas fa-pause carousel-icon-center"></i>'

// Pobranie elementu ikony
const carouselIcon = document.querySelector('.carousel-icon')

// Pobranie elementu ikony
const carouselIconCenter = document.querySelector('.carousel-icon-center')

// Ukryj carouselIconCenter na początku
carouselIconCenter.style.display = 'none'

let isPaused = false

carousel.addEventListener('click', event => {
	// Sprawdź, czy kliknięcie nastąpiło na strzałce (prev lub next). Jeśli tak, zakończ funkcję.
	if (event.target.classList.contains('prev') || event.target.classList.contains('next')) {
		return
	}

	if (isAutoRotating) {
		stopAutoRotate()
		carouselIcon.classList.remove('fa-pause')
		carouselIcon.classList.add('fa-play')
		carouselIconCenter.classList.add('fa-pause')
		carouselIconCenter.classList.remove('fa-play')

		carouselIconCenter.style.display = 'block'

		// Ustaw timeout na 1000 milisekund (1 sekunda) dla zniknięcia carouselIconCenter
		setTimeout(() => {
			carouselIconCenter.style.display = 'none'
		}, 300)
	} else {
		startAutoRotate()
		carouselIcon.classList.remove('fa-play')
		carouselIcon.classList.add('fa-pause')
		carouselIconCenter.classList.remove('fa-pause')
		carouselIconCenter.classList.add('fa-play')

		carouselIconCenter.style.display = 'block'

		// Ustaw timeout na 1000 milisekund (1 sekunda) dla zniknięcia carouselIconCenter
		setTimeout(() => {
			carouselIconCenter.style.display = 'none'
		}, 300)
	}

	isAutoRotating = !isAutoRotating
	isPaused = !isPaused
})
