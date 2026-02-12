import SkeletonHeroJourney from "./SkeletonHeroJourney";
import SkeletonHeroStats from "./SkeletonHeroStats";
import SkeletonFeatures from "./SkeletonFeatures";
import SkeletonWhyChoose from "./SkeletonWhyChoose";
import SkeletonCTASection from "./SkeletonCTASection";

export default function SkeletonHomePage() {
  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* HERO */}
      <SkeletonHeroJourney />

      {/* STATS (overlap preserved automatically) */}
      <SkeletonHeroStats />

      {/* FEATURES */}
      <SkeletonFeatures />

      {/* WHY CHOOSE — plug in when ready */}
      <SkeletonWhyChoose />

      {/* CTA — plug in when ready */}
      <SkeletonCTASection />
    </div>
  );
}
