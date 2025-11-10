export function showSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) spinner.classList.remove("hidden");
}

export function hideSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) spinner.classList.add("hidden");
}
