
interface Mark {
  type: string;
}

interface AssetTarget {
  sys: { type: string; linkType: string; id: string };
}

interface Node {
  nodeType: string;
  value?: string;
  marks?: Mark[];
  data?: { uri?: string; target?: AssetTarget };
  content?: Node[];
}

export interface RichTextDocument {
  nodeType: "document";
  data: Record<string, never>;
  content: Node[];
}

const SUPPORTED_BLOCKS = new Set([
  "paragraph",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "unordered-list",
  "ordered-list",
  "list-item",
  "blockquote",
  "hr",
  "text",
  "hyperlink",
  "embedded-asset-block",
]);

const SUPPORTED_MARKS = new Set(["bold", "italic", "code", "underline"]);

export const ASSET_MARKER = /^!\[([^\]]*)\]\(asset:([A-Za-z0-9._-]{1,64})\)$/;

export function assetMarker(id: string) {
  return `![](asset:${id})`;
}

export function assetIdsInDocument(document: unknown): string[] {
  const ids: string[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === "embedded-asset-block") {
      const id = node.data?.target?.sys?.id;
      if (id) ids.push(id);
    }
    for (const child of node.content ?? []) walk(child);
  };

  const doc = document as RichTextDocument | null | undefined;
  if (!doc || doc.nodeType !== "document") return ids;
  for (const node of doc.content ?? []) walk(node);
  return [...new Set(ids)];
}

export function canEditAsMarkdown(document: unknown): { ok: true } | { ok: false; reason: string } {
  const unsupported = new Set<string>();

  const walk = (node: Node) => {
    if (!SUPPORTED_BLOCKS.has(node.nodeType)) unsupported.add(node.nodeType);
    for (const mark of node.marks ?? []) {
      if (!SUPPORTED_MARKS.has(mark.type)) unsupported.add(`mark:${mark.type}`);
    }
    for (const child of node.content ?? []) walk(child);
  };

  const doc = document as RichTextDocument | null | undefined;
  if (!doc || doc.nodeType !== "document") return { ok: true };
  for (const node of doc.content ?? []) walk(node);

  if (unsupported.size === 0) return { ok: true };
  return {
    ok: false,
    reason: [...unsupported]
      .map((type) =>
        type.startsWith("mark:")
          ? type.slice(5)
          : type.replace(/^embedded-/, "").replace(/-/g, " ")
      )
      .join(", "),
  };
}

const SAFE_SCHEME = /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i;

export function safeUri(uri: string | undefined) {
  const trimmed = (uri ?? "").trim();
  return SAFE_SCHEME.test(trimmed) ? trimmed : "";
}

