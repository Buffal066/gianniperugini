(function initWetNeonNoir() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.project-card--wet-neon').forEach((card) => {
        const video = card.querySelector('.wet-neon-card-video');
        if (!video) return;

        const stopPreview = () => {
            video.pause();
            card.classList.remove('is-previewing');
        };

        const startPreview = () => {
            if (reducedMotion) return;
            const playAttempt = video.play();
            if (playAttempt && typeof playAttempt.then === 'function') {
                playAttempt
                    .then(() => {
                        card.classList.add('is-previewing');
                    })
                    .catch(() => {
                        stopPreview();
                    });
            }
        };

        video.addEventListener('error', stopPreview);

        card.addEventListener('mouseenter', startPreview);
        card.addEventListener('focusin', startPreview);
        card.addEventListener('mouseleave', stopPreview);
        card.addEventListener('focusout', (event) => {
            if (!card.contains(event.relatedTarget)) {
                stopPreview();
            }
        });
    });

    document.querySelectorAll('.wnn-player video').forEach((video) => {
        video.addEventListener('play', () => {
            if (!video.muted && video.volume === 0) {
                video.volume = 1;
            }
        });
    });
})();
