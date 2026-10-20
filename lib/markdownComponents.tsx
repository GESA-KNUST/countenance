import type { Components } from 'react-markdown';
import { safeHref } from './richTextOptions';

export const markdownComponents: Components = {
    p: (props) => <p className="mb-6 leading-relaxed text-gray-700 text-lg" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-6 flex flex-col gap-2 text-gray-700 text-lg" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-6 flex flex-col gap-2 text-gray-700 text-lg" {...props} />,
    li: (props) => <li className="mb-2 pl-2 leading-relaxed [&>p]:mb-0" {...props} />,

    h1: (props) => <h2 className="font-header font-bold text-2xl text-[#252638] mt-10 mb-4" {...props} />,
    h2: (props) => <h2 className="font-header font-bold text-2xl text-[#252638] mt-10 mb-4" {...props} />,
    h3: (props) => <h3 className="font-header font-bold text-xl text-[#252638] mt-8 mb-3" {...props} />,
    h4: (props) => <h4 className="font-header font-semibold text-lg text-[#252638] mt-6 mb-2" {...props} />,
    h5: (props) => <h5 className="font-header font-semibold text-base text-[#252638] mt-6 mb-2" {...props} />,
    h6: (props) => <h6 className="font-header font-semibold text-base text-[#252638] mt-6 mb-2" {...props} />,

    strong: (props) => <strong className="font-bold text-[#252638]" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    code: (props) => <code className="bg-gray-100 rounded px-1.5 py-0.5 text-[0.9em]" {...props} />,
    hr: () => <hr className="my-10 border-gray-200" />,

    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-[#FFBE00] bg-[#FFBE00]/5 rounded-r-lg pl-5 pr-4 py-3 my-6 italic text-gray-700 [&>p]:mb-0"
            {...props}
        />
    ),

    a: ({ href, children, ...rest }) => {
        const safe = safeHref(href);
        if (!safe) return <>{children}</>;
        return (
            <a
                href={safe}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[#252638] underline decoration-[#FFBE00] decoration-2 underline-offset-2 hover:text-black"
                {...rest}
            >
                {children}
            </a>
        );
    },
};
