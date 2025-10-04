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
      className="relative max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 cursor-grab active:cursor-grabbing"
          >
            <TestimonialContent testimonial={testimonials[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-400 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {testimonials.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}

      {/* Counter and keyboard hint */}
      {testimonials.length > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-gray-400 text-sm">
            Use ← → keys or swipe to navigate
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
            {currentIndex + 1} / {testimonials.length}
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialContent({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="text-center">
      {/* Quote icon */}
      <div className="mb-6">
        <svg
          className="w-12 h-12 text-blue-400 mx-auto opacity-60"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>

      {/* Rating stars */}
      <div className="flex justify-center mb-6">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className={`text-2xl ${
              i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      {/* Testimonial message */}
      <blockquote className="text-xl md:text-2xl text-gray-300 mb-8 italic font-light leading-relaxed">
        "{testimonial.message}"
      </blockquote>

      {/* Author info */}
      <div className="flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {testimonial.avatar_url ? (
            <img 
              src={testimonial.avatar_url} 
              alt={testimonial.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{testimonial.author.charAt(0).toUpperCase()}</span>
          )}
        </motion.div>
        <div className="text-left">
          <p className="text-white font-semibold text-lg">{testimonial.author}</p>
          <p className="text-gray-400">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
