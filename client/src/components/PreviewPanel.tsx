import { useState } from "react";
import { DownloadIcon, ImageIcon, Loader2Icon, FileTextIcon, LayoutIcon } from "lucide-react";
import type { IComicImage } from "../../public/assets/assets";
import { motion } from "motion/react";

interface PreviewPanelProps {
  comicImage: IComicImage | null;
  isLoading: boolean;
  comicText: string;
  setComicText: (val: string) => void;
}

const PreviewPanel = ({ comicImage, isLoading, comicText, setComicText }: PreviewPanelProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'script'>('script');

  // ✅ Fixed Download Handler to correctly support Base64 Data URIs safely without opening blank pages
 // No change needed to the interface itself since IComicImage already has panel_images
// But update the onDownload to handle all panels:

const onDownload = () => {
    const panels = comicImage?.panel_images;
    if (!panels?.length) return;

    const PANEL_SIZE = 1024;   // each panel is 1024×1024 from your backend
    const GAP = 8;
    const TITLE_H = 52;
    const CANVAS_W = PANEL_SIZE * 2 + GAP * 3;
    const CANVAS_H = PANEL_SIZE * 2 + GAP * 3 + TITLE_H;

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d")!;

    // Black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Yellow title banner
    ctx.fillStyle = "#FACC15";
    ctx.fillRect(0, 0, CANVAS_W, TITLE_H);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 28px Arial Black, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        (comicImage?.title || "COMIC").toUpperCase(),
        CANVAS_W / 2,
        TITLE_H / 2
    );

    // Grid positions: [col, row] for panels 0-3
    const positions = [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
    ];

    let loaded = 0;

    panels.forEach((src, i) => {
        const img = new Image();
        img.onload = () => {
            const [col, row] = positions[i];
            const x = GAP + col * (PANEL_SIZE + GAP);
            const y = TITLE_H + GAP + row * (PANEL_SIZE + GAP);
            ctx.drawImage(img, x, y, PANEL_SIZE, PANEL_SIZE);

            // Panel number badge
            ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.beginPath();
            ctx.arc(x + 28, y + 28, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(i + 1), x + 28, y + 28);

            loaded++;
            if (loaded === panels.length) {
                // All panels drawn — trigger download
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${comicImage?.title || "comic"}-full.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, "image/png");
            }
        };
        img.src = src;
    });
};
  return (
    <motion.div
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <div className="space-y-4 w-full max-w-6xl mx-auto border border-white/10 rounded-2xl bg-white/5  shadow-xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1   border border-white/10 w-cover items-center justify-around ">
          
          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center  gap-2 px-4 py-2 rounded-lg w-1/2 text-sm font-medium  transition-all ${
              activeTab === 'script'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileTextIcon className="size-4" />
            The Script
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg w-1/2 text-sm font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutIcon className="size-4" />
            Comic Preview
          </button>
        </div>

        {/* Content Area */}
        <div className="relative overflow-hidden min-h-112.5 ">
          {activeTab === 'preview' ? (
            <div className="h-full min-h-112.5 flex flex-col">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
                  <Loader2Icon className="size-8 animate-spin text-purple-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-200">AI is generating your comic</p>
                    <p className="mt-1 text-xs text-zinc-400">This may take 10-20 seconds</p>
                  </div>
                </div>
              )}

              {/* Comic Image */}
              {/* Comic Panels Grid */}
{!isLoading && comicImage?.panel_images && comicImage.panel_images.length > 0 ? (
    <div className="p-3 space-y-3">
        
        {/* Title banner */}
        {comicImage.title && (
            <div className="text-center font-black text-base uppercase tracking-widest 
                            bg-yellow-400 text-black py-1 rounded-md border-2 border-black">
                {comicImage.title}
            </div>
        )}

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-2">
            {comicImage.panel_images.map((src, i) => (
                <div
                    key={i}
                    className="relative border-2 border-black rounded-md overflow-hidden aspect-square bg-zinc-900"
                >
                    <img
                        src={src}
                        alt={`Panel ${i + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {/* Panel number badge */}
                    <span className="absolute top-1.5 left-1.5 bg-black text-white 
                                     text-xs font-black px-2 py-0.5 rounded-full border border-white/20">
                        {i + 1}
                    </span>
                </div>
            ))}
        </div>

        {/* Download button */}
        <button
            onClick={onDownload}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg 
                       bg-white/10 hover:bg-white/20 text-white text-sm font-medium 
                       transition-all hover:scale-[1.02] active:scale-95"
        >
            <DownloadIcon className="size-4" />
            Download All Panels
        </button>
    </div>

) : !isLoading && comicImage?.image_url ? (
    /* Fallback: single image_url if panel_images not present */
    <div className="group relative h-full w-full aspect-video">
        <img
            src={comicImage.image_url}
            alt={comicImage.title || "Generated Comic"}
            className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-black/20 
                        opacity-0 transition-opacity group-hover:opacity-100">
            <button
                onClick={onDownload}
                type="button"
                className="mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 
                           text-xs font-medium transition bg-white/90 text-black 
                           hover:scale-105 active:scale-95"
            >
                <DownloadIcon className="size-4" />
                Download
            </button>
        </div>
    </div>

) : (
    /* Empty state */
    !isLoading && (
        <div className="flex flex-col items-center justify-center h-112.5 gap-4">
            <div className="flex size-20 items-center justify-center rounded-full bg-white/5">
                <ImageIcon className="size-10 text-white opacity-20" />
            </div>
            <div className="text-center">
                <p className="text-zinc-200 font-medium">No image generated yet</p>
                <p className="text-xs text-zinc-500">Fill the form and click generate</p>
            </div>
        </div>
    )
)}
            </div>
          ) : (
            /* Script Tab */
            <div className="p-2 h-full">
              <textarea
                value={comicText}
                onChange={(e) => setComicText(e.target.value)}
                placeholder="The story unfolds here..."
                className="w-full h-107.5 px-4 py-3 rounded-xl border-none bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors resize-none custom-scrollbar"
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewPanel;