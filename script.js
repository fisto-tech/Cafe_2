// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scrolling
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
});

window.lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  window.lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Simple text preloader
function initTextPreloader() {
    const preloader = document.getElementById('text-preloader');
    const progressText = document.getElementById('progress-text');
    
    if (!preloader || !progressText) return;

    let progress = { value: 0 };
    
    gsap.to(progress, {
        value: 100,
        duration: 2, // 2 seconds loading simulation
        ease: "power1.inOut",
        onUpdate: function() {
            progressText.innerText = Math.round(progress.value) + '%';
        },
        onComplete: function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700); // Matches the duration-700 CSS class
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTextPreloader();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Back to top button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        gsap.to(backToTopButton, { autoAlpha: 1, y: 0, duration: 0.3, pointerEvents: 'auto' });
    } else {
        gsap.to(backToTopButton, { autoAlpha: 0, y: 10, duration: 0.3, pointerEvents: 'none' });
    }
});

backToTopButton.addEventListener('click', () => {
    if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.5 });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});





// Removed old hero animations



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

// Stats Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        
        stat.counter = 0; // Initialize custom property
        
        gsap.to(stat, {
            counter: target,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#stats",
                start: "top 80%", // Matches the section reveal
                once: true
            },
            onUpdate: () => {
                stat.innerHTML = Math.ceil(stat.counter) + suffix;
            }
        });
    });
}

// Our Journey Timeline Animations
// Wrapped in 'load' to ensure DOM + images are ready before ScrollTrigger calculates positions
window.addEventListener('load', function() {
    const journeySection = document.getElementById('journey');
    if (!journeySection) return;

    const isMobile = window.innerWidth < 768;

    // 0. Header area fade-in
    const journeyHeader = journeySection.querySelector('.mb-24');
    if (journeyHeader) {
        gsap.from(Array.from(journeyHeader.children), {
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: journeyHeader,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // 1. Center vertical line draw animation (desktop only)
    const centerLine = journeySection.querySelector('.w-px.bg-\\[\\#8D5833\\]\\/30');
    if (centerLine && !isMobile) {
        gsap.from(centerLine, {
            scaleY: 0,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
                trigger: journeySection,
                start: 'top 40%',
                end: 'bottom 85%',
                scrub: 1
            }
        });
    }

    // 2. Each timeline item — image + text
    // HTML structure per item: div.group > [div(image)] [div(center-bubble, desktop)] [div(text)]
    // On mobile: only 2 children (image-wrapper, text-wrapper)
    // On desktop: 3 children (image-wrapper, center-bubble, text-wrapper)
    const timelineItems = journeySection.querySelectorAll('.group');

    timelineItems.forEach(function(item, index) {
        const isEven = index % 2 !== 0;
        const children = Array.from(item.children);

        // Image wrapper is always the first child
        const imageWrapper = children[0];
        // Text wrapper is always the last child
        const textWrapper = children[children.length - 1];
        // Center bubble is the middle child (only on desktop)
        const centerBubble = children.length === 3 ? children[1].querySelector('.w-14') : null;

        const st = {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
        };

        // Animate image
        if (imageWrapper) {
            gsap.from(imageWrapper, {
                x: isMobile ? 0 : (isEven ? 80 : -80),
                y: isMobile ? 50 : 0,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: st
            });
        }

        // Animate center number bubble (desktop only)
        if (centerBubble) {
            gsap.from(centerBubble, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'back.out(1.7)',
                scrollTrigger: st
            });
        }

        // Animate text children with stagger
        if (textWrapper && textWrapper.children.length > 0) {
            gsap.from(Array.from(textWrapper.children), {
                x: isMobile ? 0 : (isEven ? -60 : 60),
                y: isMobile ? 30 : 0,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                delay: 0.2,
                ease: 'power2.out',
                scrollTrigger: st
            });
        }
    });

    // 3. Footer CTA box
    const footerBox = journeySection.querySelector('.mt-16');
    if (footerBox) {
        gsap.from(footerBox, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: footerBox,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Refresh ScrollTrigger so Lenis + layout changes are accounted for
    ScrollTrigger.refresh();
});

// Process Sequence Scroll Video Animation
const processSequenceSection = document.getElementById('process-sequence');
if (processSequenceSection) {
    const canvas = document.getElementById('process-canvas');
    const ctx = canvas.getContext('2d');
    const gateLeft = document.getElementById('gate-left');
    const gateRight = document.getElementById('gate-right');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const frameCount = 356;
    const images = [];
    const frameObj = { frame: 1 };
    
    // Create image sequence URLs
    const currentFrame = index => `assets/Coffee_frame/${index.toString().padStart(5, '0')}.webp`;

    // Initial Image Load
    const img = new Image();
    img.src = currentFrame(1);
    img.onload = () => {
        renderFrame(1);
    };
    images[1] = img;

    // Smart preloader - loads sequentially in background
    for (let i = 2; i <= frameCount; i++) {
        const preImg = new Image();
        preImg.src = currentFrame(i);
        images[i] = preImg;
    }

    function renderFrame(index) {
        index = Math.round(index);
        if (!images[index] || !images[index].complete) return;
        
        const img = images[index];
        // Calculate crop to perfectly cover canvas
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio  = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width*ratio) / 2;
        const centerShift_y = (canvas.height - img.height*ratio) / 2;  
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0,0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);  
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(frameObj.frame);
    });

    // GSAP Timeline
    const tlProcess = gsap.timeline({
        scrollTrigger: {
            trigger: processSequenceSection,
            start: "top top",
            end: "+=400%", // 400vh scroll duration
            pin: true,
            scrub: 1.5, // 1.5s smoothing
        }
    });

    // Phase 1: Open the Gates
    tlProcess.to(gateLeft, { xPercent: -100, duration: 1, ease: "power2.inOut" }, 0)
             .to(gateRight, { xPercent: 100, duration: 1, ease: "power2.inOut" }, 0);

    // Phase 2: Play the Video (Frame Sequence)
    tlProcess.to(frameObj, {
        frame: frameCount - 1, // Stop right before the very end to prevent flickering
        ease: "none",
        duration: 3,
        onUpdate: () => renderFrame(frameObj.frame)
    }, 0.5); // Start scrub video halfway through the gate opening
}

