import PageHeader from "@/components/shared/PageHeader";
import Image from "next/image";
import { Check, Users, Globe, Award, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamCard from "@/components/about/TeamCard";
import TestimonialCard from "@/components/about/TestimonialCard";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/team/alex.jpg",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Sarah Williams",
      role: "Head of Design",
      image: "/team/sarah.jpg", 
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      image: "/team/michael.jpg",
      social: { twitter: "#", linkedin: "#" }
    }
  ];

  const testimonials = [
    {
      quote: "This company transformed our business with their innovative solutions.",
      author: "David Miller",
      company: "TechCorp Inc."
    },
    {
      quote: "Exceptional service and attention to detail. Highly recommended!",
      author: "Emily Rodriguez",
      company: "Creative Studios"
    }
  ];

  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Clients" }, 
    { value: "50+", label: "Team Members" },
    { value: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Integrity",
      description: "We believe in honest, transparent business practices"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver cutting-edge solutions"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description: "Great things happen when we work together"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Committed to delivering the highest quality in everything we do"
    }
  ];

  return (
    <div className="bg-white">
      <PageHeader 
        title="About Our Company" 
        description="Learn our story, mission, and values"
        className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white"
      />

      {/* Story Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2013, we started as a small team with big dreams. What began 
              as a passion project in a garage has grown into an industry-leading 
              company serving clients worldwide.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our journey has been marked by innovation, dedication, and an unwavering 
              commitment to our customers. Every challenge we've faced has only made us 
              stronger and more determined to deliver exceptional value.
            </p>
            <Button variant="default" size="lg">
              Learn More About Our Journey
            </Button>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="/about/office.jpg" 
              alt="Our first office"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The talented individuals behind our success
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to work with us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you have questions about our services or want to discuss a project, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Contact Us
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white">
              Join Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;