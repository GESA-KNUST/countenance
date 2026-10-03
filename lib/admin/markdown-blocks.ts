export const ASSET_LINE = /^!\[([^\]]*)\]\(asset:([A-Za-z0-9._-]{1,64})\)$/;
export const IMAGE_LINE = /^!\[([^\]]*)\]\((\/\/[^)\s]+|https?:\/\/[^)\s]+)\)$/;

export type Block =
  | { key: number; kind: "text"; text: string }
  | { key: number; kind: "image"; id: string; url?: string };

let blockKey = 0;

export function nextKey() {
  blockKey += 1;
  return blockKey;
}

export function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").replace(/^\n+|\n+$/g, "");
    if (text !== "") blocks.push({ key: nextKey(), kind: "text", text });
    buffer = [];
  };

  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const asset = line.trim().match(ASSET_LINE);
    const direct = asset ? null : line.trim().match(IMAGE_LINE);
    if (asset) {
      flush();
      blocks.push({ key: nextKey(), kind: "image", id: asset[2] });
    } else if (direct) {
      flush();
      blocks.push({ key: nextKey(), kind: "image", id: "", url: direct[2] });
    } else {
      buffer.push(line);
    }
  }
  flush();

  if (blocks.length === 0 || blocks.every((block) => block.kind === "image")) {
    blocks.push({ key: nextKey(), kind: "text", text: "" });
  }
  return blocks;
}

export function serializeBlocks(blocks: Block[]): string {
  return blocks
    .map((block) =>
      block.kind === "image"
        ? block.url
          ? `![](${block.url})`
          : `![](asset:${block.id})`
        : block.text
    )
    .filter((part, _index, all) => part !== "" || all.length === 1)
    .join("\n\n");
}
