"use client";
import { Apple, Facebook, GooglePlay, Instagram } from "iconsax-reactjs";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedLink } from "./AnimatedLink";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-100 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12"
        >
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="h-14"
                >
                  <Image
                    src={"/logo/logo-white.png"}
                    alt="DWEC WINERY Logo"
                    width={300}
                    height={300}
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              DWEC WINERY is Port Harcourt&apos;s premier destination for
              premium, authentic wines and spirits - delivering luxury at the
              best prices, with 24/7 customer support, secure payment options,
              and fast same-day delivery across Rivers State.
            </p>
            <div className="flex space-x-5">
              <motion.a
                href="#"
                className="text-stone-400 hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Facebook</span>
                <Facebook variant="Bold" size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-stone-400 hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Instagram</span>
                <Instagram variant="Bold" size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-stone-50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", text: "About Us" },
                { href: "/faqs", text: "FAQs" },
                { href: "/blog", text: "Blog" },
                { href: "/contact-us", text: "Contact Us" },
                { href: "/privacy-policy", text: "Privacy Policy" },
                { href: "#", text: "Return & Shopping Policy" },
                { href: "#", text: "Terms & Conditions" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AnimatedLink
                    href={link.href}
                    className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100"
                  >
                    {link.text}
                  </AnimatedLink>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-stone-50">
              Contact Us
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  ),
                  content: (
                    <AnimatedLink
                      href="https://www.google.com/maps/place/86A+Woji+Road,+Elechi,+Port+Harcourt+500271,+Rivers"
                      className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      86A Woji Road, GRA Phase 2, Port Harcourt, Rivers State
                    </AnimatedLink>
                  ),
                },
                {
                  icon: <Phone className="h-5 w-5 shrink-0 text-primary" />,
                  content: (
                    <AnimatedLink
                      href="tel:+2347036254646"
                      className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100"
                    >
                      +234 703 625 4646
                    </AnimatedLink>
                  ),
                },
                {
                  icon: <Phone className="h-5 w-5 shrink-0 text-primary" />,
                  content: (
                    <AnimatedLink
                      href="tel:+2348058232688"
                      className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100"
                    >
                      +234 805 823 2688
                    </AnimatedLink>
                  ),
                },
                {
                  icon: <Mail className="h-5 w-5 shrink-0 text-primary" />,
                  content: (
                    <AnimatedLink
                      href="mailto:dwecwinery@gmail.com"
                      className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100"
                    >
                      dwecwinery@gmail.com
                    </AnimatedLink>
                  ),
                },
                {
                  icon: <Clock className="h-5 w-5 text-primary" />,
                  content: (
                    <span className="text-stone-400">Open 24 Hours</span>
                  ),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item.icon}
                  <div>{item.content}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* App Download */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h3 className="font-semibold text-stone-50">Download Our App</h3>
              <p className="text-stone-400 text-sm mt-1 mb-4">
                Enjoy exclusive app-only deals and faster checkout
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    icon: <Apple size="24" variant="Bold" />,
                    label: "App Store",
                    href: "#",
                  },
                  {
                    icon: <GooglePlay size="24" variant="Bold" />,
                    label: "Play Store",
                    href: "https://play.google.com/store/apps/details?id=com.dwecwinery.app",
                  },
                ].map((app, index) => (
                  <motion.a
                    key={index}
                    href={app.href}
                    target="_blank"
                    className="flex items-center justify-center border border-stone-700 bg-stone-800/50 hover:bg-stone-800 w-[150px] h-[44px] rounded-full gap-2 transition-colors"
                  >
                    {app.icon}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium leading-none">
                        {index === 0 ? "Download on" : "Get it on"}
                      </span>
                      <span className="text-sm font-semibold">{app.label}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-stone-500 text-sm">
            &copy; {new Date().getFullYear()} DWEC Drinks. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {[
              { href: "/privacy-policy", text: "Privacy Policy" },
              { href: "#", text: "Terms of Service" },
            ].map((item, index) => (
              <div key={index}>
                <Link
                  href={item.href}
                  className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                >
                  {item.text}
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
