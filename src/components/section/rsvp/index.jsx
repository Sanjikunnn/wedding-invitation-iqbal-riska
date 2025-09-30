import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, forwardRef } from "react";
import supabase from "../../../lib/supabaseClient";
import badwords from "indonesian-badwords";
import dataConfig from "../../../data/config.json";

/* 🎬 Variants Animasi */
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, duration: 0.6, ease: "easeOut" },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const titleVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const paragraphVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1 } },
};

const colorList = ["#ef4444", "#facc15", "#22c55e", "#0ea5e9"];

/* 🎁 Item RSVP */

const RSVPItem = forwardRef(({ name, status, total, color }, ref) => (
  <motion.div
    ref={ref}
    variants={itemVariants}
    className="flex items-start gap-3 bg-white/5 rounded-lg p-3 backdrop-blur-sm shadow-md border border-white/10"
  >
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full shadow-inner"
      style={{ backgroundColor: color }}
    >
      <img
        src="images/face.png"
        alt="avatar"
        width={24}
        height={24}
        className="rounded-full"
      />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{name}</p>
      <p className="text-sm text-white/80">
        {status === "hadir" ? "✅ Akan hadir" : "❌ Tidak hadir"}{" "}
        {total > 1 && `(${total} orang)`}
      </p>
    </div>
  </motion.div>
));


export default function RSVPSection() {
  const sectionRef = useRef(null);
  const rsvpRef = useRef(null);
  const inviteRef = useRef(null);
  const thanksRef = useRef(null);
  const lastChildRef = useRef(null);

  // 👁️ Observer tiap section
  const rsvpInView = useInView(rsvpRef, { once: false, amount: 0.3 });
  const inviteInView = useInView(inviteRef, { once: false, amount: 0.3 });
  const thanksInView = useInView(thanksRef, { once: false, amount: 0.3 });

  // Animasi state gabungan
  const [animState, setAnimState] = useState({
    rsvp: "hidden",
    invite: "hidden",
    thanks: "hidden",
  });

  // Data RSVP
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("hadir");
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper validasi nama
  const validateName = (value) => {
    if (badwords.flag(value)) return "Nama mengandung kata tidak pantas!";
    if (value.length > 0 && value.length < 3) return "Nama minimal 3 karakter!";
    return null;
  };

  // Input handler nama
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setError(validateName(value));
  };

  // ✅ Submit RSVP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validateName(name);
    if (err) return setError(err);

    setLoading(true);
    setError(null);

    const randomColor = colorList[data.length % colorList.length];

    const { error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_RSVP)
      .insert([{ name, status, total: parseInt(total), color: randomColor }]);

    setLoading(false);

    if (error) return setError(error.message);

    await refreshData();
    setTimeout(scrollToLastChild, 300);
    setName("");
    setTotal(1);
    setStatus("hadir");
  };

  // Ambil data dari supabase
  const refreshData = async () => {
    const { data, error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_RSVP)
      .select("name, status, total, color");
    if (!error) setData(data);
  };

  // Scroll ke item terakhir
  const scrollToLastChild = () => {
    lastChildRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Prefill nama dari query ?to=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toName = params.get("to");
    if (toName) {
      setName(decodeURIComponent(toName));
    }
  }, []);

  // Refresh data awal
  useEffect(() => {
    refreshData();
  }, []);

  // Update animasi tiap kali inView berubah
  useEffect(() => {
    setAnimState({
      rsvp: rsvpInView ? "show" : "hidden",
      invite: inviteInView ? "show" : "hidden",
      thanks: thanksInView ? "show" : "hidden",
    });
  }, [rsvpInView, inviteInView, thanksInView]);

  return (
    <div ref={sectionRef} className="text-white font-cursive space-y-20">
      {/* Bagian RSVP */}
      <motion.div
        ref={rsvpRef}
        variants={containerVariants}
        initial="hidden"
        animate={animState.rsvp}
        className="space-y-6"
      >
        <motion.div className="w-full h-[3px] bg-red-500" variants={itemVariants} />
        <motion.h2
          variants={titleVariants}
          className="text-xl mt-10 font-bold text-left text-white mb-5 tracking-wide"
        >
          RSVP Kehadiran
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="max-h-[20rem] overflow-auto space-y-4 px-2 pb-2 scroll-smooth"
        >
          <AnimatePresence>
            {data.map((item, index) => (
              <RSVPItem
                key={item.name + index}
                {...item}
                ref={index === data.length - 1 ? lastChildRef : null}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 px-2"
          variants={containerVariants}
        >
          {error && (
            <motion.p variants={paragraphVariants} className="text-red-400 text-sm">
              {error}
            </motion.p>
          )}

          <motion.div className="space-y-2" variants={itemVariants}>
            <input
              placeholder="Nama Kamu"
              value={name}
              onChange={handleNameChange}
              className={`w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none ${
                error ? "border border-red-400" : ""
              }`}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-black focus:outline-none"
            >
              <option value="hadir">Saya akan hadir</option>
              <option value="tidak_hadir">Maaf, saya tidak bisa hadir</option>
            </select>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <input
              type="number"
              min={1}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="Jumlah orang"
              className="w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 text-white rounded-md font-semibold tracking-wide transition duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim RSVP 🎉"}
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Bagian Turut Mengundang */}
      <motion.div
        ref={inviteRef}
        variants={containerVariants}
        initial="hidden"
        animate={animState.invite}
        className="space-y-6 text-center"
      >
        <motion.h2 className="text-xl font-bold" variants={titleVariants}>
          Turut Mengundang
        </motion.h2>
        <motion.div className="w-full h-[3px] bg-red-500 mt-3" variants={itemVariants} />

        <motion.div
          className="text-center relative overflow-hidden h-[200px] md:h-[300px]"
          variants={itemVariants}
        >
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="animate-creditRoll text-white/90 text-xs leading-snug space-y-1 w-full">
              {dataConfig.turut_mengundang.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex justify-between w-full px-0"
                  variants={paragraphVariants}
                >
                  <span className="text-left">{item.nama}</span>
                  <span className="text-right italic">{item.jabatan}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bagian Terima Kasih */}
      <motion.div
        ref={thanksRef}
        variants={containerVariants}
        initial="hidden"
        animate={animState.thanks}
        className="text-center space-y-6"
      >
        <motion.div className="relative w-72 h-72 mx-auto" variants={itemVariants}>
          <div
            className="absolute inset-0 animate-spin-slow 
              bg-[conic-gradient(red,orange,yellow,green,cyan,indigo,violet,red)] 
              [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
          >
            <div className="absolute inset-[6px] bg-black rounded-full"></div>
          </div>

          <img
            src={dataConfig.terima_kasih_image}
            alt="Terima Kasih"
            className="absolute inset-[12px] w-[calc(100%-24px)] h-[calc(100%-24px)] 
                      object-cover rounded-full shadow-lg z-10"
          />
        </motion.div>

        <motion.div
          className="w-16 h-[8px] bg-red-500 mx-auto rounded-full"
          variants={itemVariants}
        />

        <motion.p
          variants={paragraphVariants}
          className="text-sm md:text-base text-white/80 italic leading-relaxed px-4 md:px-10"
        >
          Dengan penuh rasa hormat dan sukacita, kami mengundang kehadiran
          Bapak/Ibu/Saudara/i melalui undangan digital ini. Besar harapan kami
          agar kehadiran serta doa restu yang tulus dapat menjadi pelengkap
          kebahagiaan kami dalam hari istimewa ini.
          <br />
          <span className="block mt-3 font-semibold text-white">
            Terima kasih atas segala doa dan perhatiannya.
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}

