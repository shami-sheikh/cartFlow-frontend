import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="bg-gradient-to-r from-black via-[#382f29] to-black min-h-screen flex items-center relative overflow-y-hidden">
        <div className="container mx-auto px-6 text-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg"
          >
            Welcome to <span className="text-white">CartFlow</span>
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Discover a curated collection of premium products, designed for
            those who value elegance and exclusivity.
          </motion.p>

          {/* Shop Now Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
            className="mt-8"
          >
            <motion.button
              onClick={() => navigate("/collections/all")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-10 py-4 rounded-full shadow-xl transition duration-300"
            >
              🛍️ Shop Now
            </motion.button>
          </motion.div>

          {/* Scroll Down Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center cursor-pointer"
          >
            <Link to="discover" smooth={true} duration={1000}>
              <motion.img
                className="w-10 h-10"
                src="https://cdn-icons-png.flaticon.com/128/5800/5800493.png"
                alt="scroll down"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </Link>
          </motion.div>
        </div>

        {/* Decorative Shape Divider */}
        <div className="custom-shape-divider-bottom-1755711226 absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-[80px]"
          >
            <path
              d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z"
              className="fill-[#1a1410]"
            ></path>
          </svg>
        </div>
      </section>

      {/* Discover Section */}
      <motion.div
        id="discover"
        className="container mx-auto px-6 py-12 text-center md:w-1/2"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-xl md:text-3xl font-bold text-yellow-400 mb-6">
          Discover Our Exclusive Collections
        </h1>
        <div className="h-[3px] w-1/3 mx-auto -mt-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
      </motion.div>
    </>
  );
};

export default Hero;
