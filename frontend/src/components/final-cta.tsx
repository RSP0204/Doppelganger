import { Button } from '@/registry/new-york-v4/ui/button';

const FinalCta = () => {
    return (
        <section className="py-20 text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h2 className="text-4xl font-bold">Start Having Smarter Meetings Today!</h2>
            <div className="mt-8 space-x-4">
                <Button size="lg">Get Started Free</Button>
                <Button size="lg" variant="outline">Contact Sales</Button>
            </div>
        </section>
    );
};

export default FinalCta;
