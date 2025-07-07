import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Button } from '@/registry/new-york-v4/ui/button';

const ContactPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We'd love to hear from you! Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input type="text" placeholder="Name" />
                            <Input type="email" placeholder="Email" />
                            <Textarea placeholder="Message" />
                            <Button>Send Message</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                <strong>Address:</strong> Pune, Maharashtra, India
                            </p>
                            <p className="text-muted-foreground">
                                <strong>Email:</strong> contact@doppelganger.com
                            </p>
                            <p className="text-muted-foreground">
                                <strong>Phone:</strong> +91 (555) 129-4567
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;