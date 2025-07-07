import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Us</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We are a passionate team dedicated to creating innovative solutions that empower our users.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Our mission is to build a world where technology seamlessly integrates with everyday life, making complex tasks simple and intuitive. We strive to create products that are not only powerful but also a joy to use.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Our Story</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Founded in 2023, our company started with a small team of enthusiasts who shared a common vision. We have since grown into a diverse group of designers, developers, and strategists, all working together to bring our ideas to life. Our journey has been one of continuous learning and adaptation, and we are excited to see what the future holds.
                        </p>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-3xl font-bold text-center">Meet the Team</h2>
                    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="text-center">
                            <Avatar className="mx-auto h-24 w-24">
                                <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Team Member 1" />
                                <AvatarFallback>TM1</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-bold">Team Member 1</h3>
                            <p className="text-muted-foreground">Co-Founder & CEO</p>
                        </div>
                        <div className="text-center">
                            <Avatar className="mx-auto h-24 w-24">
                                <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Team Member 2" />
                                <AvatarFallback>TM2</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-bold">Team Member 2</h3>
                            <p className="text-muted-foreground">Co-Founder & CTO</p>
                        </div>
                        <div className="text-center">
                            <Avatar className="mx-auto h-24 w-24">
                                <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Team Member 3" />
                                <AvatarFallback>TM3</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-bold">Team Member 3</h3>
                            <p className="text-muted-foreground">Lead Designer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;