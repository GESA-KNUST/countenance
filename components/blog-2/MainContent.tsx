'use client';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import SkeletonLoading from './SkeletonLoading';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { richTextParagraphRenderer } from '@/lib/richTextOptions';

const MainContent = ({ selectedPost }) => {

  if (!selectedPost) return <SkeletonLoading />;

  const getTags = () => {
    if (!selectedPost.tags) return [];
    if (Array.isArray(selectedPost.tags)) return selectedPost.tags;
    if (typeof selectedPost.tags === 'object' && Array.isArray(selectedPost.tags.tags)) {
      return selectedPost.tags.tags;
    }
    return [];
  };

  const tags = getTags();

  const assetMap = new Map();
  if (selectedPost.blogContent?.links?.assets?.block) {
    selectedPost.blogContent.links.assets.block.forEach((asset) => {
      assetMap.set(asset.sys.id, asset);
    });
  }
  if (selectedPost.blogContent?.links?.assets?.hyperlink) {
    selectedPost.blogContent.links.assets.hyperlink.forEach((asset) => {
      assetMap.set(asset.sys.id, asset);
    });
  }

  const entryMap = new Map();
  if (selectedPost.blogContent?.links?.entries?.inline) {
    selectedPost.blogContent.links.entries.inline.forEach((entry) => {
      entryMap.set(entry.sys.id, entry);
    });
  }

  const renderAsset = (node) => {
    const assetId = node.data.target.sys.id;
    const asset = assetMap.get(assetId);

    if (asset) {
      const imageUrl = asset.url.startsWith('//') ? `https:${asset.url}` : asset.url;

      return (
        <figure className="my-10 w-full mb-10">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
            <Image
              src={imageUrl}
              alt={asset.description || asset.title || 'Blog Image'}
              width={asset.width || 1200}
              height={asset.height || 800}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
            />
          </div>
          {asset.description && (
            <figcaption className="text-sm text-gray-500 mt-3 text-center italic font-medium">
              {asset.description}
            </figcaption>
          )}
        </figure>
      );
    }
    return null;
  };

  const richTextOptions = {
    renderNode: {
      ...richTextParagraphRenderer,
      [BLOCKS.EMBEDDED_ASSET]: renderAsset,
      [INLINES.EMBEDDED_ENTRY]: (node) => {
        return null;
      }
    },
  };

  return (
    <div className="w-full xl:w-2/3">
      <section className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <p className="font-bold text-sm uppercase text-primary" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {selectedPost.author.name}
          </p>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div className="relative mb-4">
          <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-foreground max-w-3xl font-header">
            {selectedPost.title}
          </h1>
          {selectedPost.hook && <p className="text-lg text-muted-foreground mt-4">{selectedPost.hook}</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {tags.map((tag, index) => {
            const tagContent = typeof tag === 'string' ? tag : tag.title;
            if (!tagContent) return null;
            return (
              <span key={index} className="bg-primary/10 text-primary text-sm font-medium px-2.5 py-0.5 rounded-full">
                {tagContent}
              </span>
            );
          })}
        </div>
        <div className="relative w-[50px] h-1 bg-primary mt-4 mx-auto">
          <div className="absolute top-0 right-full mr-2 w-1 h-1 bg-primary rounded-full"></div>
        </div>
      </section>
      <div className="relative w-full mb-8 overflow-hidden rounded-2xl shadow-lg border border-gray-100">
        <Image
          src={selectedPost.headerImage.url}
          alt={selectedPost.headerImage.description || selectedPost.title}
          width={800}
          height={574}
          className="w-full h-auto"
        />
      </div>

      <div className="text-foreground text-lg leading-8">{documentToReactComponents(selectedPost.blogContent.json, richTextOptions)}</div>

      <div className="flex items-center gap-4 mt-4">
        {/* Social Links */}
        <Image src="/images/logo.svg" alt="logo" width={100} height={24} />
        <div className="h-10">
          <Separator orientation="vertical" className="w-full" />
        </div>
        <div className="flex gap-2">
          <Link href="https://whatsapp.com/channel/0029Vb6ndaFDeON4BBZULN0A">
            <Image src="/images/whatsapp2.svg" alt="WhatsApp" width={40} height={40} />
          </Link>
          <Link href="https://x.com/thegesaknust?s=11">
            <Image src="/images/twitter.svg" alt="Twitter" width={40} height={40} />
          </Link>
          <Link href="https://youtube.com/@knust-college_of_engineering?si=jtCCfu6aXxDdSXid">
            <Image src="/images/yt.svg" alt="YouTube" width={40} height={40} />
          </Link>
          <Link href="https://www.linkedin.com/company/gesa-knust/">
            <Image src="/images/linkedin2.svg" alt="LinkedIn" width={40} height={40} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainContent
