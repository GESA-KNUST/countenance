'use client';
import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const update = () => setIsMobile(query.matches);

        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, [breakpoint]);

    return isMobile;
}
