/**
 * ==========================================================================
 * Çorluspor 1947 - İstemci Tarafı Etkileşim Kontrol Dosyası
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initSmoothScroll();
    initPlayerFilter();
    initScrollSpy();
    initSearchPanel();
    initHeroSlider();
    initMobileMenu();
    loadUpcomingMatches();
    loadStandings();
});

/* 1. GERİ SAYIM SAYACI (MAÇ GÜNÜ) */
function initCountdown() {
    const countdownDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000) + (54 * 60 * 1000);

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("timer-days");
        const hoursEl = document.getElementById("timer-hours");
        const minsEl = document.getElementById("timer-mins");
        const secsEl = document.getElementById("timer-secs");

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
        }
    }, 1000);
}

/* 2. PÜRÜZSÜZ SAYFA İÇİ KAYDIRMA (SMOOTH SCROLL) */
function initSmoothScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    document.querySelectorAll('.nav-menu a, .top-utility-bar a').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

/* 3. OYUNCU GRUBU FİLTRELEME */
function initPlayerFilter() {
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    const playerCards = document.querySelectorAll('.player-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            playerCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-position') === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* 4. SCROLL-SPY (KAYDIRMA ESNASINDA MENÜ AKTİFLEŞTİRME) */
function initScrollSpy() {
    const header = document.querySelector('header');
    if (!header) return;

    const sections = document.querySelectorAll('#biletler, #fikstur, #medya, #takimimiz, #tarihce, #kulup');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const headerHeight = header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 150;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
            if (currentSectionId === 'medya' && href === '#medya') {
                link.classList.add('active');
            }
            if (currentSectionId === 'takimimiz' && href === '#takimimiz') {
                link.classList.add('active');
            }
            if (currentSectionId === 'tarihce' && href === '#tarihce') {
                link.classList.add('active');
            }
            if (currentSectionId === 'kulup' && href === '#kulup') {
                link.classList.add('active');
            }
            if (currentSectionId === 'fikstur' && href === '#fikstur') {
                link.classList.add('active');
            }
            if (currentSectionId === 'biletler' && href === '#biletler') {
                link.classList.add('active');
            }
        });
    });
}

/* 5. ARAMA PANELİ GÖRÜNÜRLÜĞÜ */
function initSearchPanel() {
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchPanel = document.getElementById('searchPanel');

    if (searchToggleBtn && searchPanel) {
        searchToggleBtn.addEventListener('click', () => {
            searchPanel.classList.toggle('active');
            if (searchPanel.classList.contains('active')) {
                searchPanel.querySelector('input').focus();
            }
        });
    }
}

/* 6. OTOMATİK DÖNEN SLIDER (HERO SLIDER) */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        const activeDotFill = dots[index].querySelector('.dot-fill');
        if (activeDotFill) {
            activeDotFill.style.width = '0';
            setTimeout(() => {
                activeDotFill.style.width = '100%';
            }, 50);
        }

        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function startSlideShow() {
        if (dots[currentSlide]) {
            const initialDotFill = dots[currentSlide].querySelector('.dot-fill');
            if (initialDotFill) initialDotFill.style.width = '100%';
        }
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideShow();
        });
    });

    startSlideShow();
}

/* 7. MOBİL MENÜ TETİKLEYİCİ */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '80px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = 'var(--brand-black)';
                navMenu.style.height = 'auto';
                navMenu.style.padding = '20px 0';
                navMenu.style.borderBottom = '3px solid var(--corlu-red)';
                
                const menuItems = navMenu.querySelectorAll('li');
                menuItems.forEach(item => {
                    item.style.width = '100%';
                    item.style.justifyContent = 'center';
                    item.querySelector('a').style.padding = '15px 0';
                });
            }
        });
    }
}

/* YARDIMCI: TAKIM AVATARI OLUŞTUR */
function createTeamAvatarSVG(teamName) {
    const initials = getInitials(teamName);
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F38181', '#AA96DA', '#FCBAD3'];
    const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bgColor = colors[hash % colors.length];
    
    const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="${bgColor}"/>
        <text x="16" y="19" font-size="13" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial, sans-serif">${initials}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/* 8. JSON'DAN GELECEK MAÇLARI YÜKLE */
async function loadUpcomingMatches() {
    // Try local proxy first, then fallback to static JSON
    const proxyUrl = 'http://localhost:3000/api/upcoming';
    try {
        const r = await fetchWithTimeout(proxyUrl, { timeout: 5000 });
        if (r.ok) {
            const json = await r.json();
            const data = json.upcoming || json.data || json;
            renderUpcomingFromArray(data);
            return;
        }
    } catch (e) {
        console.warn('Proxy upcoming failed, falling back to local JSON', e);
    }

    // fallback
    try {
        const data = await fetchLocalMatchesJson();
        if (!data.upcoming || data.upcoming.length === 0) {
            updateFixtureUI('empty');
            return;
        }
        renderUpcomingFromArray(data.upcoming);
    } catch (error) {
        console.warn('Maç verileri yüklenemedi:', error);
    }
}

function getFallbackJsonPathCandidates() {
    return ['./data/matches.json', '../data/matches.json'];
}

async function fetchLocalMatchesJson() {
    const candidates = getFallbackJsonPathCandidates();
    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate);
            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            // try next candidate
        }
    }
    throw new Error('Local matches.json not found');
}

