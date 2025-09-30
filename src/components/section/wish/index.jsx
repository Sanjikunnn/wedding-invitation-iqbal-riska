import React, { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import supabase from "../../../lib/supabaseClient";
import badwords from "indonesian-badwords";
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // ✅ install @heroicons/react

/* =====================
   Variants
   ===================== */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* =====================
   WishItem
   ===================== */
const WishItem = forwardRef(({ name, message, color }, ref) => (
  <motion.div
    ref={ref}
    variants={itemVariants}
    className="flex items-start gap-3 bg-white/5 rounded-lg p-3 backdrop-blur-sm shadow-md border border-white/10"
  >
    <div>
      <img
        width={32}
        height={32}
        src="images/face.png"
        style={{ backgroundColor: color }}
        className="rounded-full p-1"
      />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{name}</p>
      <p className="text-sm text-white/80">{message}</p>
    </div>
  </motion.div>
));

/* =====================
   WishSection
   ===================== */
const colorList = ["red", "#ffdb58", "#6bc76b", "#48cae4"];

export default function WishSection() {
  const lastChildRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-50px" });

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageWarning, setMessageWarning] = useState(null);
  const [nameWarning, setNameWarning] = useState(null);

  const listRef = useRef(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  // ✅ cek apakah ada scroll
  useEffect(() => {
    const checkScroll = () => {
      if (listRef.current) {
        const { scrollHeight, clientHeight } = listRef.current;
        setShowScrollIcon(scrollHeight > clientHeight);
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data]);


  // Ambil nama dari query param `to`
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toName = params.get("to");
    if (toName) {
      const capitalized =
        toName.charAt(0).toUpperCase() + toName.slice(1).toLowerCase();
      setName(capitalized);
    }
  }, []);

  // Realtime cek kata sensitif untuk message
  useEffect(() => {
    if (message && badwords.flag(message)) {
      setMessageWarning("Pesan mengandung kata tidak pantas!");
    } else if (message && message.length < 10) {
      setMessageWarning("Pesan minimal 10 karakter!");
    } else {
      setMessageWarning(null);
    }
  }, [message]);

  // Realtime cek nama (panjang & kata kasar)
  useEffect(() => {
    if (!name) {
      setNameWarning(null);
      return;
    }
    if (name.length < 3) {
      setNameWarning("Nama minimal 3 karakter!");
    } else if (badwords.flag(name)) {
      setNameWarning("Nama mengandung kata tidak pantas!");
    } else {
      setNameWarning(null);
    }
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // jika ada warning realtime, tolak submit
    if (nameWarning) return setError(nameWarning);
    if (messageWarning) return setError(messageWarning);

    // Validasi final (double-check)
    if (name.length < 3) return setError("Nama minimal 3 karakter!");
    if (badwords.flag(name)) return setError("Nama mengandung kata tidak pantas!");
    if (message.length < 10) return setError("Pesan minimal 10 karakter!");
    if (badwords.flag(message)) return setError("Pesan mengandung kata tidak pantas!");

    setLoading(true);
    setError(null);

    const randomColor = colorList[data.length % colorList.length];
    const cleanMsg = badwords.censor(message);

    const { error: insertError } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_NAME)
      .insert([{ name, message: cleanMsg, color: randomColor }]);

    setLoading(false);

    if (insertError) return setError(insertError.message);

    await fetchData();
    setTimeout(scrollToLastChild, 300);
    setName("");
    setMessage("");
  };

  const fetchData = async () => {
    const { data: rows, error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_NAME)
      .select("name, message, color");
    if (!error) setData(rows || []);
  };

  const scrollToLastChild = () => {
    lastChildRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      className="text-white font-cursive relative"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      <div className="w-full h-[3px] bg-red-500"></div>

      {/* Judul */}
      <motion.h2
        variants={titleVariants}
        className="text-xl mt-10 font-bold text-left text-white mb-5 tracking-wide"
      >
        Wish for the Couple
      </motion.h2>

      {/* List Ucapan */}
      <motion.div
        className="relative max-h-[20rem] overflow-auto space-y-4 px-2 pb-8 scroll-smooth"
        variants={containerVariants}
        onScroll={(e) => {
          const el = e.target;
          setShowScrollIcon(el.scrollHeight > el.clientHeight && el.scrollTop < el.scrollHeight - el.clientHeight - 20);
        }}
      >
        {data.map((item, index) => (
          <WishItem
            key={index}
            name={item.name}
            message={item.message}
            color={item.color}
            ref={index === data.length - 1 ? lastChildRef : null}
          />
        ))}

        {/* Sticky Scroll Icon */}
        {showScrollIcon && (
          <div className="sticky -bottom-8 flex justify-center pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
              className="backdrop-blur-md bg-gradient-to-b from-pink-500/30 to-amber-500/30 shadow-[0_0_20px_rgba(255,105,180,0.6)] rounded-full p-1"
            >
              {/* Double Chevron Down */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 13l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        )}



      </motion.div>


      {/* Form Input */}
      <motion.form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 px-2"
        variants={containerVariants}
      >
        {error && (
          <motion.p variants={itemVariants} className="text-red-400 text-sm">
            {error}
          </motion.p>
        )}

        <motion.div className="space-y-2" variants={itemVariants}>
          <input
            placeholder="Nama Kamu"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none"
          />
          {nameWarning && <p className="text-red-400 text-sm">{nameWarning}</p>}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <textarea
            placeholder="Pesan dan Doa untuk Kedua Mempelai"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
            rows={4}
            className="w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none"
          />
          {messageWarning && (
            <p className="text-red-400 text-sm">{messageWarning}</p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading || !!nameWarning || !!messageWarning}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-2 text-white rounded-md font-semibold tracking-wide transition duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110"
          }`}
        >
          {loading ? "Sending..." : "Send Wish 💌"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
