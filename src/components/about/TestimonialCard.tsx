import { QuoteIcon } from "lucide-react";

// TestimonialCard.tsx
export default function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <QuoteIcon className="h-8 w-8 text-gray-300 mb-4" />
      <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
      <div>
        <p className="font-semibold">{testimonial.author}</p>
        <p className="text-gray-600">{testimonial.company}</p>
      </div>
    </div>
  );
}
