import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { Ruler, ArrowRight, CheckCircle } from "lucide-react";
import DiscountBanner from "../components/ui/DiscountBanner";

export default function Home({ onNavigate }) {
  const [hero, setHero] = useState(null);
  const [curated, setCurated] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 Parallax states
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 🔹 Adaptive scroll duration
  const scrollDuration = useMemo(() => {
    const n = curated.length || 1;
    const base = 12;
    const step = 4;
    return `${Math.min(60, base + (n - 3) * step)}s`;
  }, [curated]);

  // 🧵 Fetch home data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          { data: heroData, error: heroError },
          { data: curatedData, error: curatedError },
          { data: featuredData, error: featuredError },
        ] = await Promise.all([
          supabase
            .from("home_sections")
            .select("*")
            .eq("section_name", "hero")
            .maybeSingle(),
          supabase
            .from("home_curated")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("home_featured")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (heroError) console.error(heroError);
        if (curatedError) console.error(curatedError);
        if (featuredError) console.error(featuredError);

        setHero(heroData || null);
        setCurated(curatedData || []);
        setFeatured(featuredData || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // 🎢 Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY * 0.25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🖱️ Mouse parallax (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxTransform = {
    transform: `translate3d(${mouseOffset.x}px, ${scrollY * 0.5}px, 0) scale(1.08)`,
    transition: "transform 0.2s ease-out",
  };

  return (
    <div>
      <DiscountBanner />

      {/* 🖼️ HERO */}
      <div className="relative bg-gray-50 overflow-hidden">
        {hero?.image_url ? (
          <img
            src={hero.image_url}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-70 will-change-transform"
            style={parallaxTransform}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-white"></div>
        )}
        <div className="relative max-w-7xl mx-auto py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">{hero?.title || "Your Vision, Our Stitch."}</span>
            <span className="block text-indigo-600">
              {hero?.subtitle || "Custom Curtains Made for You."}
            </span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            {hero?.description || "Experience the luxury of perfectly fitted window treatments."}
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <button
              onClick={() => onNavigate("catalog")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition cursor-pointer"
            >
              Start Customizing
            </button>

            <button
              onClick={() => onNavigate("measure")}
              className="px-8 py-3 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition flex items-center cursor-pointer"
            >
              <Ruler className="h-5 w-5 mr-2" />
              How to Measure
            </button>
          </div>
        </div>
      </div>

      {/* OUR CURATED COLLECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Our Curated Collection
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : curated.length === 0 ? (
            <p className="text-gray-400">No curated collection uploaded yet.</p>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div
                className="scroll-container flex gap-6 whitespace-nowrap"
                style={{
                  animation: `scrollAlternate ${scrollDuration} ease-in-out infinite alternate`,
                }}
              >
                {(curated.length >= 4 ? curated.concat(curated) : curated).map((item, i) => (
                  <div
                    key={i}
                    className="inline-block bg-white rounded-lg border shadow-md hover:shadow-glow transition-transform duration-500 hover:-translate-y-1 w-[280px] flex-shrink-0 transform hover:scale-105 cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-t-lg relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-48 w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-30 transition"></div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED FABRICS */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Fabrics</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : featured.length === 0 ? (
          <p className="text-gray-400">No featured fabrics uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-lg border overflow-hidden shadow-md hover:shadow-glow transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-40 transition"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => onNavigate("shop-fabric")}
                      className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center transition cursor-pointer"
                    >
                      Explore <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✨ OUR STITCHING STYLES */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Stitching Styles</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-12">
            Choose your perfect stitching — every curtain style tailored for timeless elegance and effortless drape.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* RING TOP */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 border transition-all duration-500">
              <img
                src="/style-ring.jpg"
                alt="Ring Top"
                className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 border border-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ring Top Curtains</h3>
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  Designed for rods — these curtains glide smoothly with ring fittings, creating soft, symmetrical folds that define modern luxury.
                </p>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Elegant, flowing folds</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Smooth glide on rods</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Durable rings in steel or plastic</li>
                </ul>
              </div>
            </div>

            {/* PLEATED STYLE */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 border transition-all duration-500">
              <img
                src="/style-track.jpg"
                alt="Pleated (For Tracks)"
                className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 border border-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 4v16m8-16v16m8-16v16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pleated Curtains</h3>
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  Made for tracks — precision-stitched pleats offer neat, uniform draping that elevates both formal and classic interiors.
                </p>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Tailored pleats with perfect spacing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Suitable for ceiling-mounted tracks</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Elegant and timeless finish</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 CSS */}
      <style>{`
        @keyframes scrollAlternate {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-container { display: flex; width: max-content; animation-play-state: running; }
        .scroll-container:hover { animation-play-state: paused !important; }
        @media (hover: none) { .scroll-container:active { animation-play-state: paused !important; } }

        @media (prefers-color-scheme: light) {
          .hover\\:shadow-glow:hover {
            box-shadow: 0 8px 25px rgba(218,165,32,0.35), 0 0 10px rgba(255,215,0,0.25);
          }
        }
        @media (prefers-color-scheme: dark) {
          .hover\\:shadow-glow:hover {
            box-shadow: 0 8px 25px rgba(99,102,241,0.35), 0 0 10px rgba(129,140,248,0.25);
          }
        }
      `}</style>
    </div>
  );
}
