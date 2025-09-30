import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import data from "../../../data/config.json";

/* =====================
   Variants Animasi
   ===================== */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, // jeda antar item
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* =====================
   Variants untuk Judul & Deskripsi
   ===================== */
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const descVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
  },
};

/* =====================
   Variants untuk Tombol
   ===================== */
const tabsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const tabVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
/* =====================
   BankCard
   ===================== */
const BankCard = ({ bankName, accountNumber, accountName, logoSrc, cardBg }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-white/10"
      style={{
        backgroundImage: `url(${cardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 " />
      <div className="relative z-10 p-6 h-full left-1 flex flex-col justify-between text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl mt-0 font-bold">{bankName}</h3>
        </div>

        <div className="mb-10">
          <p className="text-sm text-gray-300 ">Nomor Rekening</p>
          <p className="font-mono text-xl md:text-2xl text-red-300 tracking-widest">
            {accountNumber}
          </p>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div>
            <p className="text-xs text-gray-300">Atas Nama</p>
            <p className="text-md md:text-lg font-semibold">{accountName}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-2 py-1 rounded-lg text-sm shadow transition 
              ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {copied ? "Disalin!" : "Salin"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* =====================
   EwalletCard
   ===================== */
const EwalletCard = ({ provider, nomor, nama, logoSrc, cardBg }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(nomor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-white/10"
      style={{
        backgroundImage: `url(${cardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl -mt-4 font-bold">{provider}</h3>
        </div>

        <div className="mb-20">
          <span className="text-xs tracking-widest text-gray-400 mr-2">
            Nomor Rekening:
          </span>
          {nomor}
        </div>

        <div className="flex items-center justify-between mt-6 -mb-4">
          <div>
            <p className="text-xs text-gray-300">Atas Nama</p>
            <p className="text-md md:text-lg font-semibold">{nama}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-2 py-1 rounded-lg text-sm shadow transition 
              ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {copied ? "Disalin!" : "Salin"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* =====================
   GiftSection
   ===================== */
export default function GiftSection() {
  const [activeTab, setActiveTab] = useState("atm");

  const rekeningList = data.GiftSection?.rekening || [];
  const ewalletList = data.GiftSection?.ewallet || [];
  const addressInfo = data.GiftSection?.address || null;

  const hasBankInfo = rekeningList.length > 0;
  const hasEwalletInfo = ewalletList.length > 0;
  const hasAddressInfo = addressInfo && Object.keys(addressInfo).length > 0;

  useEffect(() => {
    if (!hasBankInfo && hasEwalletInfo) setActiveTab("ewallet");
    else if (!hasBankInfo && hasAddressInfo) setActiveTab("address");
  }, [hasBankInfo, hasEwalletInfo, hasAddressInfo]);

  // Ref untuk inView
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-50px" });

  return (
    <div className="bg-black font-cursive text-white" ref={sectionRef}>
      <div className="w-full h-[3px] bg-red-500"></div>
      <div className="mb-8 text-center mt-10">
        {/* Judul & Deskripsi */}
        <motion.div 
          className="mb-8 text-center mt-10"
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <motion.h2
            variants={titleVariants}
            className="text-xl font-bold relative text-left -mb-2 tracking-widest"
          >
            {data.GiftSection?.title || "Wedding Gift"}
          </motion.h2>

          <motion.p
            variants={descVariants}
            className="mt-5 text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
          >
            {data.GiftSection?.description ||
              "Kehadiran Anda adalah hadiah terbaik bagi kami."}
          </motion.p>
        </motion.div>
      </div>

      {/* Tombol Tab */}
      {(hasBankInfo || hasEwalletInfo || hasAddressInfo) && (
        <motion.div
          className="flex w-full justify-center mb-8"
          variants={tabsContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {hasBankInfo && (
            <motion.button
              variants={tabVariants}
              onClick={() => setActiveTab("atm")}
              className={`px-3 py-1 text-base font-cursive rounded-full ${
                activeTab === "atm"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Rekening
            </motion.button>
          )}

          {hasEwalletInfo && (
            <motion.button
              variants={tabVariants}
              onClick={() => setActiveTab("ewallet")}
              className={`px-3 py-1 text-base font-cursive rounded-full ${
                activeTab === "ewallet"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Dompet Digital
            </motion.button>
          )}

          {hasAddressInfo && (
            <motion.button
              variants={tabVariants}
              onClick={() => setActiveTab("address")}
              className={`px-3 py-1 text-base font-cursive rounded-full ${
                activeTab === "address"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Kirim ke Alamat
            </motion.button>
          )}
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {activeTab === "atm" &&
          hasBankInfo &&
          rekeningList.map((item, index) => (
            <BankCard
              key={index}
              bankName={item.bank}
              accountName={item.nama}
              accountNumber={item.nomor_rekening}
              logoSrc={item.logo_url}
              cardBg={item.card_bg}
            />
          ))}

        {activeTab === "ewallet" &&
          hasEwalletInfo &&
          ewalletList.map((item, index) => (
            <EwalletCard
              key={index}
              provider={item.provider}
              nama={item.nama}
              nomor={item.nomor}
              logoSrc={item.logo_url}
              cardBg={item.card_bg}
            />
          ))}

        {activeTab === "address" && hasAddressInfo && (
          <motion.div
            variants={itemVariants}
            className="text-center md:col-span-2"
          >
            <p className="text-gray-300 text-lg mb-4">
              Kirim hadiah ke alamat berikut:
            </p>
            <div className="bg-white/10 p-6 rounded-xl text-left font-cursive inline-block max-w-md w-full mx-auto shadow-lg border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">
                {addressInfo.recipient_name}
              </h3>
              <p className="text-red-400 mb-3">{addressInfo.full_address}</p>
              <p className="text-sm text-gray-300">
                Kode Pos:{" "}
                <span className="text-white">{addressInfo.postal_code}</span>
              </p>
              <p className="text-sm text-gray-300">
                Telepon:{" "}
                <span className="text-white">{addressInfo.phone_number}</span>
              </p>
            </div>
          </motion.div>
        )}

        {!hasBankInfo && !hasEwalletInfo && !hasAddressInfo && (
          <motion.div
            variants={itemVariants}
            className="text-white bg-zinc-800 rounded-lg p-6 text-center col-span-2"
          >
            <p className="text-lg font-semibold mb-2">
              Informasi Hadiah Tidak Tersedia
            </p>
            <p className="text-sm text-gray-400">
              Silakan hubungi kami untuk informasi lebih lanjut.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
