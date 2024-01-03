const nav = document.querySelector('.nav-mobile')
const burgerIcon = document.querySelector('.burger-icon')
const allNavItems = document.querySelectorAll('.nav-mobile-anim')

const handleNav = () => {
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

burgerIcon.addEventListener('click', handleNav)
