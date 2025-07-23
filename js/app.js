// Загрузка списка аниме на главной странице
function loadAnimeList() {
    const container = document.getElementById('anime-list');
    if (!container) return;
    
    const animeList = getAllAnime();
    
    animeList.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
            <a href="watch.html?id=${anime.id}">
                <img src="${anime.posterUrl}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p>${anime.episodes.length} серий</p>
            </a>
        `;
        container.appendChild(animeCard);
    });
}
