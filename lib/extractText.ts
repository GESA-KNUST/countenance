interface RichTextNode {
  nodeType?: string;
  value?: string;
  content?: RichTextNode[];
}

/** Recursively flattens a Contentful rich-text document into plain text. */
export const extractText = (node: RichTextNode): string => {
  if (node.nodeType === 'text') {
    return node.value ?? '';
  }
  if (node.content) {
    return node.content.map((child) => extractText(child)).join('');
  }
  return '';
};
