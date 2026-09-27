'use client';
import { useFetchData } from './useFetchData';
import { contentfulClient } from '@/lib/contentful-client';
import {
    GET_SITE_CONTACT,
    SITE_CONTACT_FALLBACK,
    resolveSiteContact,
    type SiteContact,
} from '@/lib/data/site-contact';

export const useSiteContact = (initial?: SiteContact): SiteContact => {
    const { data } = useFetchData<SiteContact>({
        queryKey: ['site-contact'],
        queryFn: async () => resolveSiteContact(await contentfulClient.request(GET_SITE_CONTACT)),
        initialData: initial,
        placeholderData: initial ?? SITE_CONTACT_FALLBACK,
    });

    return data ?? initial ?? SITE_CONTACT_FALLBACK;
};
