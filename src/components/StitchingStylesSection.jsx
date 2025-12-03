import React from "react";
import { CheckCircle } from "lucide-react";

export default function StitchingStylesSection() {
  const styles = [
    {
      id: 1,
      name: "Ring Top",
      description:
        "Perfect for curtain rods. These curtains come stitched with high-quality steel or plastic rings (grommets), creating tailored, deep folds for a modern look.",
      points: ["Easy to slide", "Modern look"],
      image:
        "https://your-supabase-url/storage/v1/object/public/headers/ring-top.jpg", // 🖼️ replace with your real URL
    },
    {
      id: 2,
      name: "Pleated (For Tracks)",
      description:
        "Designed specifically for curtain tracks. These curtains are stitched with classic pleats (hooks at the back), offering a formal, elegant, and timeless drape.",
      points: ["Ideal for tracks", "Elegant style"],
      image:
        "https://your-supabase-url/storage/v1/object/public/headers/pleated.jpg", // 🖼️ replace with your real URL
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
          Our Stitching Styles
        </h2>
        <p className="text-gray-600 mb-12">
          We specialize in two premium stitching types to suit your needs.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {styles.map((style) => (
            <div
              key={style.id}
              className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="p-6 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {style.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {style.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 text-sm text-gray-700">
                  {style.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="text-green-500 w-4 h-4" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
