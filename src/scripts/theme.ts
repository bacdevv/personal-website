const media = window.matchMedia("(prefers-color-scheme: dark)");
function saved() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}
function reflect(value: string) {
  document.documentElement.dataset.theme = value;
  document.documentElement.classList.toggle("dark", value === "dark");
  document
    .querySelector("#theme-btn")
    ?.setAttribute(
      "aria-label",
      `Switch to ${value === "dark" ? "light" : "dark"} theme`
    );
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
}
reflect(saved() || (media.matches ? "dark" : "light"));
document.querySelector("#theme-btn")?.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", next);
  } catch {}
  reflect(next);
});
media.addEventListener("change", () => {
  if (!saved()) reflect(media.matches ? "dark" : "light");
});
