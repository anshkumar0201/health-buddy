import HeroJourney from "../components/HeroJourney"
import HeroStats from "../components/HeroStats"
import Features from "../components/Features"
import WhyChoose from "../components/WhyChoose"
import CTASection from "../components/CTASection"

export default function HomePage() {
    return (
        <div className="relative">
            <HeroJourney />
            <HeroStats />
            <Features />
            <WhyChoose />
            <CTASection />
        </div>
    )
}
