import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
    p: (props) => <p className="mb-6 leading-relaxed text-gray-700 text-lg" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-6 text-gray-700 text-lg" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-6 text-gray-700 text-lg" {...props} />,
    li: (props) => <li className="mb-2 pl-2" {...props} />,
};
