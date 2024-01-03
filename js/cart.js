document.addEventListener('DOMContentLoaded', () => {
	const cartAmountElement = document.querySelector('.cart-amount')
	const cartButtons = document.querySelectorAll('.product-cart-icon')
	const purchaseButton = document.getElementById('purchaseButton')
	const purchaseMessage = document.querySelector('.purchaseMessage')
	const likeAmountElement = document.querySelector('.like-amount')
	const favoriteIcons = document.querySelectorAll('.product-favorite')
	const trashIcon = document.querySelector('.fa-trash')
	const basketIcon = document.getElementById('basket-icon')
	const basketContainer = document.getElementById('basket-container')

	let clickCount = 0
	let likeCount = 0
	let lastActivatedMessage = null
	let isBasketIconHovered = false
	let isBasketContainerHovered = false

	// Funkcja obsługująca najechanie na ikonę koszyka
	function handleBasketIconHover() {
		isBasketIconHovered = true
		basketContainer.style.display = 'grid'
	}

	// Funkcja obsługująca zjechanie z ikony koszyka
	function handleBasketIconLeave() {
		isBasketIconHovered = false
		// Opóźnij ukrycie koszyka, aby dać czas na najechanie myszą na kontener koszyka
		setTimeout(() => {
			if (!isBasketContainerHovered) {
				basketContainer.style.display = 'none'
			}
		}, 200) // Opóźnienie w milisekundach (tu 200 ms)
	}

	// Funkcja obsługująca najechanie na kontener koszyka
	function handleBasketContainerHover() {
		isBasketContainerHovered = true
	}

	// Funkcja obsługująca zjechanie z kontenera koszyka
	function handleBasketContainerLeave() {
		isBasketContainerHovered = false
		// Ukryj koszyk tylko jeśli mysz nie znajduje się nad ikoną koszyka
		if (!isBasketIconHovered) {
			basketContainer.style.display = 'none'
		}
	}

	// Dodaj nasłuchiwanie zdarzeń
	basketIcon.addEventListener('mouseenter', handleBasketIconHover)
	basketIcon.addEventListener('mouseleave', handleBasketIconLeave)
	basketContainer.addEventListener('mouseenter', handleBasketContainerHover)
	basketContainer.addEventListener('mouseleave', handleBasketContainerLeave)

	// Funkcja zapisująca koszyk do ciasteczka
	function saveCartToCookie() {
		document.cookie = `cartAmount=${clickCount}; expires=${getCookieExpirationDate()}; path=/`
		document.cookie = `totalAmount=${totalAmount}; expires=${getCookieExpirationDate()}; path=/`
	}

	// Funkcja wczytująca koszyk z ciasteczka
	function loadCartFromCookie() {
		const cartAmountCookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cartAmount\s*=\s*([^;]*).*$)|^.*$/, '$1')
		const totalAmountCookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)totalAmount\s*=\s*([^;]*).*$)|^.*$/, '$1')

		clickCount = parseInt(cartAmountCookieValue) || 0
		totalAmount = parseInt(totalAmountCookieValue) || 0

		updateCartText()
		updateTotalAmount() // Dodaj tę linijkę
	}

	// Funkcja zwracająca datę ważności ciasteczka (ustawiona na 30 dni od teraz)
	function getCookieExpirationDate() {
		const expirationDate = new Date()
		expirationDate.setDate(expirationDate.getDate() + 30)
		return expirationDate.toUTCString()
	}

	// Po załadowaniu strony wczytaj koszyk z ciasteczka
	loadCartFromCookie()

	// Nasłuchuj zmian w koszyku i zapisuj je do ciasteczka
	document.addEventListener('click', () => {
		saveCartToCookie()
	})

	function handleCartButtonClick() {
		clickCount++
		updateCartText()

		const productInfo = this.closest('.product-thumb, .product-page').querySelector('.add-to-cart-info')
		showProductInfo(productInfo, 'Dodano do koszyka!')
	}

	function handleTrashIconClick() {
		clickCount = 0
		totalAmount = 0 // Dodaj tę linijkę
		updateCartText()
		updateTotalAmount() // Dodaj tę linijkę
		saveCartToCookie()
	}

	function handlePurchaseButtonClick() {
		if (clickCount === 0) {
			showPurchaseMessage('Twój koszyk jest pusty')
		} else {
			showPurchaseMessage(
				`Twój produkt/y zostały zakupione!<br><br>Ilość zakupionych produktów: ${clickCount}<br>Łączna kwota do zapłaty: ${formatCurrency(
					totalAmount
				)}
                    <br><br>Więcej szczegółów otrzymasz w wiadomości e-mail.`
			)
			clickCount = 0
			totalAmount = 0 // Dodaj tę linijkę
			updateCartText()
			updateTotalAmount() // Dodaj tę linijkę
			saveCartToCookie()
		}
	}

	function formatCurrency(amount) {
		return `${amount} zł`
	}

	function updateCartText() {
		cartAmountElement.textContent = clickCount === 0 ? '0' : `${clickCount}`
	}

	function showPurchaseMessage(message) {
		showInfoMessage(purchaseMessage, message)
	}

	function showProductInfo(element, message) {
		showInfoMessage(element, message)
	}

	function showInfoMessage(element, message) {
		if (lastActivatedMessage) {
			lastActivatedMessage.style.display = 'none'
		}

		element.innerHTML = message
		element.style.display = 'block'
		lastActivatedMessage = element

		setTimeout(() => {
			element.style.display = 'none'
		}, 4000)
	}

	function updateTotalAmount() {
		document.getElementById('totalAmount').innerText = totalAmount
	}

	function handleFavoriteIconClick() {
		const productThumb = this.closest('.product-thumb, .product-page')
		const favoriteInfo = productThumb.querySelector('.favoriteMessage')
		const heartIcon = this.querySelector('i.fa-heart')
		const isRegular = heartIcon.classList.contains('fa-regular')

		if (isRegular) {
			// If the product is added to favorites
			heartIcon.classList.remove('fa-regular')
			heartIcon.classList.add('fa-solid', 'product-favorite-heart-click')
			likeCount++
			showProductInfo(favoriteInfo, 'Dodano do ulubionych!')
		} else {
			// If the product is removed from favorites
			heartIcon.classList.remove('fa-solid', 'product-favorite-heart-click')
			heartIcon.classList.add('fa-regular')
			likeCount--
			showProductInfo(favoriteInfo, 'Usunięto z ulubionych!')
		}

		updateLikeText()
	}

	function updateLikeText() {
		likeAmountElement.textContent = likeCount === 0 ? '0' : `${likeCount}`
	}

	favoriteIcons.forEach(icon => {
		icon.addEventListener('click', handleFavoriteIconClick)
	})

	const productThumbs = document.querySelectorAll('.product-thumb, .product-page')

	productThumbs.forEach(productThumb => {
		productThumb.addEventListener('click', event => {
			const target = event.target

			if (
				target.classList.contains('fa-circle-play') ||
				target.classList.contains('fa-stop') ||
				target.classList.contains('product-cart-icon') ||
				target.classList.contains('product-favorite') ||
				target.closest('.fa-circle-play') ||
				target.closest('.fa-stop') ||
				target.closest('.product-cart-icon') ||
				target.closest('.product-favorite')
			) {
				return
			}

			purchaseMessage.style.display = 'block'
			purchaseMessage.textContent = 'Przenoszenie do strony z produktem...'

			setTimeout(() => {
				purchaseMessage.textContent = 'To tylko portfolio!'
			}, 3000)

			setTimeout(() => {
				purchaseMessage.style.display = 'none'
			}, 5000)
		})
	})

	cartButtons.forEach(button => {
		button.addEventListener('click', handleCartButtonClick)
	})

	trashIcon.addEventListener('click', handleTrashIconClick)
	purchaseButton.addEventListener('click', handlePurchaseButtonClick)
})

// Inicjalizacja sumy
let totalAmount = 0

// Funkcja dodająca do koszyka
function addToCart(price) {
	totalAmount += price
	document.getElementById('totalAmount').innerText = totalAmount
}

// Resetowanie totalAmount po kliknięciu na ikonę "fa-trash"
document.querySelector('.fa-trash').addEventListener('click', function () {
	totalAmount = 0
	document.getElementById('totalAmount').innerText = totalAmount
})

// Resetowanie totalAmount po kliknięciu na przycisk "purchaseButton"
document.getElementById('purchaseButton').addEventListener('click', function () {
	setTimeout(() => {
		totalAmount = 0
		document.getElementById('totalAmount').innerText = totalAmount
	}, 1000)
})
