document.addEventListener('DOMContentLoaded', () => {
	const cartAmountElement = document.querySelector('.cart-amount')
	const totalAmountElement = document.getElementById('totalAmount')
	const cartButtons = document.querySelectorAll('.product-cart-icon')
	const purchaseButton = document.getElementById('purchaseButton')
	const purchaseMessage = document.querySelector('.purchaseMessage')
	const likeAmountElement = document.querySelector('.like-amount')
	const favoriteIcons = document.querySelectorAll('.product-favorite')
	const trashIcon = document.querySelector('.fa-trash')
	const basketIcon = document.getElementById('basket-icon')
	const basketContainer = document.getElementById('basket-container')
	const productThumbs = document.querySelectorAll('.product-thumb, .product-page')

	if (!cartAmountElement || !totalAmountElement || !purchaseMessage) {
		return
	}

	const cartState = {
		count: 0,
		total: 0,
	}

	let likeCount = 0
	let lastActivatedMessage = null
	let isBasketIconHovered = false
	let isBasketContainerHovered = false

	function getCookieExpirationDate() {
		const expirationDate = new Date()
		expirationDate.setDate(expirationDate.getDate() + 30)
		return expirationDate.toUTCString()
	}

	function getCookieValue(name) {
		return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`), '$1')
	}

	function saveCartState() {
		document.cookie = `cartAmount=${cartState.count}; expires=${getCookieExpirationDate()}; path=/`
		document.cookie = `totalAmount=${cartState.total}; expires=${getCookieExpirationDate()}; path=/`
	}

	function loadCartState() {
		cartState.count = parseInt(getCookieValue('cartAmount'), 10) || 0
		cartState.total = parseInt(getCookieValue('totalAmount'), 10) || 0
		renderCartState()
	}

	function renderCartState() {
		cartAmountElement.textContent = `${cartState.count}`
		totalAmountElement.textContent = `${cartState.total}`
	}

	function formatCurrency(amount) {
		return `${amount} zł`
	}

	function showInfoMessage(element, message) {
		if (!element) {
			return
		}

		if (lastActivatedMessage && lastActivatedMessage !== element) {
			lastActivatedMessage.style.display = 'none'
		}

		element.innerHTML = message
		element.style.display = 'block'
		lastActivatedMessage = element

		setTimeout(() => {
			element.style.display = 'none'
			if (lastActivatedMessage === element) {
				lastActivatedMessage = null
			}
		}, 4000)
	}

	function showPurchaseMessage(message) {
		showInfoMessage(purchaseMessage, message)
	}

	function showProductMessage(productElement, selector, message) {
		const infoBox = productElement ? productElement.querySelector(selector) : null
		showInfoMessage(infoBox, message)
	}

	function getButtonPrice(button) {
		const { price } = button.dataset
		return parseInt(price, 10) || 0
	}

	function resetCart() {
		cartState.count = 0
		cartState.total = 0
		renderCartState()
		saveCartState()
	}

	function handleCartButtonClick(event) {
		event.stopPropagation()

		const product = event.currentTarget.closest('.product-thumb, .product-page')
		const price = getButtonPrice(event.currentTarget)

		cartState.count += 1
		cartState.total += price

		renderCartState()
		saveCartState()
		showProductMessage(product, '.add-to-cart-info', 'Dodano do koszyka!')
	}

	function handleTrashIconClick(event) {
		event.stopPropagation()
		resetCart()
	}

	function handlePurchaseButtonClick(event) {
		event.stopPropagation()

		if (cartState.count === 0) {
			showPurchaseMessage('Twój koszyk jest pusty')
			return
		}

		showPurchaseMessage(
			`Twój produkt/y zostały zakupione!<br><br>Ilość zakupionych produktów: ${cartState.count}<br>Łączna kwota do zapłaty: ${formatCurrency(
				cartState.total
			)}<br><br>Więcej szczegółów otrzymasz w wiadomości e-mail.`
		)

		resetCart()
	}

	function updateLikeText() {
		if (likeAmountElement) {
			likeAmountElement.textContent = `${likeCount}`
		}
	}

	function handleFavoriteIconClick(event) {
		event.stopPropagation()

		const product = event.currentTarget.closest('.product-thumb, .product-page')
		const favoriteInfo = product ? product.querySelector('.favoriteMessage') : null
		const heartIcon = event.currentTarget.querySelector('.fa-heart')

		if (!heartIcon) {
			return
		}

		const isRegular = heartIcon.classList.contains('fa-regular')

		if (isRegular) {
			heartIcon.classList.remove('fa-regular')
			heartIcon.classList.add('fa-solid', 'product-favorite-heart-click')
			likeCount += 1
			showInfoMessage(favoriteInfo, 'Dodano do ulubionych!')
		} else {
			heartIcon.classList.remove('fa-solid', 'product-favorite-heart-click')
			heartIcon.classList.add('fa-regular')
			likeCount = Math.max(0, likeCount - 1)
			showInfoMessage(favoriteInfo, 'Usunięto z ulubionych!')
		}

		updateLikeText()
	}

	function shouldSkipProductRedirect(target) {
		if (!(target instanceof Element)) {
			return false
		}

		return Boolean(
			target.closest(
				'.fa-circle-play, .fa-stop, .playButton, .product-cart-icon, .product-favorite, .purchaseButton, .fa-trash, #basket-icon, #basket-container'
			)
		)
	}

	function handleProductClick(event) {
		if (shouldSkipProductRedirect(event.target)) {
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
	}

	function handleBasketIconHover() {
		if (!basketContainer) {
			return
		}

		isBasketIconHovered = true
		basketContainer.style.display = 'grid'
	}

	function handleBasketIconLeave() {
		if (!basketContainer) {
			return
		}

		isBasketIconHovered = false

		setTimeout(() => {
			if (!isBasketContainerHovered) {
				basketContainer.style.display = 'none'
			}
		}, 200)
	}

	function handleBasketIconClick(event) {
		if (!basketContainer) {
			return
		}

		event.stopPropagation()
		const isVisible = basketContainer.style.display === 'grid'

		basketContainer.style.display = isVisible ? 'none' : 'grid'
		isBasketIconHovered = !isVisible
	}

	function handleBasketContainerHover() {
		isBasketContainerHovered = true
	}

	function handleBasketContainerLeave() {
		if (!basketContainer) {
			return
		}

		isBasketContainerHovered = false

		if (!isBasketIconHovered) {
			basketContainer.style.display = 'none'
		}
	}

	loadCartState()
	updateLikeText()

	cartButtons.forEach(button => {
		button.addEventListener('click', handleCartButtonClick)
	})

	favoriteIcons.forEach(icon => {
		icon.addEventListener('click', handleFavoriteIconClick)
	})

	productThumbs.forEach(productThumb => {
		productThumb.addEventListener('click', handleProductClick)
	})

	if (trashIcon) {
		trashIcon.addEventListener('click', handleTrashIconClick)
	}

	if (purchaseButton) {
		purchaseButton.addEventListener('click', handlePurchaseButtonClick)
	}

	if (basketIcon && basketContainer) {
		basketIcon.addEventListener('click', handleBasketIconClick)
		basketIcon.addEventListener('mouseenter', handleBasketIconHover)
		basketIcon.addEventListener('mouseleave', handleBasketIconLeave)
		basketContainer.addEventListener('mouseenter', handleBasketContainerHover)
		basketContainer.addEventListener('mouseleave', handleBasketContainerLeave)
	}

	document.addEventListener('click', event => {
		if (!basketIcon || !basketContainer || !(event.target instanceof Element)) {
			return
		}

		if (!event.target.closest('#basket-icon') && !event.target.closest('#basket-container')) {
			basketContainer.style.display = 'none'
			isBasketIconHovered = false
			isBasketContainerHovered = false
		}
	})
})
