import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
    const animeGrid = document.getElementById('anime-list');
    
    // Загрузка аниме
    const loadAnime = async (searchTerm = '') => {
        let query = supabase
            .from('anime')
            .select('*')
            .order('created_at', { ascending: false });

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Ошибка загрузки аниме:', error);
            return;
        }

        animeGrid.innerHTML = data.map(anime => `
            <div class="anime-card" data-id="${anime.id}">
                ${anime.poster_url 
                    ? `<img src="${anime.poster_url}" alt="${anime.title}">` 
                    : '<div class="no-poster">Постер отсутствует</div>'}
                <h3>${anime.title}</h3>
                <p>${anime.release_year || 'Год неизвестен'}</p>
            </div>
        `).join('');

        // Добавляем обработчики для перехода на страницу аниме
        document.querySelectorAll('.anime-card').forEach(card => {
            card.addEventListener('click', () => {
                const animeId = card.dataset.id;
                window.location.href = `anime.html?id=${animeId}`;
            });
        });
    };

    // Поиск
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        loadAnime(searchTerm);
    });

    // Инициализация
    await loadAnime();
});
