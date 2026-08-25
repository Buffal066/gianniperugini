(function () {
    const buttons = Array.from(document.querySelectorAll("[data-ec-language]"));
    const panels = Array.from(document.querySelectorAll("[data-ec-language-content]"));

    function setLanguage(language) {
        const selected = language === "fr" ? "fr" : "en";
        document.documentElement.lang = selected === "fr" ? "fr-CA" : "en-CA";
        panels.forEach((panel) => { panel.hidden = panel.dataset.ecLanguageContent !== selected; });
        buttons.forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.ecLanguage === selected)); });
    }

    buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.ecLanguage)));
    setLanguage(new URLSearchParams(window.location.search).get("lang") || "en");
}());
