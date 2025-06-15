import React from "react";
import { MapPin, Phone, Mail, Clock, Wine } from "lucide-react";
import { Apple, Facebook, GooglePlay, Heart, Instagram } from "iconsax-reactjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wine className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DWEC Drinks</span>
            </div>
            <p className="text-gray-300">
              Your premium destination for cocktails, wines, and spirits.
              Bringing you the finest selection since 1985.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
                <span className="sr-only">Facebook</span>
                <Facebook variant="Bold" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
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
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-primary transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/cocktails"
                  className="text-gray-300 hover:text-primary transition"
                >
                  Cocktails
                </Link>
              </li>
              <li>
                <Link
                  href="/mixers"
                  className="text-gray-300 hover:text-primary transition"
                >
                  Mixers
                </Link>
              </li>
              <li>
                <Link
                  href="/exclusive"
                  className="text-gray-300 hover:text-primary transition"
                >
                  Exclusive Editions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-primary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-gray-300">
                  456 Beverage Blvd, New York, NY 10001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-gray-300">+1 (212) 555-0199</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-gray-300">support@dwecdrinks.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-gray-300">Mon-Sun: 9AM - 10PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter & App Download */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Get Exclusive Deals
              </h3>
              <p className="text-gray-300 mb-4">
                Subscribe for special discounts, new arrivals, and cocktail
                recipes.
              </p>
              <form className="flex flex-col space-y-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="border border-gray-500 rounded-sm focus-visible:border-primary focus-visible:ring-0"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold">Download the App</h3>
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={"#"}
                  className="flex items-center justify-center border border-gray-700 bg-gray-800 shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-gray-700 transition"
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
                  className="flex items-center justify-center border border-gray-700 bg-gray-800 shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-gray-700 transition"
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
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} DWEC Drinks. All rights
              reserved.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
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
              className="text-gray-400 hover:text-primary text-sm transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary text-sm transition"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary text-sm transition"
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
