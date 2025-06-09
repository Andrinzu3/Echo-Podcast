document.addEventListener("DOMContentLoaded", function () {

  
    // 🌄 Slideshow-Logik
    const hero = document.querySelector('.hero');
    const images = [
      'Assets/Bild_hero/Echo_Hindergrundbilder-1.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-2.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-3.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-4.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-5.jpg',
    ];
  
    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    bg1.className = 'hero-bg bg1';
    bg2.className = 'hero-bg bg2';
    hero.appendChild(bg1);
    hero.appendChild(bg2);
  
    let current = 0;
    let next = 1;
  
    bg1.style.backgroundImage = `url(${images[current]})`;
    bg2.style.opacity = 0;
  
    setInterval(() => {
      bg2.style.backgroundImage = `url(${images[next]})`;
      bg2.style.opacity = 1;
  
      setTimeout(() => {
        bg1.style.backgroundImage = `url(${images[next]})`;
        bg2.style.opacity = 0;
  
        current = next;
        next = (next + 1) % images.length;
      }, 2000);
    }, 8000);
  
    // 🧭 Navigation sanft scrollen
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Standardverhalten verhindern
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const burger = document.getElementById("burger");
    const mobileNav = document.getElementById("mobileNav");

    burger.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  });

