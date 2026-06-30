// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Back to top button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        gsap.to(backToTopButton, { opacity: 1, y: 0, duration: 0.3 });
    } else {
        gsap.to(backToTopButton, { opacity: 0, y: 10, duration: 0.3 });
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// GSAP Animations
gsap.from('nav', { 
    y: -100, 
    opacity: 0, 
    duration: 0.8, 
    ease: "power3.out" 
});

// Removed old hero animations

// Scroll-triggered animations
gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });
});

// Removed mojs burst animations

// Add hover effects to menu items
document.querySelectorAll('.transform').forEach(item => {
    item.addEventListener('mouseenter', function() {
        gsap.to(this, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    
    item.addEventListener('mouseleave', function() {
        gsap.to(this, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
});

// Removed steam animations
