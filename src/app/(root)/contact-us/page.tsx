import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

const ContactUs = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Us",
      description: "Our friendly team is here to help.",
      details: "hello@yourcompany.com",
      action: "mailto:hello@yourcompany.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Call Us",
      description: "Mon-Fri from 9am to 5pm",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      details: "123 Business Ave, Suite 100, San Francisco, CA 94107",
      action: "https://maps.google.com",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Hours",
      description: "Our operating hours",
      details: "Monday - Friday: 9:00 AM - 5:00 PM",
      action: null,
    },
  ];

  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you! Get in touch with our team."
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

                      {method.action ? (
                        <a href={method.action} className="text-sm text-muted-foreground mt-1">{method.details}</a>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.details}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.325538729985!2d-122.4194159242278!3d37.7749294718605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
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
