(() => {
    const dialog = document.getElementById('video-gallery-player');
    if (!dialog) return;
    const player = dialog.querySelector('video');
    const title = dialog.querySelector('h2');
    const error = dialog.querySelector('[data-film-error]');
    let trigger;
    document.querySelectorAll('[data-film-card]').forEach(card => {
        card.addEventListener('click', event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            trigger = card;
            document.querySelectorAll('.video-film-card video').forEach(preview => preview.pause());
            title.textContent = `${card.querySelector('h2').textContent} — ${card.querySelector('.project-info p').textContent}`;
            error.hidden = true;
            player.poster = card.querySelector('video').poster;
            player.src = card.href;
            dialog.showModal();
            player.play().catch(() => {});
        });
    });
    player.addEventListener('error', () => { error.hidden = false; });
    dialog.querySelector('[data-close-film]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
        player.pause();
        player.removeAttribute('src');
        player.load();
        trigger?.focus();
    });
})();
