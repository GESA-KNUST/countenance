const MESSAGES: Record<string, string> = {
    signin: 'That sign in did not finish. Please try again.',
    domain: 'Please use your KNUST student account to write for the blog.',
    setup: 'Sign in is not switched on yet. Please tell the GESA team.',
};

const SignInPanel = ({ configured, error }: { configured: boolean; error: string }) => (
    <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="font-header text-2xl font-bold text-[#252638]">Ready to write?</h2>
            <p className="mt-3 text-gray-600">
                Sign in and the editor opens straight away. You pick your own photo once, and it
                stays on every article you write.
            </p>

            {error && MESSAGES[error] && (
                <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {MESSAGES[error]}
                </p>
            )}

            {configured ? (
                <a
                    href="/api/contribute/auth/start"
                    className="mt-8 inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-[#252638] hover:shadow-md"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 4.75 12 4.75Z"
                        />
                    </svg>
                    Continue with Google
                </a>
            ) : (
                <p className="mt-8 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Sign in is not switched on yet. Please tell the GESA team.
                </p>
            )}
        </div>
    </div>
);

export default SignInPanel;
