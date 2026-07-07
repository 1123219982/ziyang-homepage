// ===== 导航栏交互 =====
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks = document.querySelectorAll('.nav-link');

// 滚动 - 导航栏阴影
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
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
    if (mobileMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// ===== 导航高亮 =====
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.scrollY + 80;

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

// ===== 滚动渐入动画 (Intersection Observer) =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 为所有关键元素添加 reveal 动画
document.querySelectorAll([
    '.about-card',
    '.skill-card',
    '.edu-item',
    '.project-hero',
    '.activity-card',
    '.award-category',
    '.contact-item',
    '.skill-tag'
].join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    revealObserver.observe(el);
});

// 段落也添加动画
document.querySelectorAll('.activity-desc p').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = i * 0.1 + 's';
    revealObserver.observe(el);
});

// ===== 性能指标数字递增动画 =====
function animateMetric(element) {
    const valueEl = element.querySelector('.metric-value');
    if (!valueEl) return;

    const text = valueEl.textContent.trim();
    // 提取数字部分
    const match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const targetNum = parseFloat(match[1]);
    const suffix = match[2];

    if (isNaN(targetNum)) return;

    let current = 0;
    const duration = 1500;
    const steps = 60;
    const increment = targetNum / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
            valueEl.textContent = targetNum + suffix;
            clearInterval(timer);
        } else {
            // 保留合适的小数位
            if (targetNum % 1 !== 0) {
                valueEl.textContent = current.toFixed(2) + suffix;
            } else {
                valueEl.textContent = Math.floor(current) + suffix;
            }
        }
    }, interval);
}

const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.metric').forEach(animateMetric);
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const metricsSection = document.querySelector('.project-metrics');
if (metricsSection) {
    metricsObserver.observe(metricsSection);
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = 60;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    });
});

// ===== 暗色区域导航栏文字颜色自适应 =====
const projectSection = document.getElementById('projects');
const contactSection = document.getElementById('contact');

function updateNavStyle() {
    const scrollY = window.scrollY + 60;
    const projectTop = projectSection?.offsetTop || Infinity;
    const projectBottom = projectTop + (projectSection?.offsetHeight || 0);
    const contactTop = contactSection?.offsetTop || Infinity;
    const contactBottom = contactTop + (contactSection?.offsetHeight || 0);

    const isDark = (scrollY >= projectTop && scrollY < projectBottom) ||
                   (scrollY >= contactTop && scrollY < contactBottom);

    if (isDark) {
        navbar.style.background = 'rgba(0, 0, 0, 0.72)';
        navbar.querySelector('.nav-logo').style.color = '#f5f5f7';
        navLinks.forEach(l => { if (!l.classList.contains('active')) l.style.color = '#a1a1a6'; });
        menuBtn.querySelectorAll('span').forEach(s => s.style.background = '#f5f5f7');
    } else {
        navbar.style.background = '';
        navbar.querySelector('.nav-logo').style.color = '';
        navLinks.forEach(l => { if (!l.classList.contains('active')) l.style.color = ''; });
        menuBtn.querySelectorAll('span').forEach(s => s.style.background = '');
    }
}

window.addEventListener('scroll', updateNavStyle, { passive: true });

// ===== 页面加载完成 =====
document.addEventListener('DOMContentLoaded', () => {
    updateNavStyle();
});
