import { ImpactStats } from "./ImpactStats";
import { AchievementsShowcase } from "./ShowCase/ShowCase";
import { SuccessStories } from "./SuccessStories";

const OurWork = () => {
  return (
    <div className="min-h-screen w-full bg-white" id="ourWork">
      <section className="bg-gradient-to-b from-blue-200 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Work
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how we are making a difference through healthcare, clean
            environments, and essential supplies for those in need
          </p>
        </div>
      </section>
      <ImpactStats />
      <AchievementsShowcase />
      <SuccessStories />
    </div>
  );
};

export default OurWork;
