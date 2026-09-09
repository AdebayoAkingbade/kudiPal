import Image from "next/image";
import { Star } from "lucide-react";

export function Testimonials() {
    const reviews = [
        {
            name: "Adebayo O.",
            role: "Retail Store Owner",
            text: "KudiPal saved me from hiring an accountant. It automatically tracks my sales and tells me exactly what to restock.",
            img: "/images/avatar-adebayo.png",
        },
        {
            name: "Chioma K.",
            role: "Restaurant Manager",
            text: "I used to spend 5 hours a week on spreadsheets. Now I just take pictures of receipts and get a report on WhatsApp.",
            img: "/images/avatar-chioma.png",
        },
        {
            name: "Tunde B.",
            role: "Logistics CEO",
            text: "The credit readiness score is a game changer. I finally got approved for a loan after months of rejection.",
            img: "/images/avatar-tunde.png",
        },
    ];

    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Trusted by Nigerian SMBs
                    </h2>
                    <div className="flex justify-center gap-1 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
                    </div>
                    <p className="text-gray-400">Join over 500 businesses growing with KudiPal</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {`"${review.text}"`}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm flex-shrink-0">
                                    <Image
                                        src={review.img}
                                        alt={review.name}
                                        width={48}
                                        height={48}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{review.name}</p>
                                    <p className="text-sm text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
