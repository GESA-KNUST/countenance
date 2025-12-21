export const extractText = (node: any): string => {
    if (node.nodeType === 'text') {
      return node.value;
    }
    if (node.content) {
      return node.content.map((child: any) => extractText(child)).join('');
    }
    return '';
  }