"use client";
import { BadgePercent, Clock, Gem, Shield, Truck } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Why Choose DWEC WINERY?
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            Excellence in every bottle, service beyond expectations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className=""
        >
          <motion.div className="flex flex-col lg:flex-row gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-1"
              >
                <FeatureCard {...benefit} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white dark:bg-stone-800 p-7 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center border border-stone-200 dark:border-stone-700 hover:border-primary/30 h-full">
    <div className="bg-primary/10 p-3.5 rounded-full mb-5 text-primary dark:text-primary-400">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-stone-100">
      {title}
    </h3>
    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default WhyShopWithUs;
