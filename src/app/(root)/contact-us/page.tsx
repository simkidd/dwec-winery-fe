import { AnimatedLink } from "@/components/shared/AnimatedLink";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Metadata } from "next";
import ImageBg from "../../../../public/images/copy-space-with-full-bottle-wine.jpg"

const pageTitle = "Contact Us";

export const metadata: Metadata = {
  title: pageTitle,
};

const ContactUs = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Us",
      description: "Our friendly team is here to help.",
      details: "info@dwecwinery.ng",
      action: "mailto:info@dwecwinery.ng",
      type: "email",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Call Us",
      description: "Mon-Fri from 9am to 5pm",
      details: [
        {
          text: "+234 703 625 4646",
          href: "tel:+2347036254646",
        },
        {
          text: "+234 805 823 2688",
          href: "tel:+2348058232688",
        },
      ],
      type: "phone",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      details: "86A Woji Road, GRA Phase 2, Port Harcourt, Rivers State",
      action:
        "https://www.google.com/maps/place/86A+Woji+Road,+Elechi,+Port+Harcourt+500271,+Rivers",
      type: "address",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Hours",
      description: "Our operating hours",
      details: "Open 24 Hours",
      action: null,
      type: "hours",
    },
  ];

  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you! Get in touch with our team."
        image={ImageBg}
      />

      <div className="container mx-auto px-4 py-16 space-y-8">
        {/* Top Section - Form + Contact Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form - Left */}
          <div className=" p-6 ">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            <p></p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Your message here..."
                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  required
                />
              </div>
              <Button type="submit" className="mt-2">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Methods - Right */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{method.icon}</div>
                    <div>
                      <h3 className="font-medium">{method.title}</h3>

                      {method.type === "phone" ? (
                        <div className="space-y-1 flex flex-col mt-1">
                          {(
                            method.details as { text: string; href: string }[]
                          ).map((phone, i) => (
                            <AnimatedLink
                              key={i}
                              href={phone.href}
                              className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100 text-sm mt-1"
                            >
                              {phone.text}
                            </AnimatedLink>
                          ))}
                        </div>
                      ) : method.action ? (
                        <AnimatedLink
                          href={method.action}
                          className="!bg-[length:0_1px] hover:!bg-[length:100%_1px] from-primary to-primary text-stone-400 hover:text-stone-100 text-sm mt-1"
                          target="_blank"
                        >
                          {method.details as string}
                        </AnimatedLink>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.details as string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Width Map */}
        <div className="rounded-lg overflow-hidden border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d810.4440184632929!2d6.997560380069398!3d4.813401132989646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069ce864a8a37b3%3A0xe0c5f14018e217c0!2s86A%20Woji%20Road%2C%20Elechi%2C%20Port%20Harcourt%20500271%2C%20Rivers!5e0!3m2!1sen!2sng!4v1751326610135!5m2!1sen!2sng"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
