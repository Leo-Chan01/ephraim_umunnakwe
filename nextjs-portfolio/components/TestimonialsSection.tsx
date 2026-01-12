import React from 'react';
import { useTestimonials } from '../hooks/usePortfolio';
import { LoadingState, EmptyState } from '../components/ui/ConnectionStatus';

export default function TestimonialsSection() {
  const { testimonials, isLoading, error, reload } = useTestimonials();

  if (isLoading) {
    return <LoadingState isLoading={true} message="Loading testimonials..." />;
  }

  if (testimonials.length === 0) {
    return (
      <EmptyState
        title="No testimonials yet"
        description="Check back soon for client feedback!"
        action={{
          label: "Refresh",
          onClick: reload
        }}
      />
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here's what my clients have to say about working with me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {error && (
          <div className="text-center mt-8">
            <p className="text-red-600 mb-2">Failed to load some testimonials</p>
            <button
              onClick={reload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Rating */}
      <div className="mb-4">
        {renderStars(testimonial.rating || 5)}
      </div>

      {/* Message */}
      <blockquote className="text-gray-700 mb-6 italic">
        "{testimonial.message || 'Great work!'}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {(testimonial.author || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900 dark:text-white">
            {testimonial.author || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-500">
            {testimonial.role || 'Client'}
          </p>
        </div>
      </div>

      {/* Date */}
      {testimonial.created_at && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {new Date(testimonial.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
