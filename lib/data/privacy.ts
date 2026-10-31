export type PolicySection = { heading: string; paragraphs?: string[]; items?: string[] };

export const PRIVACY_EMAIL = 'thegesaknust@gmail.com';
export const PRIVACY_UPDATED = '31 October 2026';
export const HUB_PRIVACY_URL = 'https://goh.gesaknust.com/privacy';

export const privacySections: PolicySection[] = [
    {
        heading: 'Who we are',
        paragraphs: [
            'This website, gesaknust.com, is run by the Ghana Engineering Students\' Association (GESA) of the College of Engineering, Kwame Nkrumah University of Science and Technology (KNUST).',
            'This policy covers gesaknust.com and the GESA Opportunities Hub (GOH) at goh.gesaknust.com, including signing in to either with Google.',
        ],
    },
    {
        heading: 'Information we collect on gesaknust.com',
        items: [
            'Contact form: your first and last name, email address, phone number (if you give it) and your message.',
            'Writing for the blog: when you sign in with Google to contribute, your name and email address, and the article, summary, cover photo and tags you submit.',
            'Basic technical information our hosting provider records to run and protect the site, such as IP address and browser type.',
        ],
        paragraphs: ['Browsing the public pages does not require an account, and we do not use advertising or tracking cookies.'],
    },
    {
        heading: 'Signing in with Google',
        paragraphs: [
            'When you choose to sign in with Google on gesaknust.com or on GOH, Google shares your name, email address and, on GOH, your profile picture. We use these only to sign you in, to show your name on articles you write, and to check that you are allowed to use the part of the site you are signing in to. We keep them only while you use that part of the site. We do not receive your Google password and we do not access your Gmail, contacts, files or any other Google data.',
            'Our use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.',
        ],
    },
    {
        heading: 'How we use your information',
        items: [
            'To reply to messages you send us.',
            'To review, edit and publish articles you submit, under your name.',
            'To run the GESA Opportunities Hub, as described below.',
            'To keep our services secure and prevent abuse.',
        ],
        paragraphs: ['We do not sell your information, use it for advertising, or share it with advertisers.'],
    },
    {
        heading: 'GESA Opportunities Hub',
        paragraphs: [
            'GOH helps students of the College of Engineering find competitions, events, scholarships and internships, and connects them with industry partners. To do this it stores account details (name, email, student ID, programme, year group and phone number), profile details you add, the posts you save or register for, messages you send, and phone alert settings if you turn alerts on. Course reps can see the class list details of their coursemates and whether they have seen class posts.',
            `The full GOH privacy policy, with details of what it collects, who can see it and how long it is kept, is at ${HUB_PRIVACY_URL}.`,
        ],
    },
    {
        heading: 'Who we share it with',
        items: [
            'Service providers that run our websites for us: Vercel (hosting gesaknust.com), Contentful (storing site content and articles), EmailJS (delivering contact form messages to our inbox), Cloudflare (hosting GOH), Google (sign-in) and Resend (GOH password reset emails). They use the data only to provide these services.',
            'Readers of the blog see the name on articles you choose to publish.',
            'Authorities, if the law requires it.',
        ],
    },
    {
        heading: 'How long we keep it',
        items: [
            'Contact form messages are kept in our email inbox for as long as they are needed to deal with your request.',
            'Published articles stay up until you or GESA ask for them to be taken down. Articles we decide not to publish are never shown on the site, and are deleted on request.',
            'GOH student accounts are deleted after your class completes Year 4 (from 1 August), and partner accounts are kept while they are in use, as described in the GOH policy.',
        ],
    },
    {
        heading: 'Your choices and rights',
        items: [
            'Ask us for a copy of the information we hold about you.',
            'Ask us to correct it, or to delete it and take down anything you have published.',
            'Stop using Google sign-in at any time by removing access in your Google Account under Security, then Third-party apps.',
        ],
        paragraphs: [`To make a request, email ${PRIVACY_EMAIL}.`],
    },
    {
        heading: 'Security',
        paragraphs: [
            'Our websites use HTTPS, sign-in sessions are signed so they cannot be forged, and access to personal information is limited to the people and services that need it.',
        ],
    },
    {
        heading: 'Changes and contact',
        paragraphs: [
            `If we change this policy, we will update the date at the top of this page. For any privacy question, contact GESA-KNUST at ${PRIVACY_EMAIL}.`,
        ],
    },
];
