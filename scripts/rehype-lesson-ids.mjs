const lessonHeading = /^(?:<[^>]+>)*\s*(\d+)\.\s+/;

function textContent(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  return (node.children || []).map(textContent).join("");
}

function walk(node) {
  if (!node?.children) return;
  for (const child of node.children) {
    if (child.type === "element" && child.tagName === "h3") {
      const match = lessonHeading.exec(textContent(child));
      if (match) {
        child.properties ||= {};
        child.properties.dataLessonId = match[1];
      }
    }
    walk(child);
  }
}

export default function rehypeLessonIds() {
  return tree => walk(tree);
}
