import { safeUri, type RichTextDocument } from "./richtext";

export interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

export interface TipTapDoc {
  type: "doc";
  content: TipTapNode[];
}

export const ASSET_IMAGE = "assetImage";

interface CfMark {
  type: string;
}

interface CfNode {
  nodeType: string;
  value?: string;
  marks?: CfMark[];
  data?: { uri?: string; target?: { sys: { type: string; linkType: string; id: string } } };
  content?: CfNode[];
}

function inlineToTipTap(nodes: CfNode[], link?: string): TipTapNode[] {
  const out: TipTapNode[] = [];

  for (const node of nodes) {
    if (node.nodeType === "hyperlink") {
      const uri = safeUri(node.data?.uri);
      out.push(...inlineToTipTap(node.content ?? [], uri || link));
      continue;
    }

    const value = node.value ?? "";
    if (value === "") continue;

    const marks: TipTapMark[] = (node.marks ?? []).map((mark) => ({ type: mark.type }));
    if (link) marks.push({ type: "link", attrs: { href: link } });

    out.push(marks.length > 0 ? { type: "text", text: value, marks } : { type: "text", text: value });
  }

  return out;
}

const paragraphOf = (node: CfNode): TipTapNode => {
  const content = inlineToTipTap(node.content ?? []);
  return content.length > 0 ? { type: "paragraph", content } : { type: "paragraph" };
};

function blockToTipTap(node: CfNode): TipTapNode | null {
  const heading = node.nodeType.match(/^heading-([1-6])$/);
  if (heading) {
    const content = inlineToTipTap(node.content ?? []);
    return {
      type: "heading",
      attrs: { level: Number(heading[1]) },
      ...(content.length > 0 ? { content } : {}),
    };
  }

  switch (node.nodeType) {
    case "paragraph":
      return paragraphOf(node);

    case "unordered-list":
    case "ordered-list":
      return {
        type: node.nodeType === "ordered-list" ? "orderedList" : "bulletList",
        content: (node.content ?? []).map((item) => ({
          type: "listItem",
          content: (item.content ?? []).map(paragraphOf),
        })),
      };

    case "blockquote":
      return {
        type: "blockquote",
        content: (node.content ?? []).map(paragraphOf),
      };

    case "hr":
      return { type: "horizontalRule" };

    case "embedded-asset-block": {
      const id = node.data?.target?.sys?.id;
      return id ? { type: ASSET_IMAGE, attrs: { assetId: id } } : null;
    }

    default:
      return paragraphOf(node);
  }
}

export function documentToTipTap(document: unknown): TipTapDoc {
  const doc = document as RichTextDocument | null | undefined;
  const content: TipTapNode[] = [];

  if (doc && doc.nodeType === "document") {
    for (const node of doc.content ?? []) {
      const mapped = blockToTipTap(node as CfNode);
      if (mapped) content.push(mapped);
    }
  }

  if (content.length === 0) content.push({ type: "paragraph" });
  return { type: "doc", content };
}

const cfText = (value: string, marks: string[]): CfNode => ({
  nodeType: "text",
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
});

function inlineToCf(nodes: TipTapNode[]): CfNode[] {
  const out: CfNode[] = [];

  for (const node of nodes) {
    if (node.type !== "text" || !node.text) continue;

    const marks = node.marks ?? [];
    const href = safeUri(
      marks.find((mark) => mark.type === "link")?.attrs?.href as string | undefined
    );
    const others = marks.filter((mark) => mark.type !== "link").map((mark) => mark.type);
    const leaf = cfText(node.text, others);

    if (!href) {
      out.push(leaf);
      continue;
    }

    const last = out[out.length - 1];
    if (last && last.nodeType === "hyperlink" && last.data?.uri === href) {
      last.content = [...(last.content ?? []), leaf];
    } else {
      out.push({ nodeType: "hyperlink", data: { uri: href }, content: [leaf] });
    }
  }

  return out;
}

const cfParagraph = (node: TipTapNode): CfNode => ({
  nodeType: "paragraph",
  data: {},
  content: inlineToCf(node.content ?? []),
});

function blockToCf(node: TipTapNode): CfNode | null {
  switch (node.type) {
    case "paragraph":
      return cfParagraph(node);

    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      return {
        nodeType: `heading-${level >= 1 && level <= 6 ? level : 2}`,
        data: {},
        content: inlineToCf(node.content ?? []),
      };
    }

    case "bulletList":
    case "orderedList":
      return {
        nodeType: node.type === "orderedList" ? "ordered-list" : "unordered-list",
        data: {},
        content: (node.content ?? []).map((item) => ({
          nodeType: "list-item",
          data: {},
          content: (item.content ?? []).map(cfParagraph),
        })),
      };

    case "blockquote":
      return {
        nodeType: "blockquote",
        data: {},
        content: (node.content ?? []).map(cfParagraph),
      };

    case "horizontalRule":
      return { nodeType: "hr", data: {}, content: [] };

    case ASSET_IMAGE: {
      const id = node.attrs?.assetId;
      return typeof id === "string" && id
        ? {
            nodeType: "embedded-asset-block",
            data: { target: { sys: { type: "Link", linkType: "Asset", id } } },
            content: [],
          }
        : null;
    }

    default:
      return null;
  }
}

export function tipTapToDocument(doc: TipTapDoc | null | undefined): RichTextDocument {
  const content: CfNode[] = [];

  for (const node of doc?.content ?? []) {
    const mapped = blockToCf(node);
    if (mapped) content.push(mapped);
  }

  return { nodeType: "document", data: {}, content } as RichTextDocument;
}
