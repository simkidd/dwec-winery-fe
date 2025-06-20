import { ArrowRightCircle, Clock, Fingerprint, Stars } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: ArrowRightCircle,
      title: "Fast Delivery",
      description: "Get your order quickly",
    },
    {
      icon: Fingerprint,
      title: "Secure Payment",
      description: "100% protected payments",
    },
    {
      icon: Stars,
      title: "Premium Quality",
      description: "Top-notch products",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always here to help",
    },
  ];

  return (
    <div className="bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-3">
                  <Icon size={48} />
                </div>
                <h3 className="font-medium text-lg leading-[1.5rem]">{feature.title}</h3>
                <p className="">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
