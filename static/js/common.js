document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.querySelector('.theme-toggle');
    
    function initTheme() {
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
    
    initTheme();
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }
});

function switchAuthPage(fromPage, toPage) {
    const fromContainer = document.querySelector(fromPage);
    const toContainer = document.querySelector(toPage);

    if (fromContainer && toContainer) {
        fromContainer.style.opacity = 0;
        setTimeout(() => {
            fromContainer.classList.add('hidden');
            toContainer.classList.remove('hidden');
            toContainer.style.opacity = 0;
            setTimeout(() => {
                toContainer.style.opacity = 1;
            }, 50);
        }, 300);
    } else {
        console.error('One or both containers not found:', fromPage, toPage);
    }
}