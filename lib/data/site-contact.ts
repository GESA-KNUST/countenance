import { gql } from "graphql-request";
import { requestTolerant } from "../contentful-client";
import { LogError } from "../logger";

export interface SiteContact {
  phone: string;
  email: string;
  whatsapp: string;
  x: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

export const SITE_CONTACT_FALLBACK: SiteContact = {
  phone: "+233 20 057 6468",
  email: "thegesaknust@gmail.com",
  whatsapp: "https://whatsapp.com/channel/0029Vb6ndaFDeON4BBZULN0A",
  x: "https://x.com/thegesaknust?s=11",
  instagram: "https://www.instagram.com/thegesaknust?igsh=MXhidHNqZndwYmdqMg==",
  linkedin: "https://www.linkedin.com/company/gesa-knust/",
  facebook: "",
};

export const GET_SITE_CONTACT = gql`
  query SiteContact {
    generalSiteContentCollection(limit: 1) {
      items {
        phone
        gesaEmail
        gesaWhatsappLink
        gesaTwitter
        gesaInstagramLink
        gesaLinkedInLink
        gesaFacebookLink
      }
    }
  }
`;

interface Response {
  generalSiteContentCollection: {
    items: {
      phone: string | null;
      gesaEmail: string | null;
      gesaWhatsappLink: string | null;
      gesaTwitter: string | null;
      gesaInstagramLink: string | null;
      gesaLinkedInLink: string | null;
      gesaFacebookLink: string | null;
    }[];
  };
}

export function resolveSiteContact(data: Response | null | undefined): SiteContact {
  const item = data?.generalSiteContentCollection?.items?.[0];
  if (!item) return SITE_CONTACT_FALLBACK;

  const pick = (value: string | null, fallback: string) =>
    value && value.trim() !== "" ? value.trim() : fallback;

  return {
    phone: pick(item.phone, SITE_CONTACT_FALLBACK.phone),
    email: pick(item.gesaEmail, SITE_CONTACT_FALLBACK.email),
    whatsapp: pick(item.gesaWhatsappLink, SITE_CONTACT_FALLBACK.whatsapp),
    x: pick(item.gesaTwitter, SITE_CONTACT_FALLBACK.x),
    instagram: pick(item.gesaInstagramLink, SITE_CONTACT_FALLBACK.instagram),
    linkedin: pick(item.gesaLinkedInLink, SITE_CONTACT_FALLBACK.linkedin),
    facebook: pick(item.gesaFacebookLink, SITE_CONTACT_FALLBACK.facebook),
  };
}

export async function getSiteContact(): Promise<SiteContact> {
  try {
    const data = await requestTolerant<Response>(GET_SITE_CONTACT);
    return resolveSiteContact(data);
  } catch (error) {
    LogError("[getSiteContact]", error);
    return SITE_CONTACT_FALLBACK;
  }
}
