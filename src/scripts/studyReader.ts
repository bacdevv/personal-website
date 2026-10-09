/** Sticky notes TOC + live lab, minimal and dependency free. */
function initStudyReader(): void {
  const page = document.querySelector<HTMLElement>('[data-study-page="true"]');
  if (!page || page.dataset.studyReady === "yes") return;
  page.dataset.studyReady = "yes";
  const article = page.querySelector<HTMLElement>("[data-study-article]");
  const bar = page.querySelector<HTMLElement>("[data-study-progress]");
  const progress = page.querySelector<HTMLElement>(".study-progress");
  const tabs = [...page.querySelectorAll<HTMLButtonElement>("[data-study-tab]")];
  const tocPanel = page.querySelector<HTMLElement>('[data-study-panel="contents"]');
  const demoPanel = page.querySelector<HTMLElement>('[data-study-panel="demo"]');
  const headings = [...(article?.querySelectorAll<HTMLElement>("h2[id],h3[id]") ?? [])];
  const links = [...page.querySelectorAll<HTMLAnchorElement>('.study-sidebar .toc a[href^="#"]')];
  const hasDemo = Boolean(demoPanel?.querySelector(".la-learning-lab"));
  const demoTab = tabs.find(tab => tab.dataset.studyTab === "demo");
  if (demoTab && !hasDemo) demoTab.hidden = true;

  let mode: "contents" | "demo" = "contents";
  let manual = false;
  let lastHeading = "";
  let frame = 0;
  function show(which: "contents" | "demo") {
    mode = which;
    if (tocPanel) tocPanel.hidden = which !== "contents";
    if (demoPanel) demoPanel.hidden = which !== "demo";
    for (const tab of tabs) {
      const selected = tab.dataset.studyTab === which;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
  }
  for (const tab of tabs) {
    tab.addEventListener("click", () => { manual = true; show(tab.dataset.studyTab === "demo" && hasDemo ? "demo" : "contents"); });
  }
  // Target the section containing a useful worked example, rather than hiding the TOC all the time.
  const chapter = page.querySelector<HTMLElement>("[data-la-chapter]")?.dataset.laChapter;
  const demos: Record<string, RegExp> = {
    vectors: /addition|subtraction|scalar multiplication|dot product|vector length|angles|unit vector|projection/i,
    matrices: /matrix terminology|zoo of matrices|addition|subtraction|scalar multiplication|transpose|diagonal|trace/i,
    "matrix-multiplication": /standard matrix multiplication|four ways|layering|diagonal matrix|matrix-vector multiplication|2d transformation|rotation|geometric transformation/i,
  };

  function update() {
    frame = 0;
    if (!article || !bar) return;
    const top = article.getBoundingClientRect().top + window.scrollY;
    const bottom = top + article.scrollHeight;
    const length = Math.max(1, bottom - top - window.innerHeight * .65);
    const fraction = Math.max(0, Math.min(1, (window.scrollY - top + 70) / length));
    bar.style.transform = `scaleX(${fraction})`;
    progress?.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    let current: HTMLElement | undefined;
    for (const h of headings) { if (h.getBoundingClientRect().top <= 160) current = h; else break; }
    const id = current?.id ?? "";
    if (id !== lastHeading) {
      manual = false;
      lastHeading = id;
      if (hasDemo && chapter && demos[chapter]) {
        const text = current?.textContent ?? "";
        const recommended = Boolean(text && demos[chapter].test(text));
        if (!manual) show(recommended ? "demo" : "contents");
      }
    }
    for (const a of links) {
      const currentLink = a.hash === `#${encodeURIComponent(id)}` || a.hash === `#${id}`;
      if (currentLink && id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  show("contents");
  update();
}
if (typeof document !== "undefined") {
  initStudyReader();
  document.addEventListener("astro:page-load", initStudyReader);
}
