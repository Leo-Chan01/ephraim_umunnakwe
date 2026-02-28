import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types/portfolio';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      goToPrev();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key >= '1' && event.key <= '9') {
      const index = parseInt(event.key) - 1;
      if (index < testimonials.length) {
        goToSlide(index);
      }
    }
  }, [goToNext, goToPrev, goToSlide, testimonials.length]);

  // Touch/swipe support
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrev();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, goToNext]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden border-2 border-neutral-900 dark:border-neutral-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="bg-secondary dark:bg-primary p-12 md:p-20 cursor-grab active:cursor-grabbing"
          >
            <TestimonialContent testimonial={testimonials[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows - Bordered buttons */}
      {testimonials.length > 1 && (
        <div className="flex justify-end border-x-2 border-b-2 border-neutral-900 dark:border-neutral-800 bg-neutral-900 dark:bg-neutral-800">
          <button
            onClick={goToPrev}
            className="w-16 h-16 border-r-2 border-neutral-800 dark:border-neutral-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="w-16 h-16 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Dots indicator - Minimalist squares */}
      {testimonials.length > 1 && (
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 transition-all duration-300 border border-neutral-900 dark:border-neutral-500 ${index === currentIndex
                ? 'bg-accent border-accent scale-125'
                : 'bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar - Solid accent */}
      {testimonials.length > 1 && isAutoPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}

function TestimonialContent({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="text-center md:text-left flex flex-col md:flex-row gap-12 items-center">
      {/* Author info - Large, architectural */}
      <div className="shrink-0">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-neutral-900 border-4 border-neutral-900 dark:border-accent flex items-center justify-center text-white font-black text-6xl relative overflow-hidden">
          {testimonial.avatar_url ? (
            <img
              src={testimonial.avatar_url}
              alt={testimonial.author}
              className="w-full h-full object-cover grayscale active:grayscale-0 transition-all duration-500"
            />
          ) : (
            <span>{testimonial.author.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>

      <div className="flex-grow">
        {/* Rating - Minimalist */}
        <div className="flex justify-center md:justify-start mb-6 gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg font-black ${i < (testimonial.rating || 5) ? 'text-accent' : 'text-neutral-300 dark:text-neutral-700'
                }`}
            >
              /
            </span>
          ))}
        </div>

        {/* Testimonial message */}
        <blockquote className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-200 mb-8 leading-snug">
          "{testimonial.message}"
        </blockquote>

        <div className="border-t-2 border-neutral-900 dark:border-neutral-800 pt-6">
          <p className="text-neutral-900 dark:text-secondary font-black text-xl uppercase tracking-widest">{testimonial.author}</p>
          <p className="text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-wider text-sm mt-1">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
