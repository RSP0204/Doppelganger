import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/registry/new-york-v4/ui/accordion';

const Faqs = () => {
    return (
        <section className="py-20 text-center bg-white">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="w-full max-w-4xl mx-auto mt-8">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it easy to set up?</AccordionTrigger>
                        <AccordionContent>
                            Yes, it's very easy. You can connect your meeting platform in just a few clicks.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What meeting platforms do you support?</AccordionTrigger>
                        <AccordionContent>
                            We support all major meeting platforms, including Zoom, Google Meet, and Microsoft Teams.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is my data secure?</AccordionTrigger>
                        <AccordionContent>
                            Yes, we take data security very seriously. All your data is encrypted and stored securely.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};

export default Faqs;
