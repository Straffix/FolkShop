const nav = document.querySelector('.nav-mobile')
const burgerIcon = document.querySelector('.burger-icon')
const allNavItems = document.querySelectorAll('.nav-mobile-anim')

const updateFontAwesomeFallback = () => {
	const hasFontAwesomeSvg = Boolean(document.querySelector('svg.svg-inline--fa'))
	document.documentElement.classList.toggle('fa-fallback', !hasFontAwesomeSvg)
}

updateFontAwesomeFallback()

let iconCheckCount = 0
const iconCheckInterval = setInterval(() => {
	updateFontAwesomeFallback()
	iconCheckCount += 1

	if (document.querySelector('svg.svg-inline--fa') || iconCheckCount >= 10) {
		clearInterval(iconCheckInterval)
	}
}, 300)

window.addEventListener('load', updateFontAwesomeFallback)

const handleNav = () => {
	if (!nav) {
		return
	}

	nav.classList.toggle('nav-mobile--active')

	allNavItems.forEach(item => {
		item.addEventListener('click', () => {
			nav.classList.remove('nav-mobile--active')
		})
	})

	handleNavItemsAnimation()
}

const handleNavItemsAnimation = () => {
	let delayTime = 0

	allNavItems.forEach(item => {
		item.classList.toggle('nav-items-animation')
		item.style.animationDelay = '.' + delayTime + 's'
		delayTime++
	})
}

if (burgerIcon) {
	burgerIcon.addEventListener('click', handleNav)
}
