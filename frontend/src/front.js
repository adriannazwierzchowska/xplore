
document.addEventListener('DOMContentLoaded', (event) => {
    const slider = document.querySelector('.slider');
    
    // Load the saved value from session storage if it exists
    const savedValue = sessionStorage.getItem('weather');
    if (savedValue !== null) {
        slider.value = savedValue;
    }

    // Save the value to session storage on change
    slider.addEventListener('input', (event) => {
        sessionStorage.setItem('weather', event.target.value);
    });
});