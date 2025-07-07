const KeyBenefits = () => {
    return (
        <section className="py-20 text-center bg-gray-50">
            <h2 className="text-3xl font-bold">Key Benefits</h2>
            <div className="container px-4 grid grid-cols-1 gap-8 mt-8 mx-auto md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Better Client Understanding</h3>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Uncover Unique Requirements</h3>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Make Every Participant Feel Heard</h3>
                </div>
                <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary">
                        {/* Icon placeholder */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold">Save Time on Note-Taking & Follow-Ups</h3>
                </div>
            </div>
        </section>
    );
};

export default KeyBenefits;
