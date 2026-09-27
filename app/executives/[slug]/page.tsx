import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getExecutiveBySlug,
  getExecutives,
  executiveSlug,
  hasProfile,
} from '@/lib/data/executive';
import ExecutiveProfile from '@/components/executives/ExecutiveProfile';
import { ogImage } from '@/lib/data/og-image';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const executive = await getExecutiveBySlug(slug);

  if (!executive || !hasProfile(executive)) return { title: 'Executive not found' };

  const title = `${executive.fullName} | ${executive.executivePositionHeld}`;
  const description =
    executive.quote?.trim() ||
    `${executive.fullName} served as ${executive.executivePositionHeld} of GESA-KNUST in ${executive.academicYear}.`;
  const share = ogImage(executive.officialImage?.url, executive.fullName, 'face');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
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
  const colleagues = executives
    .filter(
      (other) =>
        other.academicYear === executive.academicYear &&
        other.sys.id !== executive.sys.id &&
        hasProfile(other)
    )
    .slice(0, 3);

  return <ExecutiveProfile executive={executive} colleagues={colleagues} />;
};

export default ExecutiveProfilePage;
