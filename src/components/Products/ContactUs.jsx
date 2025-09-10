import React from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, User, MessageSquare, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {  contactMessage } from "../../redux/slices/authSlice.js";
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
    toast.success(res?.message || "Message sent successfully ✌️",{duration:2000});
    reset();
  } catch (error) {
    toast.error(error?.message || "Failed to send message 😭");
  }
};

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12">
      <div
        className="container mx-auto rounded-3xl bg-gradient-to-r from-[#1c1917] via-[#29221C] to-[#0d0d0d]
         border border-[#eacd89]/30 shadow-[0_8px_30px_rgba(234,205,137,0.15)] p-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Contact <span className="text-[#eacd89]">Us</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We’d love to hear from you! Whether you have a question about our
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
              className="absolute left-3 top-3.5 text-[#eacd89]"
              size={20}
            />
            <input
              type="text"
              placeholder="Your Name"
              {...register("name", { required: "Name is required" })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#eacd89]/40 bg-[#1a1714] 
                         text-white placeholder-gray-400 focus:outline-none focus:border-[#eacd89] transition"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-[#eacd89]"
              size={20}
            />
            <input
              type="email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#eacd89]/40 bg-[#1a1714] 
                         text-white placeholder-gray-400 focus:outline-none focus:border-[#eacd89] transition"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="relative sm:col-span-2">
            <MessageSquare
              className="absolute left-3 top-3.5 text-[#eacd89]"
              size={20}
            />
            <input
              type="text"
              placeholder="Subject"
              {...register("subject", { required: "Subject is required" })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#eacd89]/40 bg-[#1a1714] 
                         text-white placeholder-gray-400 focus:outline-none focus:border-[#eacd89] transition"
            />
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1">
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
              className="w-full px-4 py-3 rounded-lg border border-[#eacd89]/40 bg-[#1a1714] 
                         text-white placeholder-gray-400 focus:outline-none focus:border-[#eacd89] transition"
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="sm:col-span-2 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-[#eacd89] text-black font-semibold 
                       hover:bg-[#d4b866] transition duration-300 shadow-md"
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
            <MapPin className="mx-auto mb-2 text-[#eacd89]" size={24} />
            <p className="text-gray-300">
              123 Asansol ok road, West Bengal, India
            </p>
          </div>
          <div>
            <Mail className="mx-auto mb-2 text-[#eacd89]" size={24} />
            <p className="text-gray-300">amirsaikh950@gmail.com</p>
          </div>
          <div>
            <Phone className="mx-auto mb-2 text-[#eacd89]" size={24} />
            <p className="text-gray-300">+91 9508148286</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