function renderUpcomingFromArray(upcomingMatches) {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const matches = upcomingMatches.filter(match => {
        const matchDate = match.date ? new Date(match.date) : (match.startTimestamp ? new Date(match.startTimestamp * 1000) : null);
        return matchDate && matchDate >= today && matchDate <= thirtyDaysFromNow;
    }).slice(0,2);

    if (!matches || matches.length === 0) {
        updateFixtureUI('empty');
        return;
    }

    const fixtureList = document.querySelector('.secondary-fixture-list');
    if (!fixtureList) return;

    fixtureList.innerHTML = matches.map(match => {
        const matchDate = match.date ? new Date(match.date) : (match.startTimestamp ? new Date(match.startTimestamp * 1000) : null);
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const formattedDate = matchDate ? `${matchDate.getDate()} ${months[matchDate.getMonth()]}, ${match.time || `${String(matchDate.getHours()).padStart(2,'0')}:${String(matchDate.getMinutes()).padStart(2,'0')}`}` : '';

        const homeLogoSrc = (match.home && match.home.logo) ? match.home.logo : createTeamAvatarSVG((match.home && match.home.name) || 'Ev');
        const awayLogoSrc = (match.away && match.away.logo) ? match.away.logo : createTeamAvatarSVG((match.away && match.away.name) || 'Konuk');

        return `
            <div class="mini-fixture-card">
                <div class="mini-team-info">
                    <img src="${homeLogoSrc}" alt="${match.home && match.home.name}" style="width: 28px; height: 28px; object-fit: contain;" onerror="this.style.opacity='0.5'">
                    <span>${(match.home && match.home.name) || ''}</span>
                </div>
                <span style="font-weight: 700; color: var(--corlu-yellow);">VS</span>
                <div class="mini-team-info">
                    <img src="${awayLogoSrc}" alt="${match.away && match.away.name}" style="width: 28px; height: 28px; object-fit: contain;" onerror="this.style.opacity='0.5'">
                    <span>${(match.away && match.away.name) || ''}</span>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${formattedDate}</span>
            </div>
        `;
    }).join('');
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

function getInitials(name) {
    return name.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
}

function updateFixtureUI(state) {
    const fixtureList = document.querySelector('.secondary-fixture-list');
    if (!fixtureList) return;
    
    if (state === 'empty') {
        fixtureList.innerHTML = `
            <div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 1.1rem;">
                <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 15px; display: block; color: var(--corlu-yellow);"></i>
                <strong>Ufukta Maç Yok</strong>
            </div>
        `;
    }
}

/* 9. JSON'DAN PUAN DURUMUNU YÜKLE */
async function loadStandings() {
    // Try proxy first
    const proxyUrl = 'http://localhost:3000/api/standings';
    try {
        const r = await fetchWithTimeout(proxyUrl, { timeout: 5000 });
        if (r.ok) {
            const json = await r.json();
            const data = json.standings || json.data || json;
            renderStandingsFromArray(data);
            return;
        }
    } catch (e) {
        console.warn('Proxy standings failed, falling back to local JSON', e);
    }

    try {
        const data = await fetchLocalMatchesJson();
        if (!data.standings || data.standings.length === 0) {
            console.warn('Puan tablosu verileri bulunamadı');
            return;
        }
        renderStandingsFromArray(data.standings);
    } catch (error) {
        console.warn('Puan tablosu yüklenemedi:', error);
    }
}

function renderStandingsFromArray(standings) {
    const standingsContainer = document.querySelector('.standings-rows-container');
    if (!standingsContainer) return;

    const newHTML = standings.map(team => {
        const isHighlighted = (team.name || '').toLowerCase().includes('corluspor') ? 'highlighted' : '';
        const logoSrc = team.logo || createTeamAvatarSVG(team.name || '');
        const goalDiff = (team.goalDiff !== undefined && team.goalDiff !== null) ? team.goalDiff : '-';

        return `
            <div class="standings-row ${isHighlighted}">
                <div class="standings-row-left">
                    <span class="standings-pos">${team.position}</span>
                    <div class="standings-team-info">
                        <img src="${logoSrc}" alt="${team.name}" style="width: 32px; height: 32px; object-fit: contain;" onerror="this.style.opacity='0.5'">
                        <span class="standings-team-name">${team.name}</span>
                    </div>
                </div>
                <div class="standings-row-right">
                    <span class="standings-val">${team.played}</span>
                    <span class="standings-val">${goalDiff}</span>
                    <span class="standings-val pts">${team.points}</span>
                </div>
            </div>
        `;
    }).join('');

    standingsContainer.innerHTML = newHTML;
}