function escapeInline(text: string) {
  return text
    .replace(/([\\`*_[\]])/g, "\\$1")
    .replace(/\+\+/g, "\\+\\+");
}

function escapeBlockStart(line: string) {
  return line
    .replace(/^(\s*)(#{1,6})(\s)/, "$1\\$2$3")
    .replace(/^(\s*)>/, "$1\\>")
    .replace(/^(\s*)([-+])(\s)/, "$1\\$2$3")
    .replace(/^(\s*)(\d+)([.)])(\s)/, "$1$2\\$3$4")
    .replace(/^(\s*)(-{3,}|_{3,})(\s*)$/, "$1\\$2$3");
}

function escapeBlock(text: string) {
  return text.split("\n").map(escapeBlockStart).join("\n");
}

function wrapMark(value: string, before: string, after: string) {
  return value
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!match) return line;
      const [, lead, core, trail] = match;
      return core === "" ? line : `${lead}${before}${core}${after}${trail}`;
    })
    .join("\n");
}

function inlineToMarkdown(nodes: Node[]): string {
  return nodes
    .map((node) => {
      if (node.nodeType === "hyperlink") {
        const uri = safeUri(node.data?.uri);
        const label = inlineToMarkdown(node.content ?? []);
        return uri ? `[${label}](${uri})` : label;
      }

      let text = escapeInline(node.value ?? "");
      if (text === "") return "";

      const marks = new Set((node.marks ?? []).map((mark) => mark.type));
      if (marks.has("code")) text = wrapMark(text, "`", "`");
      if (marks.has("bold")) text = wrapMark(text, "**", "**");
      if (marks.has("italic")) text = wrapMark(text, "_", "_");
      if (marks.has("underline")) text = wrapMark(text, "++", "++");
      return text;
    })
    .join("");
}

export function documentToMarkdown(document: unknown): string {
  const doc = document as RichTextDocument | null | undefined;
  if (!doc || doc.nodeType !== "document") return "";

  const blocks: string[] = [];

  const renderList = (node: Node, ordered: boolean) => {
    (node.content ?? []).forEach((item, index) => {
      const marker = ordered ? `${index + 1}.` : "-";
      const text = (item.content ?? [])
        .map((child) => inlineToMarkdown(child.content ?? []))
        .join(" ")
        .trim();
      blocks.push(`${marker} ${text}`);
    });
    blocks.push("");
  };

  for (const node of doc.content ?? []) {
    switch (node.nodeType) {
      case "embedded-asset-block": {
        const id = node.data?.target?.sys?.id;
        if (id) blocks.push(assetMarker(id), "");
        break;
      }
      case "heading-1":
      case "heading-2":
      case "heading-3":
      case "heading-4":
      case "heading-5":
      case "heading-6": {
        const level = Number(node.nodeType.slice(-1));
        blocks.push(`${"#".repeat(level)} ${inlineToMarkdown(node.content ?? [])}`, "");
        break;
      }
      case "unordered-list":
        renderList(node, false);
        break;
      case "ordered-list":
        renderList(node, true);
        break;
      case "blockquote":
        blocks.push(
          (node.content ?? [])
            .map((child) => `> ${inlineToMarkdown(child.content ?? [])}`)
            .join("\n"),
          ""
        );
        break;
      case "hr":
        blocks.push("---", "");
        break;
      default:
        blocks.push(escapeBlock(inlineToMarkdown(node.content ?? [])), "");
    }
  }

  return blocks
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
}

const text = (value: string, marks: string[] = []): Node => ({
  nodeType: "text",
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
} as Node);

function markKey(node: Node) {
  return (node.marks ?? [])
    .map((mark) => mark.type)
    .sort()
    .join(",");
}

function mergeText(nodes: Node[]): Node[] {
  const out: Node[] = [];

  for (const node of nodes) {
    if (node.nodeType === "hyperlink") {
      out.push({ ...node, content: mergeText(node.content ?? []) });
      continue;
    }

    const last = out[out.length - 1];
    if (
      node.nodeType === "text" &&
      last &&
      last.nodeType === "text" &&
      markKey(last) === markKey(node)
    ) {
      last.value = (last.value ?? "") + (node.value ?? "");
      continue;
    }

    out.push({ ...node });
  }

  return out;
}

function parseInline(source: string, marks: string[] = []): Node[] {
  const nodes: Node[] = [];
  const pattern =
    /\\([\s\S])|\[((?:[^[\]\\]|\\.)*)\]\(((?:[^()\s]|\([^()]*\))*)\)|\*\*((?:[^*\\]|\\.)+?)\*\*|\+\+((?:[^+\\]|\\.)+?)\+\+|\*((?:[^*\\]|\\.)+?)\*|_((?:[^_\\]|\\.)+?)_|`([^`]+)`/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > cursor) nodes.push(text(source.slice(cursor, match.index), marks));

    const [, escaped, linkText, linkUri, bold1, underline, italic1, italic2, code] = match;
    if (escaped !== undefined) {
      nodes.push(text(escaped, marks));
    } else if (linkUri !== undefined) {
      const uri = safeUri(linkUri);
      if (uri) {
        nodes.push({
          nodeType: "hyperlink",
          data: { uri },
          content: parseInline(linkText, marks),
        } as Node);
      } else {
        nodes.push(...parseInline(linkText, marks));
      }
    } else if (bold1 !== undefined) {
      nodes.push(...parseInline(bold1, [...marks, "bold"]));
    } else if (underline !== undefined) {
      nodes.push(...parseInline(underline, [...marks, "underline"]));
    } else if (italic1 !== undefined || italic2 !== undefined) {
      nodes.push(...parseInline((italic1 ?? italic2) as string, [...marks, "italic"]));
    } else if (code !== undefined) {
      nodes.push(text(code, [...marks, "code"]));
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) nodes.push(text(source.slice(cursor), marks));
  return mergeText(nodes.length > 0 ? nodes : [text("", marks)]);
}

const paragraph = (source: string): Node => ({
  nodeType: "paragraph",
  data: {},
  content: parseInline(source),
});

const listItem = (source: string): Node => ({
  nodeType: "list-item",
  data: {},
  content: [paragraph(source)],
});

export function markdownToDocument(markdown: string): RichTextDocument {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const content: Node[] = [];

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === "") {
      index += 1;
      continue;
    }

    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      content.push({ nodeType: "hr", data: {}, content: [] } as Node);
      index += 1;
      continue;
    }

    const asset = trimmed.match(ASSET_MARKER);
    if (asset) {
      content.push({
        nodeType: "embedded-asset-block",
        data: { target: { sys: { type: "Link", linkType: "Asset", id: asset[2] } } },
        content: [],
      } as Node);
      index += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      content.push({
        nodeType: `heading-${heading[1].length}`,
        data: {},
        content: parseInline(heading[2]),
      } as Node);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoted: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoted.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      content.push({
        nodeType: "blockquote",
        data: {},
        content: quoted.map(paragraph),
      } as Node);
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/;
    const numbered = /^\d+[.)]\s+(.*)$/;

    if (bullet.test(trimmed) || numbered.test(trimmed)) {
      const ordered = numbered.test(trimmed);
      const pattern = ordered ? numbered : bullet;
      const items: string[] = [];

      while (index < lines.length) {
        const candidate = lines[index].trim();
        const itemMatch = candidate.match(pattern);
        if (!itemMatch) break;
        items.push(itemMatch[1]);
        index += 1;
      }

      content.push({
        nodeType: ordered ? "ordered-list" : "unordered-list",
        data: {},
        content: items.map(listItem),
      } as Node);
      continue;
    }

    const buffer: string[] = [];
    while (index < lines.length && lines[index].trim() !== "") {
      const candidate = lines[index].trim();
      if (
        /^#{1,6}\s/.test(candidate) ||
        /^>\s?/.test(candidate) ||
        bullet.test(candidate) ||
        numbered.test(candidate) ||
        /^-{3,}$/.test(candidate) ||
        ASSET_MARKER.test(candidate)
      ) {
        break;
      }
      buffer.push(lines[index]);
      index += 1;
    }
    content.push(paragraph(buffer.join("\n")));
  }

  return { nodeType: "document", data: {}, content };
}
