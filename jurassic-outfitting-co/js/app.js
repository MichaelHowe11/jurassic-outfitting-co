// Add Event listners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // check if size buttons exist
    if (document.querySelectorAll('.size-button') !== null) {
        let sizeButtons = document.querySelectorAll('.size-button');
        sizeButtons.forEach(button => button.addEventListener('click', toggleSize))
    }

    // Log Ready to the console.
    console.log("Ready");
});

function toggleSize(e) {
    let sizeButtons = document.querySelectorAll('.size-button');
        sizeButtons.forEach(button => button.classList.remove('active'))
    e.target.classList.toggle("active");
}