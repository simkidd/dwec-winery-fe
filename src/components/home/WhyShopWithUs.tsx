import { BadgePercent, Clock, Gem, Shield, Truck } from "lucide-react";

const WhyShopWithUs = () => {
  const benefits = [
    {
      icon: <Gem className="h-7 w-7" />,
      title: "Premium Quality",
      description:
        "100% authentic wines, whiskeys, and spirits — carefully sourced for the best taste.",
    },
    {
      icon: <BadgePercent className="h-7 w-7" />,
      title: "Best Prices",
      description:
        "Luxury made affordable. Enjoy top-tier drinks at competitive rates.",
    },
    {
      icon: <Clock className="h-7 w-7" />,
      title: "24/7 Support",
      description: "Available round the clock via call or WhatsApp.",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Secure Payments",
      description: "Trusted, encrypted payment options for your safety.",
    },
    {
      icon: <Truck className="h-7 w-7" />,
      title: "Fast Delivery",
      description: "Same-day delivery within Rivers State.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">
            Why Choose DWEC WINERY?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Excellence in every bottle, service beyond expectations
          </p>
        </div>

        {/* Dynamic Grid with Intentional Grouping */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* First 3 cards get full height */}
          <div className="space-y-8 sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {benefits.slice(0, 3).map((benefit, index) => (
              <FeatureCard key={index} {...benefit} />
            ))}
          </div>

          {/* Last 2 cards in a separate row */}
          <div className="sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-8">
            {benefits.slice(3).map((benefit, index) => (
              <FeatureCard key={index + 3} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable card component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:border-primary/20">
    <div className="bg-primary/10 p-3.5 rounded-full mb-5 text-primary">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

export default WhyShopWithUs;
