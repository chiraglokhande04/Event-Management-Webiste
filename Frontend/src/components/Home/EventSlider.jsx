import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, DollarSign } from 'lucide-react';
const { useEvents } = require('../../context/EventContext');

const EventSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {events,loading,error} = useEvents();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleViewDetails = (eventId) => {
    console.log(`Navigating to event details: ${eventId}`);
    // In a real app: navigate(`/event/${eventId}`)
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-purple-200 text-lg">Discover amazing experiences near you</p>
        </div>

        <div className="relative">
          {/* Main Slider */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {events.map((event) => (
                <div key={event.id} className="min-w-full px-4">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="md:flex">
                      {/* Image Section */}
                      <div className="md:w-1/2 relative overflow-hidden group">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-80 md:h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Content Section */}
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                            {event.title}
                          </h2>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3 group">
                              <div className="mt-1 p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <MapPin className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Location</p>
                                <p className="text-gray-700 font-semibold">{event.location}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                              <div className="mt-1 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Date</p>
                                <p className="text-gray-700 font-semibold">{formatDate(event.startDate)}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                              <div className="mt-1 p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Price</p>
                                <p className="text-gray-700 font-bold text-xl">
                                  {event.cost === 0 ? 'Free' : `$${event.cost.toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewDetails(event.id)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          View Event Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-blue-500'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Event Counter */}
        <div className="text-center mt-8">
          <p className="text-purple-200 text-sm font-medium">
            Event {currentIndex + 1} of {events.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventSlider;