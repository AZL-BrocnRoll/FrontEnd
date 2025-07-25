// Contact

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');
    const popupOk = document.getElementById('popup-ok');

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.classList.remove('hidden');
    }

    function hidePopup() {
        popup.classList.add('hidden');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (name === '' && email === '' && message === '') {
            showPopup('Please fill in at least one field.');
            return;
        }

        // Fake sending delay
        showPopup('Thank you for your message!');
        form.reset();
    });

    if (popupClose) popupClose.addEventListener('click', hidePopup);
    if (popupOk) popupOk.addEventListener('click', hidePopup);

    // Optional: close popup if clicking outside modal content
    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
});