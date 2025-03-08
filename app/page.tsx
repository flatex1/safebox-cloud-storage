import dynamic from "next/dynamic";
import { HeroContent } from "./_components/landing-page/hero-content";
import { FeaturesSection } from "./_components/landing-page/features-section";
import { Pricing } from "./_components/landing-page/pricing";
import Particles from "@/components/magicui/particles";

const Spline = dynamic(() => import('@splinetool/react-spline'), {
    ssr: true,
});

export default function LandingPage() {

    return (
        <div className="w-full relative overflow-hidden">
            <div className="container mx-auto relative">
                <div className="flex lg:py-6 items-center justify-center flex-col relative">

                    <div className="flex flex-col lg:flex-row w-full items-center">
                        <HeroContent />

                        <div className="w-fit lg:visible invisible lg:block hidden">
                            <Spline scene="https://prod.spline.design/QXQQb8Plnn9syzym/scene.splinecode" />
                        </div>

                        <Particles
                            className="absolute inset-0 z-0 lg:visible invisible lg:block hidden"
                            quantity={80}
                            ease={80}
                            color={"#000"}
                            refresh
                        />
                    </div>

                </div>

                <FeaturesSection />

                <Pricing />
            </div>
        </div>
    );
}