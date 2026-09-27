import { randomUUID } from "node:crypto";
import { LOCALE, UPLOAD_BASE, chunk, cma, managementToken } from "./cma";

export interface UploadedAsset {
  id: string;
  url: string;
  fileName: string;
}

function assetIdFor(fileName: string) {
  const stem = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 40);
  return `${stem || "image"}-${randomUUID().slice(0, 8)}`;
}

export async function uploadAsset(
  bytes: ArrayBuffer,
  fileName: string,
  contentType: string
): Promise<UploadedAsset> {
  const id = assetIdFor(fileName);

  const upload = await fetch(`${UPLOAD_BASE}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${managementToken()}`,
      "Content-Type": "application/octet-stream",
    },
    body: bytes,
  });
  if (!upload.ok) {
    throw new Error(`upload ${fileName} -> ${upload.status} ${await upload.text()}`);
  }
  const { sys: uploadSys } = await upload.json();

  const draft = await cma(`/assets/${id}`, {
    method: "PUT",
    body: {
      fields: {
        title: { [LOCALE]: fileName.replace(/\.[^.]+$/, "") },
        description: { [LOCALE]: "" },
        file: {
          [LOCALE]: {
            fileName,
            contentType,
            uploadFrom: { sys: { type: "Link", linkType: "Upload", id: uploadSys.id } },
          },
        },
      },
    },
  });

  await cma(`/assets/${id}/files/${LOCALE}/process`, {
    method: "PUT",
    version: draft.sys.version,
  });

  let processed = null;
  let waited = 0;
  for (let attempt = 0; attempt < 14 && waited < 15000; attempt += 1) {
    const pause = attempt < 4 ? 400 : 1500;
    await new Promise((resolve) => setTimeout(resolve, pause));
    waited += pause;
    processed = await cma(`/assets/${id}`);
    if (processed?.fields?.file?.[LOCALE]?.url) break;
    processed = null;
  }
  if (!processed) throw new Error(`Image ${fileName} did not finish processing in time`);

  const published = await cma(`/assets/${id}/published`, {
    method: "PUT",
    version: processed.sys.version,
  });
  if (!published?.sys?.publishedVersion) {
    throw new Error(`Image ${fileName} uploaded but could not be published`);
  }

  return { id, url: `https:${processed.fields.file[LOCALE].url}`, fileName };
}

export async function assetUrls(ids: string[]): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  if (ids.length === 0) return urls;

  for (const batch of chunk(ids, 100)) {
    const assets = await cma(`/assets?sys.id[in]=${batch.join(",")}&limit=100`);
    for (const asset of assets?.items ?? []) {
      const url = asset.fields?.file?.[LOCALE]?.url;
      if (url) urls.set(asset.sys.id, `https:${url}`);
    }
  }
  return urls;
}

export async function assertPublishedAsset(id: string) {
  const asset = await cma(`/assets/${id}`);
  if (!asset) throw new Error(`Image ${id} does not exist`);
  if (!asset.sys.publishedVersion) throw new Error(`Image ${id} is not published`);
  if (!asset.fields?.file?.[LOCALE]?.url) throw new Error(`Image ${id} has no file`);
}
