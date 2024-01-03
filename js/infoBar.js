// Funkcja zamykająca pasek informacyjny
function closeInfoBar() {
	var infoBars = document.getElementsByClassName('info-bar')
	for (var i = 0; i < infoBars.length; i++) {
		infoBars[i].style.display = 'none'
	}

	// Ustawienie ciasteczka o nazwie "infoBarClosed" na wartość "true" z ważnością 365 dni
	document.cookie =
		'infoBarClosed=true; expires=' + new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString()
}

// Sprawdzenie, czy ciasteczko "infoBarClosed" jest ustawione
window.onload = function () {
	if (document.cookie.indexOf('infoBarClosed=true') !== -1) {
		// Jeśli ciasteczko jest ustawione, ukryj pasek
		var infoBars = document.getElementsByClassName('info-bar')
		for (var i = 0; i < infoBars.length; i++) {
			infoBars[i].style.display = 'none'
		}
	}
}
