// 1. Typing Effect (ของเดิม)
const textElement = document.getElementById("typewriter");
const phrases = ["Pitchayut Boonporn.", "a Developer.", "a Mahidol Student."];
let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 150;

function type() {
    const currentPhrase = phrases[phraseIndex];
    textElement.textContent = isDeleting 
        ? currentPhrase.substring(0, charIndex - 1) 
        : currentPhrase.substring(0, charIndex + 1);
    
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
    typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true; typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}


// 2. Scroll Reveal Logic
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        let windowHeight = window.innerHeight;
        let revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
document.addEventListener("DOMContentLoaded", () => {
    type();
    reveal(); // เช็คครั้งแรกตอนโหลดหน้าเว็บ
});