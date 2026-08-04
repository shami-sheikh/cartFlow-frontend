import React from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, User, MessageSquare, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { contactMessage } from "../../redux/slices/authSlice.js";
import { toast } from "sonner";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(contactMessage(data)).unwrap();
      toast.success(res?.message || "Message sent successfully ✌️", { duration: 2000 });
      reset();
    } catch (error) {
      toast.error(error?.message || "Failed to send message 😭");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12">
      <div
        className="container mx-auto rounded-3xl bg-white
         border border-[#ebdccb]/60 shadow-[0_8px_30px_rgba(201,151,63,0.1)] p-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-light text-[#0f0d0b] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Contact <span className="italic text-[#c9973f]">Us</span>
          </h2>
          <p className="text-[#5c5548] max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our
            products, services, or anything else — our team is ready to answer.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Name */}
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-[#c9973f]"
              size={20}
            />
            <input
              type="text"
              placeholder="Your Name"
              {...register("name", { required: "Name is required" })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e1dacd] bg-[#fcfaf6]
                         text-[#0f0d0b] placeholder-[#aba293] focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-[#c9973f]"
              size={20}
            />
            <input
              type="email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e1dacd] bg-[#fcfaf6]
                         text-[#0f0d0b] placeholder-[#aba293] focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="relative sm:col-span-2">
            <MessageSquare
              className="absolute left-3 top-3.5 text-[#c9973f]"
              size={20}
            />
            <input
              type="text"
              placeholder="Subject"
              {...register("subject", { required: "Subject is required" })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e1dacd] bg-[#fcfaf6]
                         text-[#0f0d0b] placeholder-[#aba293] focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="relative sm:col-span-2">
            <textarea
              rows="5"
              placeholder="Your Message"
              {...register("message", { required: "Message is required" })}
              className="w-full px-4 py-3 rounded-lg border border-[#e1dacd] bg-[#fcfaf6]
                         text-[#0f0d0b] placeholder-[#aba293] focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="sm:col-span-2 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-[#0f0d0b] text-white font-semibold
                       hover:bg-[#c9973f] transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                Sending...
                <Loader className="h-5 w-5 animate-spin" />
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Extra Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-14 text-center">
          <div>
            <MapPin className="mx-auto mb-2 text-[#c9973f]" size={24} />
            <p className="text-[#5c5548]">
              123 Asansol ok road, West Bengal, India
            </p>
          </div>
          <div>
            <Mail className="mx-auto mb-2 text-[#c9973f]" size={24} />
            <p className="text-[#5c5548]">amirsaikh950@gmail.com</p>
          </div>
          <div>
            <Phone className="mx-auto mb-2 text-[#c9973f]" size={24} />
            <p className="text-[#5c5548]">+91 9508148286</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;  