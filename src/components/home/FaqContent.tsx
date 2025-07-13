"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Gift, Mail, Phone, Truck, Wine } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const FaqContent = () => {
  const [activeTab, setActiveTab] = useState("delivery");
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      id: "delivery",
      title: "Delivery & Shipping",
      icon: <Truck className="w-5 h-5" />,
      questions: [
        {
          question: "What are your delivery options?",
          answer:
            "We offer same-day delivery for orders placed before 2pm in major cities, next-day delivery for other areas, and express 3-hour delivery for an additional fee.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 30 countries worldwide. International shipping rates and delivery times vary by destination.",
        },
      ],
    },
    {
      id: "products",
      title: "Product Information",
      icon: <Wine className="w-5 h-5" />,
      questions: [
        {
          question: "How do I verify a bottle's authenticity?",
          answer:
            "All our premium bottles feature holographic seals, batch numbers, and QR codes that can be scanned for verification through the producer's official system.",
        },
        {
          question: "What's your oldest vintage available?",
          answer:
            "Our collection includes rare vintages dating back to 1975 for select wines. Contact our sommelier for access to our vintage catalog.",
        },
      ],
    },
    {
      id: "services",
      title: "Services",
      icon: <Gift className="w-5 h-5" />,
      questions: [
        {
          question: "Do you offer corporate gifting?",
          answer:
            "Our concierge team creates custom corporate gift packages with branded messaging, starting from ₦500,000 with volume discounts available.",
        },
        {
          question: "Can I schedule recurring deliveries?",
          answer:
            "Yes, our subscription service offers weekly, bi-weekly, or monthly deliveries with 15% discount on all recurring orders.",
        },
      ],
    },
  ];

  const filteredQuestions = searchQuery
    ? faqData.flatMap((category) =>
        category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
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
                href="mailto:concierge@dwecwinery.com"
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
  answer: string;
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
