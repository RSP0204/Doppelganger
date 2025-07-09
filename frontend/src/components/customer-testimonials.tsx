const CustomerTestimonials = () => {
    return (
        <section className="py-20 text-center bg-white">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <div className="flex justify-center mt-8 space-x-8 px-4">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <p className="italic">"This tool has transformed our client meetings. We're uncovering insights we never would have found otherwise."</p>
                    <p className="mt-4 font-semibold">- John Doe, Sales Manager</p>
                </div>
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <p className="italic">"I feel so much more confident in meetings. The AI prompts are incredibly helpful."</p>
                    <p className="mt-4 font-semibold">- Jane Smith, Consultant</p>
                </div>
            </div>
        </section>
    );
};

export default CustomerTestimonials;
