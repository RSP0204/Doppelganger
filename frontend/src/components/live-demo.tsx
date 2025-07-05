import { Button } from '@/registry/new-york-v4/ui/button';

const LiveDemo = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold">See it in Action</h2>
            <div className="mt-8">
                {/* Placeholder for the video */}
                <div className="w-full max-w-4xl mx-auto bg-gray-300 h-96 rounded-lg"></div>
                <Button className="mt-8">Play Demo</Button>
            </div>
        </section>
    );
};

export default LiveDemo;
