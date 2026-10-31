export type PolicySection = { heading: string; paragraphs?: string[]; items?: string[] };

export const PRIVACY_EMAIL = 'thegesaknust@gmail.com';
export const PRIVACY_UPDATED = '31 October 2026';

export const privacySections: PolicySection[] = [
    {
        heading: 'Who we are',
        paragraphs: [
            'This website, gesaknust.com, and the GESA Opportunities Hub at goh.gesaknust.com are run by the Ghana Engineering Students\' Association (GESA) of the College of Engineering, KNUST.',
        ],
    },
    {
        heading: 'What we receive from Google',
        paragraphs: ['When you choose to sign in with Google, Google shares only:'],
        items: ['Your name', 'Your email address', 'Your profile picture'],
    },
    {
        heading: 'How we use it',
        paragraphs: [
            'We use this information only to sign you in, to show your name where you take part (for example on articles you write), and to check that you are allowed to use the part of the site you are signing in to.',
            'We do not receive your Google password, and we do not access your Gmail, contacts, files or any other Google data.',
            'Our use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.',
        ],
    },
    {
        heading: 'What we never do',
        items: [
            'We do not sell your information.',
            'We do not use it for advertising or share it with advertisers.',
        ],
    },
    {
        heading: 'Contacting us through the website',
        paragraphs: ['If you send us a message, we use what you send only to reply to you.'],
    },
    {
        heading: 'Keeping and deleting your information',
        paragraphs: [
            'We keep your information only while you use our services. You can ask us for a copy, ask us to correct it, or ask us to delete it at any time. You can also remove our access in your Google Account under Security, then Third-party apps.',
        ],
    },
    {
        heading: 'Contact',
        paragraphs: [`For any privacy question or request, email ${PRIVACY_EMAIL}. If we change this policy, we will update the date at the top of this page.`],
    },
];
