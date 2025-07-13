"use client";
import { Check, GooglePlay, Apple } from "iconsax-reactjs";
import Image from "next/image";
import { motion } from "framer-motion";

const AppDownloadSection = () => {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 pt-16 pb-16 lg:pb-0 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Phone Mockup with Animated Blobs */}
          <div className="relative w-full max-w-md">
            <div className="absolute -top-8 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>

            <motion.div
              initial={{ scale: 0.98 }}
              whileInView={{ scale: 1 }}
              transition={{
                duration: 3,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className="relative mx-auto "
            >
              <Image
                src="/images/dwec-iphone-hand-mockup.png"
                alt="DWEC WINERY Mobile App"
                width={500}
                height={560}
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 500px"
                className="drop-shadow-2xl z-10 relative w-full h-auto"
              />
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="max-w-xl text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 sm:text-4xl"
            >
              Shop Premium Drinks On The Go
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground mb-8"
            >
              Download our app for exclusive offers, faster checkout, and
              personalized recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#"
                className="bg-black dark:bg-stone-900 text-white hover:bg-stone-800 dark:hover:bg-stone-800 transition-colors px-6 py-3 rounded-[50px] flex items-center justify-center gap-2"
              >
                <Apple size="24" variant="Bold" />
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-medium">App Store</p>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.dwecwinery.app"
                target="_blank"
                className="bg-black dark:bg-stone-900 text-white hover:bg-stone-800 dark:hover:bg-stone-800 transition-colors px-6 py-3 rounded-[50px] flex items-center justify-center gap-2"
              >
                <GooglePlay size="24" variant="Bold" />
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-medium">Google Play</p>
                </div>
              </a>
            </motion.div>

            {/* App Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-2 gap-4"
            >
              {[
                "Exclusive App-Only Deals",
                "Fingerprint Login",
                "Order Tracking",
                "Tasting Notes",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-wrap text-left">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
