
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { getActiveHomeBanners } from "../api/api";
import brandFallback from "../assets/images/brandstory.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEFAULT_BANNERS = [
  {
    _id: "default-banner",
    desktopMediaUrl: brandFallback,
    desktopMediaType: "image",
    mobileMediaUrl: brandFallback,
    mobileMediaType: "image",
  },
];

export default function HomeBanner() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(0);

  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect mobile screens and reduced-motion preferences.
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    update();

    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  // Existing backend API - no change to your upload workflow.
  useEffect(() => {
    let cancelled = false;

    async function fetchBanners() {
      try {
        const { data } = await getActiveHomeBanners();

        if (cancelled) return;

        if (data?.success && data?.data?.length) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error("Banner loading failed:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentBanner =
    banners[currentIndex] || banners[0];

  // Select the correct backend-uploaded asset.
  const hasMobileAsset =
    isMobile && Boolean(currentBanner?.mobileMediaUrl);

  const mediaUrl = hasMobileAsset
    ? currentBanner.mobileMediaUrl
    : currentBanner?.desktopMediaUrl || brandFallback;

  const mediaType = hasMobileAsset
    ? currentBanner.mobileMediaType
    : currentBanner?.desktopMediaType;

  const isVideo = mediaType === "video" && !mediaError;

  useEffect(() => {
    setMediaError(false);
    progressRef.current = 0;
  }, [mediaUrl]);

  // GSAP VIDEO + SCROLL ANIMATION
  useGSAP(
    () => {
      if (
        loading ||
        reducedMotion ||
        !sectionRef.current ||
        !mediaRef.current
      ) {
        return;
      }

      const playback = { progress: 0 };

      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },

        scrollTrigger: {
          trigger: sectionRef.current,

          start: "top top",

          // Desktop scroll distance is longer.
          // Mobile scrolling is shorter.
          end: () =>
            "+=" +
            Math.round(
              window.innerHeight *
                (window.innerWidth < 768 ? 1.5 : 2.2)
            ),

          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Tie the video playback position to GSAP progress.
      timeline.to(
        playback,
        {
          progress: 1,
          duration: 1,
          onUpdate: () => {
            progressRef.current = playback.progress;

            if (!isVideo) return;

            const video = videoRef.current;

            if (
              !video ||
              !Number.isFinite(video.duration) ||
              video.duration <= 0
            ) {
              return;
            }

            const endTime = Math.max(
              0,
              video.duration - 0.05
            );

            const targetTime =
              playback.progress * endTime;

            // Avoid unnecessary small seeks.
            if (
              Math.abs(video.currentTime - targetTime) >
              0.06
            ) {
              try {
                video.currentTime = targetTime;
              } catch (error) {
                // Video may not be seekable yet.
              }
            }
          },
        },
        0
      );

      // Cinematic video / image zoom.
      timeline.fromTo(
        mediaRef.current,
        { scale: 1.02 },
        {
          scale: 1.16,
          duration: 1,
        },
        0
      );
    },
    {
      scope: sectionRef,
      dependencies: [
        loading,
        mediaUrl,
        isVideo,
        reducedMotion,
      ],
      revertOnUpdate: true,
    }
  );

  const handleVideoMetadata = (event) => {
    const video = event.currentTarget;

    video.pause();

    if (!Number.isFinite(video.duration)) return;

    const targetTime =
      progressRef.current *
      Math.max(0, video.duration - 0.05);

    video.currentTime = targetTime;
  };

  const nextBanner = () => {
    setCurrentIndex((index) => (index + 1) % banners.length);
  };

  const previousBanner = () => {
    setCurrentIndex(
      (index) => (index - 1 + banners.length) % banners.length
    );
  };

  if (loading) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-black text-[#C8F000]">
        <span className="animate-pulse font-black tracking-[0.3em]">
          BOX & CROSS
        </span>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative mt-20 isolate h-[100svh] min-h-[550px] w-full overflow-hidden bg-[#090909]"
    >
      {/* Responsive backend media */}
      <div
        ref={mediaRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {isVideo ? (
          <video
            key={mediaUrl}
            ref={videoRef}
            src={mediaUrl}
            poster={brandFallback}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoMetadata}
            onError={() => setMediaError(true)}
            className="h-full w-full object-cover object-center"
            aria-hidden="true"
          />
        ) : (
          <img
            key={mediaUrl}
            src={mediaError ? brandFallback : mediaUrl}
            alt="Box & Cross"
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      {/* Subtle bottom gradient to blend into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black to-transparent" />

      {/* Subtle neon accent */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[3px] w-full bg-gradient-to-r from-[#C8F000] via-[#C8F000]/30 to-transparent" />

      {/* Manual banner navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 right-5 z-30 flex gap-2 md:bottom-8 md:right-10">
          <button
            type="button"
            onClick={previousBanner}
            aria-label="Previous banner"
            className="rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md hover:border-[#C8F000] cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextBanner}
            aria-label="Next banner"
            className="rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md hover:border-[#C8F000] cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {!reducedMotion && (
        <div className="pointer-events-none absolute bottom-7 left-5 z-20 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60 md:left-20">
          Scroll to experience ↓
        </div>
      )}
    </section>
  );
}
