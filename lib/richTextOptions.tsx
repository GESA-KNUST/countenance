import { BLOCKS } from '@contentful/rich-text-types';
import React, { ReactNode } from 'react';

export const richTextParagraphRenderer = {
    [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => {
        return <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>;
    },
    [BLOCKS.TABLE]: (node: any, children: ReactNode) => (
        <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse">
                <tbody className="bg-white">
                    {children}
                </tbody>
            </table>
        </div>
    ),
    [BLOCKS.TABLE_ROW]: (node: any, children: ReactNode) => (
        <tr className="hover:bg-gray-50 transition-colors">
            {children}
        </tr>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: ReactNode) => (
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-r border-gray-200 last:border-r-0">
            {children}
        </th>
    ),
    [BLOCKS.TABLE_CELL]: (node: any, children: ReactNode) => (
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 leading-relaxed border-b border-r border-gray-200 last:border-r-0">
            {children}
        </td>
    ),
};
