import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-[#fcfaf6] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header — matches the "Boutique Feed / Curated Selection" vocabulary used elsewhere */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 pb-8 border-b border-[#ebdccb]/60">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-[1px] bg-[#c9973f]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9973f] font-medium">
                Fresh on the Floor
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-light text-[#0f0d0b] tracking-tight leading-[1.05]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <span className="italic">New</span> Arrivals
            </h2>
          </div>
          <p className="text-sm text-[#8e8577] max-w-xs leading-relaxed">
            {newArrivals.length > 0
              ? `${newArrivals.length} pieces, just landed — hand-picked ahead of the season.`
              : "Hand-picked pieces, timeless style meets modern comfort."}
          </p>
        </div>

        {/* Slider */}
        <Splide
          options={{
            perPage: 4,
            perMove: 1,
            gap: "2rem",
            pagination: false,
            arrows: true,
            breakpoints: {
              1280: { perPage: 3 },
              1024: { perPage: 2 },
              640: { perPage: 1 },
            },
          }}
          aria-label="New Arrivals"
          onMoved={(splide) => {
            const pct =
              ((splide.index + 1) / splide.Components.Slides.length) * 100;
            const bar = document.getElementById("na-progress");
            if (bar) bar.style.width = `${pct}%`;
          }}
        >
          {newArrivals.map((item, idx) => (
            <SplideSlide key={item._id}>
              <Link to={`/product/${item._id}`} className="group block">
                {/* Image with editorial corner-bracket framing */}
                <div className="relative aspect-[3/4] mb-5">
                  {/* Serial index — real signature element, not decoration: it's the card's actual position */}
                  <span
                    className="absolute -top-3 -left-1 text-[13px] font-semibold tracking-[0.15em] text-[#c9973f]/70 select-none z-10"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="relative w-full h-full overflow-hidden bg-[#f0ece2]">
                    <img
                      src={item.images?.[0]?.url || item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                    />
                  </div>

                  {/* Corner brackets, revealed on hover — museum-label framing */}
                  <div className="pointer-events-none absolute inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#c9973f]" />
                    <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#c9973f]" />
                    <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#c9973f]" />
                    <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#c9973f]" />
                  </div>

                  {/* New tag — understated, not a loud badge */}
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white bg-[#0f0d0b]/80 backdrop-blur-sm px-2.5 py-1">
                    New
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 px-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#aba293]">
                    {item.brand || "Exclusive"} · {item.category}
                  </p>
                  <h3
                    className="text-xl text-[#0f0d0b] group-hover:text-[#a87b32] transition-colors duration-300 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[15px] font-medium text-[#0f0d0b]">
                      ₹{item.price}
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs line-through text-[#c2b9a8]">
                        ₹{item.discountPrice}
                      </span>
                    )}
                    {item.rating > 0 && (
                      <span className="ml-auto flex items-center gap-1 text-[11px] text-[#c9973f]">
                        ★ <span className="text-[#8e8577]">{item.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SplideSlide>
          ))}
        </Splide>

        {/* Thin progress-line pagination + arrows, replacing generic dots */}
        <div className="flex items-center gap-6 mt-10">
          <div className="flex-1 h-[1px] bg-[#ebdccb] relative overflow-hidden">
            <div
              id="na-progress"
              className="absolute left-0 top-0 h-full bg-[#c9973f] transition-all duration-500 ease-out"
              style={{ width: `${newArrivals.length ? (1 / newArrivals.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#aba293] shrink-0">
            Scroll to explore
          </span>
        </div>
      </div>

      {/* Slider arrow styling */}
      <style>{`
        .splide__arrow {
          background: transparent;
          border: 1px solid #e1dacd;
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }
        .splide__arrow:hover {
          background: #0f0d0b;
          border-color: #0f0d0b;
        }
        .splide__arrow svg {
          fill: #0f0d0b;
          width: 15px;
          height: 15px;
          transition: fill 0.3s ease;
        }
        .splide__arrow:hover svg {
          fill: #fcfaf6;
        }
        .splide__arrow--prev {
          left: -1.25rem;
        }
        .splide__arrow--next {
          right: -1.25rem;
        }
        @media (max-width: 1024px) {
          .splide__arrow { display: none; }
        }
      `}</style>
    </section>
  );
};

export default NewArrivals;