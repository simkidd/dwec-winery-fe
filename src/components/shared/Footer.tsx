import React from "react";
import { MapPin, Phone, Mail, Clock, Wine } from "lucide-react";
import { Apple, Facebook, GooglePlay, Heart, Instagram } from "iconsax-reactjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AnimatedLink } from "./AnimatedLink";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wine className="h-8 w-8 " />
              <span className="text-2xl font-bold">DWEC Drinks</span>
            </div>
            <p>
              Your premium destination for cocktails, wines, and spirits.
              Bringing you the finest selection since 1985.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition">
                <span className="sr-only">Facebook</span>
                <Facebook variant="Bold" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <span className="sr-only">Instagram</span>
                <Instagram variant="Bold" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <AnimatedLink
                  href="/about"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  About Us
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href="/cocktails"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  Cocktails
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href="/mixers"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  Mixers
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href="/exclusive"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  Exclusive Editions
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href="/contact"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  Contact
                </AnimatedLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5  mt-0.5" />
                <AnimatedLink
                  href="tel:+647474"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>456 Beverage Blvd, New York, NY 10001</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 " />
                <AnimatedLink
                  href="tel:+647474"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>+1 (212) 555-0199</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 " />
                <AnimatedLink
                  href="mailto:suport@gmail.com"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>support@dwecdrinks.com</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 " />
                <p>Mon-Sun: 9AM - 10PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter & App Download */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Get Exclusive Deals
              </h3>
              <p className="mb-4">
                Subscribe for special discounts, new arrivals, and cocktail
                recipes.
              </p>
              <form className="flex flex-col space-y-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="border rounded-sm focus-visible:border-white/90 focus-visible:ring-0 placeholder:text-white/80"
                  required
                />
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="cursor-pointer "
                >
                  Subscribe
                </Button>
              </form>
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold">Download Our App</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  href={"#"}
                  className="flex items-center justify-center border border-white bg-transparent shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-foreground/20 transition duration-300 ease-in-out"
                >
                  <Apple size="32" variant="Bold" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold">
                      Download on the
                    </span>
                    <p className="font-semibold">App Store</p>
                  </div>
                </Link>
                <Link
                  href={"#"}
                  className="flex items-center justify-center border border-white bg-transparent shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-foreground/20 transition duration-300 ease-in-out"
                >
                  <GooglePlay size="32" variant="Bold" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold">
                      Download on the
                    </span>
                    <p className="font-semibold">Play Store</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className=" text-sm">
              &copy; {new Date().getFullYear()} DWEC Drinks. All rights
              reserved.
            </p>
            <div className="flex items-center  text-sm">
              Built with
              <Heart size="18" color="red" variant="Bold" className="mx-1" />
              by
              <a
                href="#"
                className="ml-1 hover:underline hover:underline-offset-2"
              >
                24karat
              </a>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className=" hover:underline hover:underline-offset-2 text-sm transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className=" hover:underline hover:underline-offset-2 text-sm transition"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className=" hover:underline hover:underline-offset-2 text-sm transition"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
