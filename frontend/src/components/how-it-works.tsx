const HowItWorks = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <div className="container grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Step 1: Connect</h3>
                    <p className="mt-2 text-muted-foreground">Connect your meeting platform.</p>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Step 2: Analyze</h3>
                    <p className="mt-2 text-muted-foreground">AI listens and analyzes transcripts live.</p>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Step 3: Prompt</h3>
                    <p className="mt-2 text-muted-foreground">Get smart, context-aware prompts and questions.</p>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Step 4: Improve</h3>
                    <p className="mt-2 text-muted-foreground">Drive better conversations and outcomes.</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
