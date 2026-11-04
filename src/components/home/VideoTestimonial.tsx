import { useState } from "react";
import { Play, Quote } from "lucide-react";

export type VideoTestimonialData = { videoId: string; name: string; role: string };

/** Same card look as the old text testimonials, with a YouTube Short in place of the quote text. */
export function VideoTestimonial({ t }: { t: VideoTestimonialData }) {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <Quote className="h-8 w-8 fill-gold text-gold" />
      <div className="mt-4 flex flex-1 items-center justify-center">
        <div className="relative aspect-[9/16] w-full max-w-[250px] overflow-hidden rounded-xl bg-navy">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${t.videoId}?autoplay=1&rel=0&playsinline=1`}
              title={`${t.name} – MarketJoy client video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${t.name}`}
              className="group absolute inset-0 h-full w-full"
            >
              <img
                src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-navy/20 transition group-hover:bg-navy/10" />
              <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-navy shadow-lift transition group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-navy" />
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
