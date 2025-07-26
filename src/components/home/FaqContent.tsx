"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  Truck,
  Wine,
  Star,
  ShoppingCart,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

// Define types for better TypeScript support
interface FAQQuestion {
  question: string;
  answer: string | React.ReactNode;
  searchableText?: string; // For search functionality
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: FAQQuestion[];
}

const FaqContent = () => {
  const [activeTab, setActiveTab] = useState("dwec");
  const [searchQuery, setSearchQuery] = useState("");

  const faqData: FAQCategory[] = [
    {
      id: "dwec",
      title: "About DWEC Winery",
      icon: <Star className="w-5 h-5" />,
      questions: [
        {
          question: "What is DWEC WINERY?",
          answer:
            "DWEC WINERY is a premium online and offline platform offering a curated selection of wines, spirits, champagne, and non-alcoholic beverages. We are committed to delivering excellent service, 24/7 availability, and top-quality products tailored to every lifestyle and occasion.",
        },
        {
          question: "Where is DWEC WINERY located?",
          answer:
            "Our physical store is located at: DWEC WINERY, 86A Woji Road, GRA Phase 2, Port Harcourt, Rivers State, Nigeria.",
        },
        {
          question: "How do I contact DWEC WINERY?",
          answer: (
            <div>
              <p>You can reach us through:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Phone/WhatsApp: +2347 03625 4646, +2348 05823 2688</li>
                <li>
                  Store Visit: DWEC WINERY, 86A Woji Road, GRA Phase 2, PHC,
                  Rivers State
                </li>
                <li>Email: dwecwinery@gmail.com web: www.dwec.ng</li>
                <li>Social Media: Instagram & TikTok @dwecwinery</li>
              </ul>
            </div>
          ),
          searchableText:
            "Phone WhatsApp +2347 03625 4646 +2348 05823 2688 Store Visit DWEC WINERY 86A Woji Road GRA Phase 2 PHC Rivers State Email dwecwinery@gmail.com www.dwec.ng Social Media Instagram TikTok @dwecwinery",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery & Shipping",
      icon: <Truck className="w-5 h-5" />,
      questions: [
        {
          question: "Do you deliver?",
          answer:
            "Yes, we offer fast and reliable delivery within and outside of Rivers State. Same-day delivery is available depending on your location and the time of order.",
        },
        {
          question: "Do you ship outside Rivers State?",
          answer:
            "Yes, we deliver nationwide. Please contact us directly to discuss possibilities.",
        },
      ],
    },
    {
      id: "products",
      title: "Product Information",
      icon: <Wine className="w-5 h-5" />,
      questions: [
        {
          question: "What types of products do you offer?",
          answer: (
            <div>
              <p>Our categories include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Wines: Red, White, Rosé, Sparkling, Dessert</li>
                <li>Champagne</li>
                <li>Whiskey: Scotch, Bourbon, Single-Malt</li>
                <li>Cognac & Brandy</li>
                <li>Vodka</li>
                <li>Rum</li>
                <li>Tequila & Gin</li>
                <li>Liqueurs & Aperitifs</li>
                <li>Non-Alcoholic Beverages: Juices, sodas, cocktail mixers</li>
              </ul>
            </div>
          ),
          searchableText:
            "Wines Red White Rosé Sparkling Dessert Champagne Whiskey Scotch Bourbon Single-Malt Cognac Brandy Vodka Rum Tequila Gin Liqueurs Aperitifs Non-Alcoholic Beverages Juices sodas cocktail mixers",
        },
        {
          question: "Is there an age restriction?",
          answer:
            "Yes. In compliance with Nigerian law, customers must be 18 years or older to purchase alcoholic beverages from DWEC WINERY.",
        },
      ],
    },
    {
      id: "ordering",
      title: "Orders & Payments",
      icon: <ShoppingCart className="w-5 h-5" />,
      questions: [
        {
          question: "How can I place an order?",
          answer: (
            <div>
              <p>You can order through any of the following:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Call/WhatsApp: +2347 03625 4646, +2348 05823 2688</li>
                <li>Visit our store at the address above</li>
                <li>Connect via social media Instagram, Twitter @dwecwinery</li>
              </ul>
            </div>
          ),
          searchableText:
            "Call WhatsApp +2347 03625 4646 +2348 05823 2688 Visit store social media Instagram Twitter @dwecwinery",
        },
        {
          question: "What payment methods do you accept?",
          answer: (
            <div>
              <p>We accept:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Bank transfers</li>
                <li>POS payments (in-store)</li>
                <li>Mobile money</li>
                <li>Cash (on delivery, where applicable)</li>
              </ul>
            </div>
          ),
          searchableText:
            "Bank transfers POS payments in-store Mobile money Cash delivery",
        },
        {
          question: "What is your return policy?",
          answer:
            "Returns are accepted if the product is damaged, defective, or incorrect. Returns must be initiated within 24 hours of delivery or upon delivery. Please refer to our full Return Policy for details.",
        },
        {
          question: "Can I request gift packaging or custom orders?",
          answer:
            "Yes! We offer custom gift bundles, luxury packaging, and hampers for personal and corporate occasions. Contact us directly for tailored packages.",
        },
        {
          question: "Do you offer corporate or bulk orders?",
          answer:
            "Absolutely. We serve individual clients, corporate customers, event planners, club, lounges, hotels, and restaurants. Bulk and wholesale options are available with competitive pricing.",
        },
        {
          question: "Do you offer discounts or loyalty programs?",
          answer:
            "Yes! We regularly provide seasonal offers, loyalty rewards, and referral incentives. Follow us on social media @dwecwinery.",
        },
      ],
    },
    // {
    //   id: "services",
    //   title: "Services & Special Orders",
    //   icon: <Gift className="w-5 h-5" />,
    //   questions: [

    //   ],
    // },
  ];

  // Helper function to get searchable text from answer
  const getSearchableText = (item: FAQQuestion): string => {
    if (item.searchableText) {
      return item.searchableText;
    }
    return typeof item.answer === "string" ? item.answer : "";
  };

  const filteredQuestions = searchQuery
    ? faqData.flatMap((category) =>
        category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getSearchableText(q)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      )
    : faqData.find((cat) => cat.id === activeTab)?.questions || [];

  return (
    <div className="container mx-auto px-6 py-16">
      <motion.div
        className="bg-white dark:bg-stone-800 rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Search Bar */}
        <div className="p-8 border-b border-stone-200 dark:border-stone-700">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search our knowledge base..."
              className="w-full px-6 py-3 pr-14 rounded-xl border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-stone-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-6 border-b border-stone-200 dark:border-stone-700 no-scrollbar">
          {faqData.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveTab(category.id);
                setSearchQuery("");
              }}
              className={`flex items-center px-8 py-5 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === category.id && !searchQuery
                  ? "border-primary text-primary"
                  : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <span className="mr-3">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="divide-y divide-stone-200 dark:divide-stone-700">
          <AnimatePresence>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, index) => (
                <FAQItem
                  key={
                    searchQuery ? `search-${index}` : `${activeTab}-${index}`
                  }
                  question={item.question}
                  answer={item.answer}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center"
              >
                <p className="text-stone-500 dark:text-stone-400">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : "No questions available in this category"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Premium Concierge CTA */}
      <motion.div
        className="mt-16 bg-gradient-to-br from-stone-800 to-stone-900 p-10 rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-primary/20 rounded-full p-3 mb-4">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Premium Concierge Service
          </h3>
          <p className="text-stone-300 mb-6 max-w-2xl mx-auto">
            Our wine specialists provide personalized recommendations, rare
            vintage sourcing, and event planning services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size={"lg"}>
              <a
                href="tel:+2347003392946"
                className="inline-flex items-center justify-center gap-3 px-8 text-white rounded-lg hover:bg-primary/90 transition-colors text-lg"
              >
                <Phone className="w-5 h-5" />
                Call Concierge
              </a>
            </Button>
            <Button asChild size={"lg"} variant={"outline"}>
              <a
                href="mailto:info@dwecwinery.ng"
                className="inline-flex items-center justify-center gap-3 px-8   rounded-lg hover:bg-stone-700/50 transition-colors text-lg"
              >
                <Mail className="w-5 h-5" />
                Email Request
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string | React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      className="border-b border-stone-200 dark:border-stone-700 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-8 text-left hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors"
      >
        <h3 className="font-medium text-lg md:text-xl">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-stone-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 text-stone-600 dark:text-stone-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqContent;
