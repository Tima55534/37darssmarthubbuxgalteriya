const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
const totalSlides = slides.length;
let currentSlide = 0;

function showSlide(index) {
    if (index < 0) {
        currentSlide = 0;
    } else if (index >= totalSlides) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, i) => {
        if (i === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update Progress Bar
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;

    // Trigger Fireworks on Last Slide
    if (currentSlide === totalSlides - 1) {
        startFireworks();
    } else {
        stopFireworks();
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// Touch Navigation Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide(); // Swiped Left -> Next
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide(); // Swiped Right -> Prev
    }
}

// Initialize
showSlide(0);

// Simple Fireworks implementation
let fireworksInterval;
function startFireworks() {
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    function createParticle(x, y) {
        return {
            x, y,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 6 - 3,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 100
        };
    }

    fireworksInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.1) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            for (let i = 0; i < 20; i++) particles.push(createParticle(x, y));
        }

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 100;
            ctx.fillRect(p.x, p.y, 3, 3);
            if (p.life <= 0) particles.splice(i, 1);
        });
    }, 30);
}

function stopFireworks() {
    clearInterval(fireworksInterval);
    const canvas = document.getElementById('fireworks');
    if (canvas) {
        canvas.style.display = 'none';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
