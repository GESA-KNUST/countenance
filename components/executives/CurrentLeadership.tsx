import Link from 'next/link';
import { BadgeCheck, ArrowUpRight } from 'lucide-react';
import { type Executive, executiveSlug, hasProfile } from '@/lib/data/executive';

interface CurrentLeadershipProps {
  executives: Executive[];
  year: string | null;
}


const CurrentLeadership = ({ executives, year }: CurrentLeadershipProps) => {
  if (executives.length === 0) return null;

  const lead = executives[0];

  return (
    <section
      aria-labelledby="current-leadership-heading"
      className="bg-white px-6 pb-12 sm:px-12 sm:pb-14 md:px-16 lg:px-20"
    >
      <div className="mx-auto w-full max-w-7xl rounded-3xl border border-gray-200 bg-[#FAFAFB] p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-[#FFBE00]" />
          <p className="font-header text-xs font-bold uppercase tracking-[0.18em] text-[#B88900]">
            Current leadership{year ? ` · ${year}` : ''}
          </p>
        </div>

        <h2
          id="current-leadership-heading"
          className="mt-4 font-header text-2xl font-bold leading-tight text-[#252638] sm:text-3xl"
        >
          {year
            ? `The executives serving GESA-KNUST in ${year}`
            : 'The executives serving GESA-KNUST'}
        </h2>

        <p className="mt-3 max-w-3xl text-[1.0625rem] leading-[1.7] text-slate-700">
          {`As of the ${year ?? 'current'} academic year, the ${lead.executivePositionHeld} of the Ghana Engineering Students Association (GESA) at KNUST is ${lead.fullName}.`}{' '}
          {executives.length > 1
            ? `${lead.fullName} leads an executive body of ${executives.length} officers, listed in full below.`
            : ''}
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {executives.map((executive) => {
            const name = hasProfile(executive) ? (
              <Link
                href={`/executives/${executiveSlug(executive)}`}
                className="group inline-flex items-center gap-1 font-semibold text-[#252638] underline-offset-4 hover:underline"
              >
                {executive.fullName}
                <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 transition-transform group-hover:-translate-y-0.5" />
              </Link>
            ) : (
              <span className="font-semibold text-[#252638]">{executive.fullName}</span>
            );

            return (
              <div key={executive.sys.id} className="border-t border-gray-200 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {executive.executivePositionHeld}
                </dt>
                <dd className="mt-1 text-[1.0625rem]">{name}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default CurrentLeadership;
