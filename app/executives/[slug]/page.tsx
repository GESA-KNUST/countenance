import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getExecutiveBySlug,
  getExecutives,
  currentAcademicYear,
  executiveSlug,
  hasProfile,
  isCurrentYear,
  positionLabel,
  tenureSentence,
} from '@/lib/data/executive';
import ExecutiveProfile from '@/components/executives/ExecutiveProfile';
import { executivePersonSchema } from '@/lib/seo/executive-schema';
import { ogImage } from '@/lib/data/og-image';
import { extractText } from '@/lib/extractText';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [executive, executives] = await Promise.all([getExecutiveBySlug(slug), getExecutives()]);

  if (!executive || !hasProfile(executive)) return { title: 'Executive not found' };

  const current = currentAcademicYear(executives);

  const title = `${executive.fullName} | ${positionLabel(executive, current)} (${executive.academicYear})`;

  const bio = extractText(executive.bio?.json as Parameters<typeof extractText>[0]).trim();
  const tenure = tenureSentence(executive, current);
  const description = bio
    ? `${tenure} ${bio.slice(0, 160).trimEnd()}${bio.length > 160 ? '...' : ''}`
    : tenure;
  const share = ogImage(executive.officialImage?.url, executive.fullName, 'face');
  const path = `/executives/${executiveSlug(executive)}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: path,
      images: share,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: share.map((image) => image.url),
    },
  };
}

export async function generateStaticParams() {
  const executives = await getExecutives();
  return executives.filter(hasProfile).map((executive) => ({ slug: executiveSlug(executive) }));
}

const ExecutiveProfilePage = async ({ params }: Props) => {
  const { slug } = await params;
  const executive = await getExecutiveBySlug(slug);
  if (!executive || !hasProfile(executive)) notFound();

  const executives = await getExecutives();
  const current = currentAcademicYear(executives);
  const serving = isCurrentYear(executive.academicYear, current);

  const colleagues = executives
    .filter(
      (other) =>
        other.academicYear === executive.academicYear &&
        other.sys.id !== executive.sys.id &&
        hasProfile(other)
    )
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(executivePersonSchema(executive, current)),
        }}
      />
      <ExecutiveProfile executive={executive} colleagues={colleagues} isCurrent={serving} />
    </>
  );
};

export default ExecutiveProfilePage;
