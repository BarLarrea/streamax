import {
    getDailyViewsForUserService,
    getGenrePopularityService
} from "../../services/watchHistoryService.js";

export async function initStatsPage() {
    await ensureChartJsLoaded();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const [dailyViews, genrePopularity] = await Promise.all([
        getDailyViewsForUserService(user.userId),
        getGenrePopularityService()
    ]);

    renderDailyViewsChart(dailyViews);
    renderGenrePopularityChart(genrePopularity);
}

/* ---------------------------
   LOAD CHART.JS DYNAMICALLY
---------------------------- */
function ensureChartJsLoaded() {
    return new Promise((resolve) => {
        if (window.Chart) return resolve();

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = resolve;
        document.body.appendChild(script);
    });
}

/* ---------------------------
   BAR CHART — DAILY VIEWS
---------------------------- */
function renderDailyViewsChart(profiles) {
    const canvas = document.getElementById("dailyViewsChart");
    if (!profiles.length) return;

    // Collect all unique dates
    const allDates = new Set();
    profiles.forEach((p) => p.daily.forEach((d) => allDates.add(d.date)));

    const labels = [...allDates].sort();

    const datasets = profiles.map((p, index) => ({
        label: p.name,
        data: labels.map((day) => {
            const rec = p.daily.find((d) => d.date === day);
            return rec ? rec.count : 0;
        }),
        backgroundColor: getColor(index)
    }));

    new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getColor(i) {
    const colors = ["#4c8dff", "#6ea8ff", "#8cbcfe", "#ffd37a", "#ffa3b5"];
    return colors[i % colors.length];
}

/* ---------------------------
   PIE CHART — GENRE POPULARITY
---------------------------- */
function renderGenrePopularityChart(data) {
    const emptyEl = document.getElementById("genrePopularityEmpty");
    const canvas = document.getElementById("genrePopularityChart");

    if (!data || !data.length) {
        emptyEl.classList.remove("hidden");
        canvas.classList.add("hidden");
        return;
    }

    new Chart(canvas, {
        type: "pie",
        data: {
            labels: data.map((g) => g.genre),
            datasets: [
                {
                    data: data.map((g) => g.count),
                    backgroundColor: [
                        "#4c8dff",
                        "#6ea8ff",
                        "#82d2ff",
                        "#8cbcfe",
                        "#a8d1ff",
                        "#4dd5c9",
                        "#ffa3b5",
                        "#ffd37a"
                    ]
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}
