import React from "react";



import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
   
      <div className="bg-gradient-to-r from-[#29221C] to-[#0D0D0D] text-[#eacd89] h-full shadow-lg">
        <footer className=" tracking-wider p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10  px-3 py-10">
            <div>
              <h1 className="font-Lora text-xs mb-3 font-bold opacity-80">
                ONLINE SHOPPING
              </h1>
              <ul className=" text-sm space-y-2 text-[#696B79] w-fit">
                {[
                  "Men",
                  "Women",
                  "Kids",
                  "Home",
                  "Beauty",
                  "Genz",
                  "Gifts Cards",
                  "CartFlow Insider",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="relative group cursor-pointer hover:text-[#D4AF37] w-fit transition-colors duration-300 ease-in-out"
                  >
                    <Link to="/collections/all?gender=Men" className="inline-block font-serif">
                      {item}
                    </Link>
                    <span className="absolute h-[2px] w-0 left-0 bottom-[-4px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full ease-in-out"></span>
                  </li>
                ))}
              </ul>

              <h1 className="mt-6 text-xs mb-3 font-semibold">USEFUL LINKS </h1>
              <ul className=" text-sm space-y-2 text-[#696B79] w-fit">
                {[
                  "Blog",
                  "Careers",
                  "Site Map",
                  "Corporate Information",
                  "Whitehat",
                  "ClearTrip",
                  "CartFlow Global",
                ].map((item, index) => (
                  <li
                    key={index}
                    className=" relative group cursor-pointer hover:text-[#D4AF37] w-fit  duration-300 ease-in-out transition-colors"
                  >
                    <Link to="/" className="inline-block font-serif">
                      {item}
                    </Link>
                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full ease-in-out"></span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h1 className="font-Lura text-xs mb-3 font-bold mt-4 sm:mt-0 md:mt-0 opacity-80">
                CUSTOMER POLICIES
              </h1>
              <ul className="text-sm space-y-2 text-[#696B79] w-fit">
                {[
                  "Contact",
                  "FAQ",
                  "T&C",
                  "Terms Of Use",
                  "Track Orders",
                  "Shipping",
                  "Cancellation",
                  "Returns",
                  "Privacy policy",
                  "Grievance Redressal",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="relative group cursor-pointer w-fit text-[#696B79] hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    <Link to="/" className="inline-block font-serif">
                      {item}
                    </Link>
                    <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h1 className="font-Lora text-xs mb-3 font-bold mt-4 md:mt-0 text-nowrap opacity-80">
                EXPERIENCE CARTFLOW APP ON MOBILE
              </h1>
              <div className="flex justify-start items-center gap-2">
                <img
                  className="w-[50px] h-[42px] bg-contain bg-no-repeat"
                  src={"https://cdn-icons-png.flaticon.com/128/300/300218.png"}
                  alt="Play Store"
                />
                <img
                  className="w-[125px] h-[42px] bg-contain bg-no-repeat"
                  src={
                    "https://constant.myntassets.com/web/assets/img/bc5e11ad-0250-420a-ac71-115a57ca35d51539674178941-apple_store.png"
                  }
                  alt="Apple Store"
                />
              </div>
              <h1 className="font-Lora text-xs mb-3 font-bold mt-4 opacity-80">
                KEEP IN TOUCH
              </h1>
              <div className="flex justify-start items-center gap-4">
                <Link className="hover:scale-105 transition-transform duration-300" to="/">
                  
                  <img
                    className="w-6 h-auto bg-contain bg-no-repeat "
                    src={'https://cdn-icons-png.flaticon.com/128/2626/2626269.png'}
                    alt="fb"
                  />
                </Link>
                <Link to="/" className="hover:scale-105 transition-transform duration-300">
                
                  <img
                    className="w-5 h-auto bg-contain bg-no-repeat"
                    src={'https://cdn-icons-png.flaticon.com/128/733/733579.png'}
                    alt="twitter"
                  />
                </Link>
                <Link to="/" className="hover:scale-105 transition-transform duration-300">
                  
                  <img
                    className="w-5 h-auto bg-contain bg-no-repeat"
                    src={'https://cdn-icons-png.flaticon.com/128/174/174883.png'}
                    alt="youtube"
                  />
                </Link>
                <Link to="/" className="hover:scale-105 transition-transform duration-300">
                  
                  <img
                    className="w-5 h-auto bg-contain bg-no-repeat"
                    src={'https://cdn-icons-png.flaticon.com/128/2111/2111463.png'}
                    alt="instagram"
                  />
                </Link>
              </div>
            </div>

            <div>
              <div className="flex gap-2 items-center justify-start">
                <img className="w-auto h-10" src={'https://constant.myntassets.com/web/assets/img/6c3306ca-1efa-4a27-8769-3b69d16948741574602902452-original.png'} alt="" />
                <p className="text-sm ">
                  <span className="font-bold">100% ORIGINAL </span>
                  guarantee for all products at CartFlow.com
                </p>
              </div>
              <div className="flex gap-2 items-center justify-start mt-10">
                <img
                  className="w-auto h-10"
                  src="https://cdn-icons-png.flaticon.com/128/11153/11153363.png"
                  alt=""
                />
                <p className="text-sm ">
                  <span className="font-bold">Return within 14days </span>
                  of receiving your order
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full mb-3">
            <span className="text-xs font-bold text-[#D4AF37] pl-3 mr-3 whitespace-nowrap">
              POPULAR SEARCHES
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          <div className="pl-3">
            <p className="text-[#696B79] text-[13px]">
              <span>Makeup Dresses For Girls</span> T-Shirts Sandals Headphones
              Babydolls Blazers For Men Handbags Ladies Watches Bags Sport Shoes
              Reebok Shoes Puma Shoes Boxers Wallets Tops Earrings Fastrack
              Watches Kurtis Nike Smart Watches Titan Watches Designer Blouse
              Gowns Rings Cricket Shoes Forever 21 Eye Makeup Photo Frames
              Punjabi Suits Bikini CartFlow Fashion Show Lipstick Saree Watches
              Dresses Lehenga Nike Shoes Goggles Bras Suit Chinos Shoes Adidas
              Shoes Woodland Shoes Jewellery Designers Sarees
            </p>
          </div>
          <div className="flex justify-between mt-10 text-[#696B79] pl-3 flex-wrap">
            <div>
              <p>
                In case of any concern,
                <span className="text-blue-500 font-Lora font-bold w-fit relative group transition-colors cursor-pointer">
                  Contact Us
                  <span className="absolute left-0 bottom-[-4px] h-[2px] bg-blue-500 w-0 transition-all duration-200 ease-in-out group-hover:w-full"></span>
                </span>
              </p>
            </div>
            <div>
              <p>© 2025 www.amir.com. All rights reserved.</p>
            </div>
            <div>
              <p>My cartflow company </p>
            </div>
          </div>
          <br />
          <hr className=" ml-3  bg-[#696B79]" />
          <h1 className="mt-7 pl-3 text-sm mb-6 font-semibold font-Lora opacity-80">
            Registered Office Address{" "}
          </h1>
          <div className="flex justify-between items-center  ">
            <div className="w-[350px] h-80 leading-tight font-serif">
              <p className="text-[#696B79] pl-3">
                Buildings Alyssa, Begonia and Clover situated in Embassy Tech
                Village, Outer Ring Road, Devarabeesanahalli Village, Varthur
                Hobli, Bengaluru – 560103, India
              </p>
            </div>
            <div className="max-w-3xl h-80 p-8">
              <p className="text-[#696B79] text-sm">
                CIN: U72300KA2007PTC041799{" "}
              </p>
              <a
                href="tel:+918061561999"
                className="text-blue-600 hover:underline"
              >
                <span className="text-[#696B79]">Telephone:</span>{" "}
                +91-9508148286
              </a>
            </div>
          </div>
          <div className="w-fit pl-3 lg:mt-[-8rem]  mt-[-8rem] md:mt-[-10rem] sm:mt-[-10rem] ">
            <h1 className="font-Lora text-xs mb-3 font-bold mt-4 opacity-80">
              ONLINE SHOPPING MADE EASY AT CartFlow
            </h1>
            <p className="text-[#696B79] text-[13px] leading-tight">
              If you would like to experience the best of online shopping for
              men, women and kids in India, you are at the right place. CartFlow
              is the ultimate destination for fashion and lifestyle, being host
              to a wide array of merchandise including clothing, footwear,
              accessories, jewellery, personal care products and more. It is
              time to redefine your style statement with our treasure-trove of
              trendy items. Our online store brings you the latest in designer
              products straight out of fashion houses. You can shop online at
              CartFlow from the comfort of your home and get your favourites
              delivered right to your doorstep.
            </p>
          </div>
          <div className="pl-3 mt-6">
            <h1 className="font-Lora text-xs mb-3 font-bold mt-4 opacity-80">
              BEST ONLINE SHOPPING SITE IN INDIA FOR FASHION
            </h1>
            <p className="text-[#696B79] text-[13px] leading-tight">
              Be it clothing, footwear or accessories, CartFlow offers you the
              ideal combination of fashion and functionality for men, women and
              kids. You will realise that the sky is the limit when it comes to
              the types of outfits that you can purchase for different
              occasions.
            </p>

            <ol className="list-decimal pl-16 space-y-4 text-sm mt-5 text-gray-800 ">
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Trendy women’s clothing
                </span>{" "}
                - Online shopping for women at CartFlow is a mood-elevating
                experience. Look hip and stay comfortable with chinos and
                printed shorts this summer. Look hot on your date dressed in a
                little black dress, or opt for red dresses for a sassy vibe.
                Striped dresses and T-shirts represent the classic spirit of
                nautical fashion. Choose your favourites from among Bardot,
                off-shoulder, shirt-style, blouson, embroidered and peplum tops,
                to name a few. Team them up with skinny-fit jeans, skirts or
                palazzos. Kurtis and jeans make the perfect fusion-wear
                combination for the cool urbanite. Our grand sarees and
                lehenga-choli selections are perfect to make an impression at
                big social events such as weddings. Our salwar-kameez sets,
                kurtas and Patiala suits make comfortable options for regular
                wear.
              </li>
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Smart men’s clothing
                </span>{" "}
                - At CartFlow you will find myriad options in smart formal
                shirts and trousers, cool T-shirts and jeans, or kurta and
                pyjama combinations for men. Wear your attitude with printed
                T-shirts. Create the back-to-campus vibe with varsity T-shirts
                and distressed jeans. Be it gingham, buffalo, or window-pane
                style, checked shirts are unbeatably smart. Team them up with
                chinos, cuffed jeans or cropped trousers for a smart casual
                look. Opt for a stylish layered look with biker jackets. Head
                out in cloudy weather with courage in water-resistant jackets.
                Browse through our innerwear section to find supportive garments
                which would keep you confident in any outfit.
              </li>
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Fashionable footwear
                </span>{" "}
                - While clothes maketh the man, the type of footwear you wear
                reflects your personality. We bring you an exhaustive lineup of
                options in casual shoes for men, such as sneakers and loafers.
                Make a power statement at work dressed in brogues and oxfords.
                Practice for your marathon with running shoes for men and women.
                Choose shoes for individual games such as tennis, football,
                basketball, and the like. Or step into the casual style and
                comfort offered by sandals, sliders, and flip-flops. Explore our
                lineup of fashionable footwear for ladies, including pumps,
                heeled boots, wedge-heels, and pencil-heels. Or enjoy the best
                of comfort and style with embellished and metallic flats.
              </li>
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Stylish accessories{" "}
                </span>{" "}
                - CartFlow is one of the best online shopping sites for classy
                accessories that perfectly complement your outfits. You can
                select smart analogue or digital watches and match them up with
                belts and ties. Pick up spacious bags, backpacks, and wallets to
                store your essentials in style. Whether you prefer minimal
                jewellery or grand and sparkling pieces, our online jewellery
                collection offers you many impressive options.
              </li>
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Fun and frolic{" "}
                </span>{" "}
                - Online shopping for kids at CartFlow is a complete joy. Your
                little princess is going to love the wide variety of pretty
                dresses, ballerina shoes, headbands and clips. Delight your son
                by picking up sports shoes, superhero T-shirts, football jerseys
                and much more from our online store. Check out our lineup of
                toys with which you can create memories to cherish.
              </li>
              <li className="text-[#696B79]  text-[13px] leading-tight">
                <span className="font-semibold text-[#D4AF37] text-[14px]">
                  Beauty begins here{" "}
                </span>{" "}
                - You can also refresh, rejuvenate and reveal beautiful skin
                with personal care, beauty and grooming products from CartFlow.
                Our soaps, shower gels, skin care creams, lotions and other
                ayurvedic products are specially formulated to reduce the effect
                of aging and offer the ideal cleansing experience. Keep your
                scalp clean and your hair uber-stylish with shampoos and hair
                care products. Choose makeup to enhance your natural beauty.
              </li>
            </ol>
            <p className="text-[#696B79]  text-[13px] leading-tight mt-5">
              CartFlow is one of the best online shopping sites in India which
              could help transform your living spaces completely. Add colour and
              personality to your bedrooms with bed linen and curtains. Use
              smart tableware to impress your guest. Wall decor, clocks, photo
              frames and artificial plants are sure to breathe life into any
              corner of your home.
            </p>
          </div>
          <div className="pl-3">
            <h1 className="font-Lora text-xs mb-3 font-bold mt-6 opacity-80">
              HISTORY OF CARTFLOW
            </h1>
            <p className="text-[#696B79]  text-[13px] leading-tight">
              Becoming India’s no. 1 fashion destination is not an easy feat.
              Sincere efforts, digital enhancements and a team of dedicated
              personnel with an equally loyal customer base have made CartFlow
              the online platform that it is today. The original B2B venture for
              personalized gifts was conceived in 2007 but transitioned into a
              full-fledged ecommerce giant within a span of just a few years. By
              2012, CartFlow had introduced 350 Indian and international brands
              to its platform, and this has only grown in number each passing
              year. Today CartFlow sits on top of the online fashion game with
              an astounding social media following, a loyalty program dedicated
              to its customers, and tempting, hard-to-say-no-to deals.
            </p>
            <br />
            <p className="text-[#696B79]  text-[13px] leading-tight">
              The CartFlow shopping app came into existence in the year 2015 to
              further encourage customers’ shopping sprees. Download the app on
              your Android or IOS device this very minute to experience fashion
              like never before
            </p>
          </div>
          <div className="pl-3">
            <h1 className="font-Lora text-xs mb-3 font-bold mt-6 opacity-80">
              SHOP ONLINE AT CARTFLOW WITH COMPLETE CONVENIENCE
            </h1>
            <p className="text-[#696B79]  text-[13px] leading-tight">
              Another reason why CartFlow is the best of all online stores is
              the complete convenience that it offers. You can view your
              favourite brands with price options for different products in one
              place. A user-friendly interface will guide you through your
              selection process. Comprehensive size charts, product information
              and high-resolution images help you make the best buying
              decisions. You also have the freedom to choose your payment
              options, be it card or cash-on-delivery. The 14-day returns policy
              gives you more power as a buyer. Additionally, the try-and-buy
              option for select products takes customer-friendliness to the next
              level.
            </p>
            <br />
            <p className="text-[#696B79]  text-[13px] leading-tight">
              Enjoy the hassle-free experience as you shop comfortably from your
              home or your workplace. You can also shop for your friends, family
              and loved-ones and avail our gift services for special occasions.
            </p>
          </div>
        </footer>
        <div className="bg-gradient-to-r from-[#524539] to-[#1d1c1c] mt-4 h-fit py-3 w-screen  leading-loose">
          <p className="text-[#D4AF37] text-base text-center font-Lora">
            © Amir&Shaikh. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer
