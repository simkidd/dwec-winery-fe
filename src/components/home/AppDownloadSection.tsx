"use client";
import { motion } from "framer-motion";
import { Apple, GooglePlay } from "iconsax-reactjs";
import Image from "next/image";

const AppDownloadSection = () => {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
          {/* Left Column - Phone Mockup with Animated Blobs */}
          <div className="relative w-full max-w-md hidden lg:block">
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
              className="relative mx-auto h-[250px]"
            >
              <Image
                src="/images/iphone-crop.png"
                alt="DWEC WINERY Mobile App"
                width={300}
                height={100}
                className="drop-shadow-2xl w-full h-full object-contain"
              />
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="max-w-xl mx-auto text-center lg:text-left py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-4 sm:text-3xl"
            >
              Shop Premium Drinks On The Go
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-4"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
