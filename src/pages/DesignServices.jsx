import React from "react";
import { MessageCircle, Scissors } from "lucide-react";

export default function DesignServices() {
  const whatsappNumber = "7417410714";

  const services = [
    {
      title: "Free Consultation",
      description:
        "Our experts visit your space to understand your needs and offer tailored recommendations, completely free of charge.",
      icon: <MessageCircle className="h-10 w-10 text-yellow-500" />,
      buttonText: "Book Now",
      message:
        "Hi! I would like to book a free consultation for curtain design.",
    },
    {
      title: "Custom Design & Tailoring",
      description:
        "From classic to contemporary, we custom-tailor curtains and blinds to perfectly match your interior style.",
      icon: <Scissors className="h-10 w-10 text-yellow-500" />,
      buttonText: "Learn More",
      message:
        "Hi! I’d like to know more about your custom design and tailoring services.",
    },
  ];

  const openWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/91${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-center font-sans">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Our Design Services
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
        A seamless experience from consultation to custom tailoring, tailored
        just for you.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="mb-5 bg-indigo-50 rounded-full p-4 flex items-center justify-center">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {service.description}
            </p>
            <button
              onClick={() => openWhatsApp(service.message)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors shadow-sm"
            >
              {service.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
