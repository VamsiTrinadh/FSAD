import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    id: 1,
    title: "Find & Book Premium Events",
    subtitle: "College fests, tech conferences, workshops & more — all in one place.",
    badge: "Event Ticket Booking Platform",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(to right, rgba(26,26,46,0.9), rgba(15,52,96,0.6))"
  },
  {
    id: 2,
    title: "Discover Technical Workshops",
    subtitle: "Level up your skills with hands-on sessions from industry experts.",
    badge: "Skill Development",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(to right, rgba(15,52,96,0.95), rgba(233,69,96,0.5))"
  },
  {
    id: 3,
    title: "Experience Cultural Fests",
    subtitle: "Dance, music, theater, and non-stop entertainment awaits you.",
    badge: "Live Entertainment",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(to right, rgba(20,20,40,0.9), rgba(46,125,50,0.5))"
  }
];

function HeroCarousel({ events }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(curr => (curr + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel-container">
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`hero-slide ${index === currentSlide ? 'slide-active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-slide-overlay" style={{ background: slide.gradient }}></div>
          <div className="hero-slide-content">
            <div className="header-badge animate-fade-in-up">{slide.badge}</div>
            <h1 className="header-title animate-fade-in-up delay-1">{slide.title}</h1>
            <p className="header-tagline animate-fade-in-up delay-2">{slide.subtitle}</p>
            
            {index === 0 && events.length > 0 && (
               <div className="header-stats animate-fade-in-up delay-3">
                 <span>📅 {events.length} Events</span>
                 <span>🌐 {events.filter(e => e.type === 'outside').length} Outside</span>
                 <span>🏫 {events.filter(e => e.type === 'college').length} College</span>
               </div>
            )}
          </div>
        </div>
      ))}
      
      <div className="hero-dots">
        {SLIDES.map((_, index) => (
          <button 
            key={index} 
            className={`hero-dot ${index === currentSlide ? 'dot-active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
