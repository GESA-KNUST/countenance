import Hero from '../../components/executives/Hero';
import Intro from '../../components/executives/Intro';
import ExecutiveMarquee from '../../components/executives/ExecutiveMarquee';
import CurrentLeadership from '../../components/executives/CurrentLeadership';
import ExecutivesBrowser from '../../components/executives/ExecutivesBrowser';
import {
  getExecutives,
  currentAcademicYear,
  executiveCountsByYear,
  executivesForYear,
  sortAcademicYears,
} from '@/lib/data/executive';
import { currentExecutivesListSchema } from '@/lib/seo/executive-schema';
import ExecutivesError from '../../components/executives/ExecutivesError';

const ExecutivesPage = async () => {
  const executives = await getExecutives();

  const academicYears = sortAcademicYears([
    ...new Set(executives.map((executive) => executive.academicYear)),
  ]);
  const countsByYear = executiveCountsByYear(executives);
  const currentYear = currentAcademicYear(executives);
  const currentExecutives = executivesForYear(executives, currentYear);

  if (executives.length === 0) {
    return <ExecutivesError />;
  }

  return (
    <div>
      {currentExecutives.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(currentExecutivesListSchema(executives, currentYear)),
          }}
        />
      )}

      <Hero />
      <ExecutiveMarquee executives={currentExecutives} isLoading={false} year={currentYear} />
      <Intro />
      <CurrentLeadership executives={currentExecutives} year={currentYear} />
      <section id="executives" className="scroll-mt-4">
        <ExecutivesBrowser
          executives={executives}
          academicYears={academicYears}
          countsByYear={countsByYear}
          currentYear={currentYear}
        />
      </section>
    </div>
  );
};

export default ExecutivesPage;
