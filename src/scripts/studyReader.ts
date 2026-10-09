/** Accessible right-side reading tools, closed until explicitly requested. */
type ReaderMode = "contents" | "demo";
let activeController: AbortController | undefined;

function initReadingTools(): void {
  const tools = document.querySelector<HTMLElement>("[data-reading-tools]");
  if (!tools) { activeController?.abort(); activeController = undefined; return; }
  if (tools.dataset.readerReady === "yes") return;
  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;
  const options = { signal: controller.signal };
  tools.dataset.readerReady = "yes";

  const drawer = tools.querySelector<HTMLElement>("[data-reading-panel]");
  const shade = tools.querySelector<HTMLElement>("[data-reading-shade]");
  const closeButton = tools.querySelector<HTMLButtonElement>("[data-reading-close]");
  const triggers = Array.from(tools.querySelectorAll<HTMLButtonElement>("[data-reading-trigger]"));
  const switches = Array.from(tools.querySelectorAll<HTMLButtonElement>("[data-reading-switch]"));
  const contents = tools.querySelector<HTMLElement>('[data-reading-view="contents"]');
  const demo = tools.querySelector<HTMLElement>('[data-reading-view="demo"]');
  const tocLinks = Array.from(tools.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]'));
  const hasDemo = Boolean(demo?.querySelector(".la-learning-lab"));
  const hasContents = Boolean(contents);
  const article = document.querySelector<HTMLElement>("[data-study-article]");
  const progressBar = document.querySelector<HTMLElement>("[data-study-progress]");
  const progressTrack = document.querySelector<HTMLElement>(".study-progress");
  const page = document.querySelector<HTMLElement>("[data-study-page]");
  let active: ReaderMode | null = null;
  let opener: HTMLButtonElement | null = null;
  let frame = 0;

  for (const button of [...triggers, ...switches]) {
    const requested = button.dataset.readingTrigger ?? button.dataset.readingSwitch;
    if (requested === "demo" && !hasDemo) button.hidden = true;
    if (requested === "contents" && !hasContents) button.hidden = true;
  }
  if (!hasDemo && !hasContents) {
    tools.hidden = true;
    return;
  }
  if (!article) return;

  function setMode(next: ReaderMode | null, restoreFocus = false): void {
    if (next === "demo" && !hasDemo) next = hasContents ? "contents" : null;
    if (next === "contents" && !hasContents) next = hasDemo ? "demo" : null;
    const isOpen = next !== null;
    const wasClosed = active === null;
    active = next;
    tools!.dataset.state = isOpen ? "open" : "closed";
    if (page) page.dataset.studyDrawerOpen = String(isOpen);
    if (drawer) drawer.hidden = !isOpen;
    if (shade) shade.hidden = !isOpen;
    if (contents) contents.hidden = next !== "contents";
    if (demo) demo.hidden = next !== "demo";
    for (const button of triggers) {
      button.setAttribute("aria-expanded", String(isOpen && button.dataset.readingTrigger === next));
    }
    for (const button of switches) {
      button.setAttribute("aria-pressed", String(button.dataset.readingSwitch === next));
    }
    if (isOpen && wasClosed && closeButton) closeButton.focus({ preventScroll: true });
    if (!isOpen && restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
  }

  for (const button of triggers) button.addEventListener("click", () => {
    const mode = button.dataset.readingTrigger as ReaderMode;
    const wasOpen = active === mode;
    opener = button;
    setMode(wasOpen ? null : mode, wasOpen);
  }, options);
  for (const button of switches) button.addEventListener("click", () => {
    setMode(button.dataset.readingSwitch as ReaderMode);
  }, options);
  closeButton?.addEventListener("click", () => setMode(null, true), options);
  shade?.addEventListener("click", () => setMode(null, true), options);
  for (const link of tocLinks) link.addEventListener("click", () => setMode(null), options);
  document.addEventListener("keydown", event => {
    if (active && event.key === "Escape") {
      event.preventDefault();
      setMode(null, true);
    }
  }, options);
  document.addEventListener("pointerdown", event => {
    if (active && event.target instanceof Node && !tools.contains(event.target)) setMode(null);
  }, options);

  // The progress indicator and the active TOC link update without opening the drawer.
  const headings = Array.from(article?.querySelectorAll<HTMLElement>("h2[id],h3[id]") ?? []);
  const lessonHeadings = Array.from(article?.querySelectorAll<HTMLElement>("h3[data-lesson-id]") ?? []);
  const chapter = location.pathname.match(/\/notes\/([^/]+)/)?.[1];
  let activeLesson = "";
  const updateActiveLesson = (): void => {
    if (!chapter || !lessonHeadings.length) return;
    // Find the last heading above the reading line, including long sections.
    let heading = lessonHeadings[0];
    for (const next of lessonHeadings) {
      if (next.getBoundingClientRect().top <= 190) heading = next;
      else break;
    }
    const lesson = Number(heading.dataset.lessonId);
    if (!Number.isFinite(lesson)) return;
    const id = `${chapter}:${lesson}`;
    if (id === activeLesson) return;
    activeLesson = id;
    article!.dataset.activeLesson = id;
    window.dispatchEvent(new CustomEvent("linear-algebra:lesson-change", { detail: { chapter, lesson, source: "reading-position" } }));
  };
  function updateReadingPosition(): void {
    frame = 0;
    if (!article) return;
    updateActiveLesson();
    if (progressBar) {
      const start = article.getBoundingClientRect().top + window.scrollY;
      const end = start + article.scrollHeight;
      const length = Math.max(1, end - start - window.innerHeight * 0.65);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start + 70) / length));
      progressBar.style.transform = `scaleX(${ratio})`;
      progressTrack?.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    }
    let current = "";
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 165) current = heading.id;
      else break;
    }
    for (const link of tocLinks) {
      const selected = current !== "" && decodeURIComponent(link.hash.slice(1)) === current;
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  function requestUpdate(): void {
    if (!frame) frame = requestAnimationFrame(updateReadingPosition);
  }
  window.addEventListener("scroll", requestUpdate, { passive: true, signal: controller.signal });
  window.addEventListener("resize", requestUpdate, { passive: true, signal: controller.signal });
  // Deliberately start closed: no scroll-based or automatic demo opening.
  setMode(null);
  updateReadingPosition();
}

if (typeof document !== "undefined") {
  initReadingTools();
  document.addEventListener("astro:page-load", initReadingTools);
}
