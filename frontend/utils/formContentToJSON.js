// Converts a form's fields into a clean JSON object
export function formContentToJSON(form) {
    const data = {};

    for (const element of form.elements) {
        if (!element.name || element.disabled) continue;

        // ====== Handle <select multiple> (e.g., genres) ======
        if (element.tagName === "SELECT" && element.multiple) {
            const selected = Array.from(element.selectedOptions)
                .map((opt) => opt.value.trim())
                .filter((v) => v.length > 0);

            // Always ensure it's an array, never a string
            data[element.name] = Array.isArray(selected)
                ? selected
                : [selected];
            continue;
        }

        // ====== Handle checkboxes ======
        if (element.type === "checkbox") {
            data[element.name] = element.checked;
            continue;
        }

        // ====== Handle numeric inputs ======
        if (element.type === "number") {
            const value = element.value.trim();
            data[element.name] = value === "" ? null : Number(value);
            continue;
        }

        // ====== Handle everything else (text, textarea, select-one, etc.) ======
        data[element.name] = element.value.trim();
    }

    // Clean up empty strings → remove them
    Object.keys(data).forEach((key) => {
        const val = data[key];
        if (
            val === "" ||
            val === null ||
            (Array.isArray(val) && val.length === 0)
        ) {
            delete data[key];
        }
    });

    // Defensive fix: if genres accidentally serialized as a string
    if (typeof data.genres === "string") {
        try {
            const parsed = JSON.parse(data.genres);
            data.genres = Array.isArray(parsed) ? parsed : [data.genres];
        } catch {
            data.genres = data.genres
                .split(",")
                .map((g) => g.trim())
                .filter((g) => g.length > 0);
        }
    }

    return data;
}
