import { Button } from '@/registry/new-york-v4/ui/button';
import HowItWorks from '@/components/how-it-works';
import KeyBenefits from '@/components/key-benefits';
import LiveDemo from '@/components/live-demo';
import CustomerTestimonials from '@/components/customer-testimonials';
import Pricing from '@/components/pricing';
import Faqs from '@/components/faqs';
import FinalCta from '@/components/final-cta';
import Footer from '@/components/footer';

const Page = () => {
    return (
        <div className="bg-background text-foreground">
            <main>
                <section className="text-center py-20 hero-gradient text-white">
                    <h1 className="text-5xl font-bold">Have Smarter Meetings with AI by Your Side</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Your real-time AI meeting companion that helps you ask the right questions, uncover hidden insights, and make every conversation count.
                    </p>
                    <div className="mt-8 space-x-4">
                        <Button size="lg" variant="gradient">Try It Free</Button>
                        <Button size="lg" variant="gradient">Book a Demo</Button>
                    </div>
                </section>
                <HowItWorks />
                <KeyBenefits />
                <LiveDemo />
                <CustomerTestimonials />
                <Pricing />
                <Faqs />
                <FinalCta />
            </main>
            <Footer />
        </div>
    );
};

export default Page;