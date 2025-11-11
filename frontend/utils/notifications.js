const showToast = (message, color, duration = 3000) => {
    Toastify({
        text: message,
        duration,
        gravity: "top",
        position: "right",
        backgroundColor: color,
        style: {
            color: "#fff",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        },
        stopOnFocus: true
    }).showToast();
};

export const showSuccess = (message = "Success!") =>
    showToast(message, "#2ecc71", 3500);

export const showError = (message = "Something went wrong") =>
    showToast(message, "#e74c3c", 3500);

export const showInfo = (message = "Info") =>
    showToast(message, "#3498db", 3500);
