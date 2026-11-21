import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Printer, Download, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logo-new.png";
import { feedbackUrl } from "./feedbackOptions";

const headingFont = { fontFamily: '"BrutalTypeBold", sans-serif' };
const bodyFont = { fontFamily: '"Brutal Font Light", sans-serif' };

const qrSrc = (size) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&ecc=M&data=${encodeURIComponent(feedbackUrl())}`;

// Printable QR poster: scan → /feedback. No navbar/footer.
const FeedbackQR = () => {
  const [copied, setCopied] = useState(false);
  const url = feedbackUrl();

  const handleDownload = async () => {
    try {
      const res = await fetch(qrSrc(1000));
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "BXC-Feedback-QR.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(qrSrc(1000), "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-5 py-10 print:bg-white print:py-0">
      <Helmet>
        <title>Feedback QR | Box &amp; Cross</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <style>{`@media print { @page { size: A4; margin: 12mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>

      <main className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0d0d0d] to-[#050505] px-6 sm:px-10 py-10 text-center overflow-hidden print:max-w-none print:border-0 print:rounded-none print:bg-[#050505] print:min-h-[273mm] print:flex print:flex-col print:justify-center">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-[#ccf141]/[0.08] blur-[110px] pointer-events-none" />

        <div className="relative">
          <img src={logo} alt="Box & Cross" className="h-9 w-auto mx-auto mb-7" />

          <h1 className="text-[34px] sm:text-[40px] leading-[0.95] font-black uppercase tracking-tight" style={headingFont}>
            Your voice.
            <br />
            <span className="text-[#ccf141]">Our next rep.</span>
          </h1>

          <p className="mt-4 text-[13px] font-black uppercase tracking-[0.2em] text-white/80" style={headingFont}>
            Help us build a better BXC.
          </p>

          <div className="mt-5 space-y-1 text-[15px] text-gray-300 leading-relaxed" style={bodyFont}>
            <p>Love something? Tell us.</p>
            <p>Think something needs to change? Tell us that too.</p>
          </div>

          {/* QR — centre of the poster */}
          <div className="mt-8 mx-auto w-fit rounded-3xl p-3 bg-[#ccf141] shadow-[0_0_60px_rgba(204,241,65,0.25)]">
            <div className="rounded-2xl bg-white p-3">
              <img
                src={qrSrc(600)}
                alt="QR code to open the Box & Cross feedback form"
                width={240}
                height={240}
                className="w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] block"
              />
            </div>
          </div>

          <p className="mt-6 text-[20px] font-black uppercase tracking-[0.15em] text-[#ccf141]" style={headingFont}>
            Scan the QR code
          </p>

          <p className="mt-4 text-[13px] text-gray-400 leading-relaxed max-w-xs mx-auto" style={bodyFont}>
            Your feedback helps us improve our coaching, equipment, facilities and overall training experience.
          </p>

          <p className="mt-5 inline-block px-3 py-1.5 rounded-full border border-[#ccf141]/30 bg-[#ccf141]/10 text-[11px] font-black uppercase tracking-[0.15em] text-[#ccf141]" style={headingFont}>
            100% honest feedback. No name required.
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white" style={headingFont}>
              It's just never enough.
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gray-500">Box &amp; Cross Performance Arena</p>
          </div>
        </div>
      </main>

      {/* Screen-only controls */}
      <div className="mt-6 w-full max-w-md flex flex-col gap-3 print:hidden">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[#ccf141] text-black text-[13px] font-black uppercase tracking-wider cursor-pointer"
            style={headingFont}
          >
            <Printer size={16} /> Print poster
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/15 text-white text-[13px] font-black uppercase tracking-wider cursor-pointer"
            style={headingFont}
          >
            <Download size={16} /> QR image
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-between gap-3 h-11 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-left cursor-pointer"
        >
          <span className="text-[12px] text-gray-400 truncate font-mono">{url}</span>
          {copied ? <Check size={15} className="text-[#ccf141] shrink-0" /> : <Copy size={15} className="text-gray-400 shrink-0" />}
        </button>
      </div>
    </div>
  );
};

export default FeedbackQR;
