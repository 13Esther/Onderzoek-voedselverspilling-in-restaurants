
let responses = JSON.parse(
    localStorage.getItem("responses") || "[]"
);

function showSurvey() {
    document.getElementById("home").hidden = true;
    document.getElementById("survey").hidden = false;
}

document.getElementById("surveyForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        const answer = {
            q1: formData.get("q1"),
            q2: formData.get("q2"),
            q3: formData.get("q3"),
            q4: formData.get("q4"),
            q5: formData.get("q5").trim()
        };

        responses.push(answer);

        localStorage.setItem(
            "responses",
            JSON.stringify(responses)
        );

        this.reset();

        document.getElementById("survey").hidden = true;
        document.getElementById("home").hidden = false;

        updateResults();
    });

function updateResults() {
    const yes = responses.filter(
        r => r.q4 === "Ja"
    ).length;

    const no = responses.filter(
        r => r.q4 === "Nee"
    ).length;

    const total = yes + no;

    const yesPercent = total ? Math.round(yes / total * 100) : 0;
    const noPercent = total ? Math.round(no / total * 100) : 0;

    const ctx = document.getElementById("chart");

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Voldoende informatie", "Onvoldoende informatie"],
            datasets: [{
                data: [yesPercent, noPercent],
                backgroundColor: ["#48a66a", "#ed806f"]
            }]
        }
    });

    document.getElementById("answers").innerHTML =
        "<h3>Open antwoorden</h3>" +
        responses.map(r =>
            `<p>${escapeHTML(r.q5)}</p>`
        ).join("");

}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

updateResults();
