export const showSuccess = (message = "Success!") => {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#2ecc71",
        style: {
            color: "#fff",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        },
        stopOnFocus: true
    }).showToast();
};

export const showError = (message = "Something went wrong") => {
    Toastify({
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: "#e74c3c",
        style: {
            color: "#fff",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        },
        stopOnFocus: true
    }).showToast();
};
