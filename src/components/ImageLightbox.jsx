import { useState, useRef, useEffect, useCallback } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from "@heroicons/react/24/outline";

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(null);
  const containerRef = useRef(null);

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const goNext = useCallback(() => {
    if (currentIdx < images.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      resetZoom();
    }
  }, [currentIdx, images.length]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      resetZoom();
    }
  }, [currentIdx]);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging || zoom <= 1) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  // Touch swipe for navigation + pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && zoom <= 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 1 && zoom > 1) {
      setDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (dragging && zoom > 1 && e.touches.length === 1) {
      setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    }
  };

  const handleTouchEnd = (e) => {
    setDragging(false);
    if (touchStart && zoom <= 1) {
      const deltaX = e.changedTouches[0].clientX - touchStart.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) goNext();
        else goPrev();
      }
      setTouchStart(null);
    }
  };

  // Double tap to zoom
  const lastTap = useRef(0);
  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (zoom > 1) {
      resetZoom();
    } else {
      setZoom(2.5);
      // Center zoom on click point
      const rect = containerRef.current.getBoundingClientRect();
      const x = -(e.clientX - rect.width / 2) * 1.5;
      const y = -(e.clientY - rect.height / 2) * 1.5;
      setPosition({ x, y });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 relative z-10">
        <div className="text-white/70 text-sm font-medium">
          {currentIdx + 1} / {images.length}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="p-2 sm:p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          <span className="text-white/50 text-xs font-mono min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 4}
            className="p-2 sm:p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block" />
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          src={images[currentIdx]}
          alt={`Image ${currentIdx + 1}`}
          draggable={false}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transitionDuration: dragging ? "0ms" : "200ms",
          }}
        />

        {/* Navigation Arrows — hidden when zoomed */}
        {zoom <= 1 && images.length > 1 && (
          <>
            {currentIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl sm:rounded-2xl transition-all active:scale-95"
              >
                <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {currentIdx < images.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl sm:rounded-2xl transition-all active:scale-95"
              >
                <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-4 py-3 sm:py-4 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIdx(idx); resetZoom(); }}
              className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                currentIdx === idx
                  ? "border-white shadow-lg scale-110"
                  : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Hint */}
      <div className="text-center pb-3 sm:hidden">
        <span className="text-white/30 text-[10px]">Swipe to navigate · Double-tap to zoom</span>
      </div>
    </div>
  );
}
