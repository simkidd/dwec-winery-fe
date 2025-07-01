import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Enjoy massive discounts on selected summer items",
      image: "/images/summer-sale.jpg",
      cta: "Shop Now",
      link: "/products?category=summer",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Styles",
      description: "Discover our latest collection for the season",
      image: "/images/new-arrivals.jpg",
      cta: "Explore",
      link: "/products?new=true",
      bgColor: "bg-pink-50",
    },
    {
      id: 3,
      title: "Limited Time",
      subtitle: "Flash Sale",
      description: "Hurry! Offers end soon",
      image: "/images/flash-sale.jpg",
      cta: "Grab Deals",
      link: "/sale",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Special Offers
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Don&apos;t miss out on these exclusive deals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg ${offer.bgColor}`}
          >
            <div className="h-48 relative">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{offer.title}</h3>
                <span className="text-sm font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                  {offer.subtitle}
                </span>
              </div>
              <p className="text-muted-foreground mb-4">{offer.description}</p>
              <Button asChild variant="secondary">
                <Link href={offer.link}>{offer.cta}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/offers">View All Offers</Link>
        </Button>
      </div>
    </section>
  );
};

export default SpecialOffers;