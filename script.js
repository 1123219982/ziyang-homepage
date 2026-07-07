// ============================================
// 科技风个人网站 - 交互脚本
// ============================================

// ===== 1. Canvas 粒子背景 =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0, mouseY = 0;
const particleCount = 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 粒子类
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 1.8 + 0.5;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.hue = Math.random() * 60 + 180; // cyan-blue range
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // 微弱向鼠标吸引力
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.x += dx * 0.0008;
            this.y += dy * 0.0008;
        }

        if (this.y > canvas.height + 10) {
            this.reset();
        }
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
        ctx.fill();
    }
}

// 初始化粒子
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// 连线
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 220, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawLines();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// 鼠标追踪
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 光标光晕
    const glow = document.getElementById('cursorGlow');
    if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
    }
});

document.addEventListener('mouseleave', () => {
    const glow = document.getElementById('cursorGlow');
    if (glow) glow.style.opacity = '0';
});

// ===== 2. 打字机效果 =====
function typewriter(element, texts, speed = 80, pause = 2000) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? speed / 2 : speed;

        if (!isDeleting && charIndex === currentText.length) {
            delay = pause;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1000);
}

const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    typewriter(typewriterEl, [
        'C++开发工程师',
        '高性能计算爱好者',
        '大模型推理探索者',
        'CUDA 加速实践者'
    ], 80, 2000);
}

// ===== 3. 导航栏交互 =====
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// 导航栏滚动阴影
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端菜单
function openMenu() {
    menuBtn.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
});

mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ===== 4. 导航高亮 =====
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    let currentId = '';

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ===== 5. 滚动渐入动画 =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
    '.glass-card, .project-card, .skill-tag, .highlight-item, .award-item'
).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 5) * 0.06 + 's';
    revealObserver.observe(el);
});

// ===== 6. 技能进度条动画 =====
const progressBars = document.querySelectorAll('.progress-bar');
// 初始设为 0
progressBars.forEach(bar => {
    const target = bar.style.width;
    bar.dataset.width = target;
    bar.style.width = '0%';
});

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.dataset.width;
            progressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

progressBars.forEach(bar => progressObserver.observe(bar));

// ===== 7. 项目指标数字动画 =====
function animateMetricValue(element) {
    const target = parseFloat(element.dataset.target);
    if (isNaN(target)) return;

    const isFloat = target % 1 !== 0;
    let current = 0;
    const duration = 1600;
    const steps = 50;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isFloat ? target.toFixed(2) : target;
            clearInterval(timer);
        } else {
            element.textContent = isFloat ? current.toFixed(2) : Math.floor(current);
        }
    }, interval);
}

const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueEls = entry.target.querySelectorAll('.metric-value[data-target]');
            valueEls.forEach(animateMetricValue);
            metricObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const metricsContainer = document.querySelector('.project-metrics');
if (metricsContainer) metricObserver.observe(metricsContainer);

// ===== 8. 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 70;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    });
});

// ===== 9. 照片旋转环速度根据鼠标位置调整 =====
const photoRing = document.querySelector('.photo-ring');
const hero = document.querySelector('.hero');

if (photoRing && hero) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const speed = 2 + (Math.abs(x) + Math.abs(y)) * 6;
        photoRing.style.animationDuration = speed + 's';
    });
}

// ===== 10. 终端光标闪烁 =====
const terminalBody = document.querySelector('.terminal-body');
if (terminalBody) {
    const blink = document.createElement('span');
    blink.className = 'terminal-prompt';
    blink.textContent = ' ▌';
    blink.style.animation = 'none';
    terminalBody.appendChild(blink);

    // 为 blink 添加闪烁
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes terminalBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    blink.style.animation = 'terminalBlink 1s infinite';
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
});
