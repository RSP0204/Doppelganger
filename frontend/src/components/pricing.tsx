import { Button } from '@/registry/new-york-v4/ui/button';

const Pricing = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold">Pricing</h2>
            <div className="container grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-8 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <h3 className="text-2xl font-semibold">Free Trial</h3>
                    <p className="mt-4 text-4xl font-bold">$0</p>
                    <p className="mt-2 text-sm text-muted-foreground">for 14 days</p>
                    <Button className="mt-8">Start Free Trial</Button>
                </div>
                <div className="p-8 transition-shadow duration-300 border-2 rounded-lg shadow-md border-primary hover:shadow-xl">
                    <h3 className="text-2xl font-semibold">Pro</h3>
                    <p className="mt-4 text-4xl font-bold">$49</p>
                    <p className="mt-2 text-sm text-muted-foreground">per month</p>
                    <Button className="mt-8">Get Started</Button>
                </div>
                <div className="p-8 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <h3 className="text-2xl font-semibold">Enterprise</h3>
                    <p className="mt-4 text-4xl font-bold">Contact Us</p>
                    <p className="mt-2 text-sm text-muted-foreground">for a custom quote</p>
                    <Button className="mt-8">Contact Sales</Button>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
