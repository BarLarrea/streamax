// Converts a form's fields into a clean JSON object
export function formContentToJSON(form) {
    const data = {};
    const genresHidden = form.querySelector("#genres-hidden");

    for (const element of form.elements) {
        if (!element.name || element.disabled) continue;

        // ====== Handle <select multiple> (e.g., genres) ======
        if (element.tagName === "SELECT" && element.multiple) {
            const selected = Array.from(element.selectedOptions)
                .map((opt) => opt.value.trim())
                .filter((v) => v.length > 0);

            data[element.name] = selected;
            continue;
        }

        if (genresHidden) {
            try {
                const parsed = JSON.parse(genresHidden.value);
                if (Array.isArray(parsed)) data.genres = parsed;
            } catch {}
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

    // ====== Convert comma-separated lists to arrays ======
    ["actors", "directors", "Director", "alternativeTitles"].forEach((key) => {
        if (data[key] && typeof data[key] === "string") {
            data[key] = data[key]
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
        }
    });

    // ====== Clean up empty strings ======
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

    // ====== Defensive fix for genres ======
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

    // ====== Convert language list ======
    if (data.language && typeof data.language === "string") {
        data.language = data.language
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
    }

    return data;
}
