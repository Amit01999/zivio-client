import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface PropertyGalleryProProps {
  images: string[];
  title: string;
}

export function PropertyGalleryPro({ images, title }: PropertyGalleryProProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  // For gallery display: show first 5 images
  const galleryImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;

  return (
    <>
      {/* Professional Real Estate Gallery Layout */}
      <div className="w-full" data-testid="gallery-container-pro">
        {galleryImages.length === 1 ? (
          // Single image layout
          <div
            className="relative w-full h-[500px] rounded-xl overflow-hidden cursor-pointer group bg-muted"
            onClick={() => setLightboxOpen(true)}
          >
            {imageErrors.has(0) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Failed to load image</p>
              </div>
            ) : (
              <>
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImageError(0)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="h-4 w-4" />
                  View Full Size
                </Button>
              </>
            )}
          </div>
        ) : (
          // Multi-image grid layout
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {/* Main large image - takes up 2x2 grid on larger screens */}
            <div
              className="col-span-4 md:col-span-2 md:row-span-2 relative h-[300px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer group bg-muted"
              onClick={() => {
                setCurrentIndex(0);
                setLightboxOpen(true);
              }}
            >
              {imageErrors.has(0) ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Failed to load image</p>
                </div>
              ) : (
                <>
                  <img
                    src={images[0]}
                    alt={`${title} - Main`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(0)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  {/* View Gallery Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4" />
                    View All {images.length} Photos
                  </Button>
                  {/* Image Counter */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    1 / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail images - right side grid */}
            {galleryImages.slice(1, 5).map((image, idx) => {
              const imageIndex = idx + 1;
              const isLastThumbnail = idx === 3 && hasMoreImages;

              return (
                <div
                  key={imageIndex}
                  className="col-span-2 md:col-span-1 relative h-[150px] md:h-[245px] rounded-xl overflow-hidden cursor-pointer group bg-muted"
                  onClick={() => {
                    setCurrentIndex(imageIndex);
                    setLightboxOpen(true);
                  }}
                >
                  {imageErrors.has(imageIndex) ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <img
                        src={image}
                        alt={`${title} - ${imageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(imageIndex)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                      {/* Show count overlay on last thumbnail if more images */}
                      {isLastThumbnail && (
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                          <div className="text-center text-white">
                            <p className="text-2xl font-bold">+{images.length - 5}</p>
                            <p className="text-sm">More Photos</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox/Modal Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Close Button */}
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                data-testid="button-close-lightbox-pro"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>

            {/* Main Image Display */}
            <div
              className="flex-1 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
              onClick={goToNext}
              title="Click to view next image"
            >
              {imageErrors.has(currentIndex) ? (
                <div className="flex flex-col items-center justify-center text-white pointer-events-none">
                  <ImageOff className="h-16 w-16 mb-4 text-white/60" />
                  <p className="text-lg">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={images[currentIndex]}
                  alt={`${title} - ${currentIndex + 1}`}
                  className="max-h-full max-w-full object-contain select-none"
                  data-testid="lightbox-main-image-pro"
                  onError={() => handleImageError(currentIndex)}
                  draggable={false}
                />
              )}
            </div>

            {/* Navigation Arrows - Always Visible */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white hover:bg-white/90 text-black shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  data-testid="button-prev-image-pro"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white hover:bg-white/90 text-black shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  data-testid="button-next-image-pro"
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div
              className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-40"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
                    {images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`relative flex-shrink-0 h-16 w-24 sm:h-20 sm:w-32 rounded-lg overflow-hidden transition-all border-2 ${
                          idx === currentIndex
                            ? "ring-2 ring-white border-white scale-105 opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-white/50"
                        }`}
                        title={`View image ${idx + 1}`}
                      >
                        {imageErrors.has(idx) ? (
                          <div className="h-full w-full flex items-center justify-center bg-muted/50">
                            <ImageOff className="h-4 w-4 text-white/40" />
                          </div>
                        ) : (
                          <img
                            src={image}
                            alt={`Thumbnail ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
