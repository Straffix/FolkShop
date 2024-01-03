document.getElementById('contactForm').addEventListener('submit', function (event) {
	event.preventDefault()

	var messageContainer = document.getElementById('messageContainer')
	var form = document.getElementById('contactForm')

	// Tutaj możesz dodać kod obsługi wysłania formularza
	// np. zamiast alert, możesz zmienić tekst komunikatu
	messageContainer.innerHTML = 'Dziękujemy za przesłanie wiadomości!'
	messageContainer.style.display = 'block'

	// Ukryj formularz po wysłaniu
	form.style.display = 'none'

	// Dodaj kod, aby przywrócić formularz po pewnym czasie (np. 3 sekundy)
	setTimeout(function () {
		messageContainer.style.display = 'none'
		form.style.display = 'block'
		// Możesz również wyczyścić pola formularza tutaj, jeśli chcesz
		form.reset()
	}, 3000) // Czas w milisekundach (3 sekundy)
})