// Locations Interactive Pinned Animation
const locationsInteractiveSection = document.getElementById('locations-interactive');
if (locationsInteractiveSection) {
    const slides = locationsInteractiveSection.querySelectorAll('.full-screen-slide');
    const dots = locationsInteractiveSection.querySelectorAll('.location-dot');
    
    // Create a GSAP MatchMedia instance for responsive ScrollTriggers
    let mm = gsap.matchMedia();

    // Desktop and Tablet (where panels are side-by-side)
    mm.add("(min-width: 768px)", () => {
        const img1 = slides[0].querySelector('.slide-img');
        const content1 = slides[0].querySelector('.slide-content');
        const img2 = slides[1].querySelector('.slide-img');
        const content2 = slides[1].querySelector('.slide-content');
        const img3 = slides[2].querySelector('.slide-img');
        const content3 = slides[2].querySelector('.slide-content');

        // Setup initial states for vertical scroll
        // Override the CSS opacity/translate on the slides so we can just animate the inner panels
        gsap.set([slides[1], slides[2]], { opacity: 1, y: 0, yPercent: 0 });
        
        // Push the incoming panels out of view
        gsap.set(img2, { yPercent: -100 });
        gsap.set(content2, { yPercent: 100 });
        gsap.set(img3, { yPercent: -100 });
        gsap.set(content3, { yPercent: 100 });

        // Create a master timeline that pins the section and scrubs
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: locationsInteractiveSection,
                start: "top top",
                end: "+=120%",
                pin: true,
                scrub: 0.5,
                snap: {
                    snapTo: [0, 1.25 / 3, 2.75 / 3],
                    duration: { min: 0.2, max: 0.8 },
                    delay: 0.05,
                    ease: "power2.inOut"
                }
            }
        });

        // Transition from Slide 1 to Slide 2
        tl.to(content1, { yPercent: -100, duration: 1, ease: "power2.inOut" }, "slide2")
          .to(img1, { yPercent: 100, duration: 1, ease: "power2.inOut" }, "slide2")
          .to(content2, { yPercent: 0, duration: 1, ease: "power2.inOut" }, "slide2")
          .to(img2, { yPercent: 0, duration: 1, ease: "power2.inOut" }, "slide2")
          .to(dots[0], { scale: 1, opacity: 0.5, filter: "grayscale(100%)", borderColor: "transparent", duration: 1 }, "slide2")
          .to(dots[1], { scale: 1.25, opacity: 1, filter: "grayscale(0%)", borderColor: "white", duration: 1 }, "slide2");

        // Add a slight pause
        tl.to({}, { duration: 0.5 }); 

        // Transition from Slide 2 to Slide 3
        tl.to(content2, { yPercent: -100, duration: 1, ease: "power2.inOut" }, "slide3")
          .to(img2, { yPercent: 100, duration: 1, ease: "power2.inOut" }, "slide3")
          .to(content3, { yPercent: 0, duration: 1, ease: "power2.inOut" }, "slide3")
          .to(img3, { yPercent: 0, duration: 1, ease: "power2.inOut" }, "slide3")
          .to(dots[1], { scale: 1, opacity: 0.5, filter: "grayscale(100%)", borderColor: "transparent", duration: 1 }, "slide3")
          .to(dots[2], { scale: 1.25, opacity: 1, filter: "grayscale(0%)", borderColor: "white", duration: 1 }, "slide3");

        // Add a slight pause at the very end before unpinning
        tl.to({}, { duration: 0.5 });
    });
    


    // Add Click Navigation for Dots and Arrows
    const arrowUp = document.getElementById('loc-arrow-up');
    const arrowDown = document.getElementById('loc-arrow-down');

    const getScrollPos = (index) => {
        const st = ScrollTrigger.getAll().find(s => s.trigger === locationsInteractiveSection && s.pin);
        if (!st) return window.scrollY;
        // Total duration is 3. Slide 0 starts at 0. Slide 1 pauses around 1.25. Slide 2 pauses around 2.75.
        const progress = index === 0 ? 0 : index === 1 ? (1.25 / 3) : (2.75 / 3);
        return st.start + (st.end - st.start) * progress;
    };

    const getCurrentSlideIndex = (st) => {
        if (!st) return 0;
        const p = st.progress;
        if (p < 0.3) return 0;
        if (p < 0.8) return 1;
        return 2;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (window.lenis) {
                window.lenis.scrollTo(getScrollPos(index), { duration: 1.5 });
            } else {
                window.scrollTo({ top: getScrollPos(index), behavior: 'smooth' });
            }
        });
    });

    if (arrowUp && arrowDown) {
        arrowUp.addEventListener('click', () => {
            const st = ScrollTrigger.getAll().find(s => s.trigger === locationsInteractiveSection && s.pin);
            if (!st) return;
            const current = getCurrentSlideIndex(st);
            if (current > 0) {
                if (window.lenis) {
                    window.lenis.scrollTo(getScrollPos(current - 1), { duration: 1.5 });
                } else {
                    window.scrollTo({ top: getScrollPos(current - 1), behavior: 'smooth' });
                }
            }
        });

        arrowDown.addEventListener('click', () => {
            const st = ScrollTrigger.getAll().find(s => s.trigger === locationsInteractiveSection && s.pin);
            if (!st) return;
            const current = getCurrentSlideIndex(st);
            if (current < 2) {
                if (window.lenis) {
                    window.lenis.scrollTo(getScrollPos(current + 1), { duration: 1.5 });
                } else {
                    window.scrollTo({ top: getScrollPos(current + 1), behavior: 'smooth' });
                }
            }
        });
    }
}

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuBackdrop) return;
    mobileMenu.style.display = 'flex';
    mobileMenuBackdrop.style.display = 'block';
    mobileMenuBackdrop.style.pointerEvents = 'auto';
    
    // Use requestAnimationFrame to allow display:flex to apply before transition
    requestAnimationFrame(() => {
        mobileMenu.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        mobileMenu.style.transform = 'translateX(0%)';
        mobileMenuBackdrop.style.transition = 'opacity 0.4s ease';
        mobileMenuBackdrop.style.opacity = '1';
    });
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBackdrop) return;
    mobileMenu.style.transition = 'transform 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19)';
    mobileMenu.style.transform = 'translateX(100%)';
    mobileMenuBackdrop.style.transition = 'opacity 0.4s ease';
    mobileMenuBackdrop.style.opacity = '0';
    mobileMenuBackdrop.style.pointerEvents = 'none';
    
    setTimeout(() => {
        mobileMenu.style.display = 'none';
        mobileMenuBackdrop.style.display = 'none';
    }, 420);
}

if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    }
}

// Smooth Scrolling for all anchor links using Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (typeof closeMobileMenu === 'function') {
                closeMobileMenu();
            }

            if (window.lenis) {
                // If the target is locations-interactive, we might need a specific offset to hit the pin perfectly
                const offset = targetId === '#locations-interactive' ? 0 : -64; // 64px is height of navbar
                window.lenis.scrollTo(targetElement, { duration: 1.5, offset: offset });
            } else {
                window.scrollTo({
                    top: targetElement.offsetTop - 64,
                    behavior: 'smooth'
                });
            }
        }
    });
});



// ==========================================
// 2. Global Section GSAP Animations
// ==========================================
// Exclude sections that already have complex bespoke animations
const excludedSections = ['#journey', '#locations-interactive'];
const allSections = document.querySelectorAll('section');

allSections.forEach(section => {
    const sectionId = '#' + section.id;
    if (excludedSections.includes(sectionId)) return;
    
    // Select headers, paragraphs, and standard image cards inside this section
    const animatedElements = section.querySelectorAll('h2, h3, p:not(.bean-headline):not(.text-\\[10px\\]), img.shadow-2xl');
    
    if (animatedElements.length > 0) {
        gsap.from(animatedElements, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }
});
