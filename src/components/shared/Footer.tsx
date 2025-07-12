import { Apple, Facebook, GooglePlay, Instagram } from "iconsax-reactjs";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedLink } from "./AnimatedLink";

const Footer = () => {
  return (
    <footer className="bg-[#020618] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-14">
                <Image
                  src={"/logo/logo-white.png"}
                  alt=""
                  width={300}
                  height={300}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <p className="text-sm">
              DWEC WINERY is Port Harcourt&apos;s leading destination for
              premium, authentic wines and spirits - delivering luxury at the
              best prices, with 24/7 customer support, secure payment options,
              and fast same-day delivery across Rivers State.
            </p>
            <div className="flex space-x-4 ">
              <a
                href="#"
                className="hover:text-white/80 transition duration-300 ease-in-out"
              >
                <span className="sr-only">Facebook</span>
                <Facebook variant="Bold" />
              </a>
              <a
                href="#"
                className="hover:text-white/80 transition duration-300 ease-in-out"
              >
                <span className="sr-only">Instagram</span>
                <Instagram variant="Bold" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 text-sm">
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
                  href="/contact-us"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  Contact
                </AnimatedLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 text-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <AnimatedLink
                  href="https://www.google.com/maps/place/86A+Woji+Road,+Elechi,+Port+Harcourt+500271,+Rivers"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    86A Woji Road, GRA Phase 2, Port Harcourt, Rivers State
                  </span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 " />
                <AnimatedLink
                  href="tel:+2347036254646"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>+234 703 625 4646</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 " />
                <AnimatedLink
                  href="tel:+2348058232688"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>+234 805 823 2688</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 " />
                <AnimatedLink
                  href="mailto:dwecwinery@gmail.com"
                  className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-white to-white"
                >
                  <span>dwecwinery@gmail.com</span>
                </AnimatedLink>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 " />
                <p>Open 24 Hours</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-3"></div>
          {/* Newsletter & App Download */}
          <div className="lg:col-span-2 justify-end space-y-6">
            {/* <div>
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
                  className="rounded-sm focus-visible:ring-0 placeholder:text-white/80"
                  required
                />
                <Button type="submit" className="cursor-pointer">
                  Subscribe
                </Button>
              </form>
            </div> */}

            <div className="flex flex-col">
              <h3 className="font-semibold">Download Our App</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={"#"}
                  target="_blank"
                  className="flex items-center justify-center border border-white bg-transparent shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-foreground/20 transition duration-300 ease-in-out"
                >
                  <Apple size="32" variant="Bold" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold">
                      Download on the
                    </span>
                    <p className="font-semibold">App Store</p>
                  </div>
                </a>
                <a
                  href={
                    "https://play.google.com/store/apps/details?id=com.dwecwinery.app"
                  }
                  target="_blank"
                  className="flex items-center justify-center border border-white bg-transparent shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1 hover:bg-foreground/20 transition duration-300 ease-in-out"
                >
                  <GooglePlay size="32" variant="Bold" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold">
                      Download on the
                    </span>
                    <p className="font-semibold">Play Store</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-t-gray-500 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className=" text-sm">
              &copy; {new Date().getFullYear()} DWEC Drinks. All rights
              reserved.
            </p>
            {/* <div className="flex items-center  text-sm">
              Built with
              <Heart size="18" color="red" variant="Bold" className="mx-1" />
              by
              <a
                href="#"
                className="ml-1 hover:underline hover:underline-offset-2"
              >
                24karat
              </a>
            </div> */}
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
