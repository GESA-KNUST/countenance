export const Log = (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args);
    }
};

export const LogError = (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(...args);
    }
};
