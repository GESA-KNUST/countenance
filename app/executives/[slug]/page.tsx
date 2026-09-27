import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getExecutiveBySlug,
  getExecutives,
  executiveSlug,
  hasProfile,
} from '@/lib/data/executive';
import ExecutiveProfile from '@/components/executives/ExecutiveProfile';

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
  const image = executive.officialImage?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: image
        ? [{ url: `${image}?w=1200&h=630&fit=fill&f=face&fm=jpg&q=80`, width: 1200, height: 630, alt: executive.fullName }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [`${image}?w=1200&h=630&fit=fill&f=face&fm=jpg&q=80`] : [],
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
