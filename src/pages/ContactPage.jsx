import React from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const whatsappNumber = "7417410714";
  const email = "curtainstory.info@gmail.com";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Curtain%20Story!%20I%20want%20to%20inquire%20about%20your%20curtain%20and%20fabric%20services.`;

  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions or need help choosing the perfect fabric?  
            Our team would love to assist you.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <MessageCircle className="h-10 w-10 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
            <p className="text-gray-600 mt-1">Chat with us instantly</p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block px-5 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="flex flex-col items-center">
            <Mail className="h-10 w-10 text-indigo-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600 mt-1">We reply within 24 hours</p>
            <a
              href={`mailto:${email}`}
              className="mt-3 inline-block px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Send Email
            </a>
          </div>

          <div className="flex flex-col items-center">
            <MapPin className="h-10 w-10 text-gray-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
            <p className="text-gray-600 mt-1">Curtain Story Studio</p>
            <p className="text-gray-600">Bangalore, India</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200" />

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Send Us a Message
          </h2>

          <form
            action={`mailto:${email}`}
            method="post"
            encType="text/plain"
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
