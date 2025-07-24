import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const container = document.getElementById('anime-details-container');

    if (!animeId) {
        container.innerHTML = '<h2>Аниме не найдено</h2>';
        return;
    }

    // Загрузка информации об аниме
    const { data: anime, error } = await supabase
        .from('anime')
        .select('*')
        .eq('id', animeId)
        .single();

    if (error || !anime) {
        container.innerHTML = '<h2>Ошибка загрузки аниме</h2>';
        return;
    }

    // Загрузка серий
    const { data: episodes, error: episodesError } = await supabase
        .from('episodes')
        .select('*')
        .eq('anime_id', animeId)
        .order('episode_number', { ascending: true });

    // Отображение
    container.innerHTML = `
        <div class="anime-details">
            ${anime.poster_url ? `<img src="${anime.poster_url}" alt="${anime.title}" class="anime-poster">` : ''}
            <div>
                <h2>${anime.title}</h2>
                <p>${anime.release_year ? `Год: ${anime.release_year}` : ''}</p>
                <p>${anime.description || ''}</p>
            </div>
        </div>
        <div class="episodes-list">
            <h3>Список серий</h3>
            ${episodesError ? '<p>Ошибка загрузки серий</p>' : 
                episodes.length ? 
                    episodes.map(ep => `
                        <div class="episode">
                            <h4>${ep.episode_number}. ${ep.title}</h4>
                            <video controls width="100%">
                                <source src="${ep.video_url}" type="video/mp4">
                                Ваш браузер не поддерживает видео.
                            </video>
                        </div>
                    `).join('') : 
                    '<p>Серий пока нет</p>'}
        </div>
    `;
});
