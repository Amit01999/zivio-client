import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
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

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const displayImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <>
      <div className="grid grid-cols-4 gap-2 md:gap-3" data-testid="gallery-container">
        <div
          className="col-span-4 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl cursor-pointer group"
          onClick={() => {
            setCurrentIndex(0);
            setLightboxOpen(true);
          }}
        >
          <div className="aspect-[4/3] md:aspect-auto md:h-full relative">
            {!loadedImages.has(0) && <Skeleton className="absolute inset-0" />}
            <img
              src={displayImages[0]}
              alt={`${title} - Main`}
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                loadedImages.has(0) ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(0)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-3 right-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>

        {displayImages.slice(1, 5).map((image, idx) => (
          <div
            key={idx + 1}
            className={`relative overflow-hidden rounded-xl cursor-pointer group ${
              idx >= 2 ? "hidden md:block" : ""
            }`}
            onClick={() => {
              setCurrentIndex(idx + 1);
              setLightboxOpen(true);
            }}
          >
            <div className="aspect-[4/3] relative">
              {!loadedImages.has(idx + 1) && <Skeleton className="absolute inset-0" />}
              <img
                src={image}
                alt={`${title} - ${idx + 2}`}
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  loadedImages.has(idx + 1) ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(idx + 1)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {idx === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-xl">
                    +{remainingCount} more
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {images.length > 1 && (
          <Button
            variant="outline"
            className="absolute bottom-4 left-4 gap-2 md:hidden"
            onClick={() => setLightboxOpen(true)}
            data-testid="button-view-all-images"
          >
            <Grid3X3 className="h-4 w-4" />
            View All ({images.length})
          </Button>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAllImages(!showAllImages)}
                className="text-white hover:bg-white/20"
                data-testid="button-toggle-grid"
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  data-testid="button-close-lightbox"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>

            {showAllImages ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowAllImages(false);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${title} - ${idx + 1}`}
                        className={`h-full w-full object-cover hover:scale-105 transition-transform ${
                          idx === currentIndex ? "ring-2 ring-primary" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center justify-center p-4 pt-16">
                  <img
                    src={images[currentIndex]}
                    alt={`${title} - ${currentIndex + 1}`}
                    className="max-h-[75vh] max-w-full object-contain"
                    data-testid="lightbox-main-image"
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={goToPrevious}
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={goToNext}
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
                  <span className="text-white text-sm">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>

                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80%] overflow-x-auto p-2 scrollbar-hide">
                  {images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-16 w-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                        idx === currentIndex
                          ? "ring-2 ring-primary scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}