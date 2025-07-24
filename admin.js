import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    
    // Проверка сессии
    const checkSession = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            showAdminPanel();
        }
    };
    
    // Вход
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            alert('Ошибка: ' + error.message);
        } else {
            showAdminPanel();
        }
    });
    
    // Показать админ-панель
    const showAdminPanel = () => {
        authSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        initAdminFunctions();
    };
    
    // Инициализация функций админ-панели
    const initAdminFunctions = () => {
        // Загрузка списка аниме для выпадающего списка
        const loadAnimeForSelect = async () => {
            const { data, error } = await supabase
                .from('anime')
                .select('id, title')
                .order('title', { ascending: true });
            
            if (!error && data) {
                const select = document.getElementById('anime-select');
                select.innerHTML = data.map(a => 
                    `<option value="${a.id}">${a.title}</option>`
                ).join('');
            }
        };
        
        // Добавление аниме
        document.getElementById('add-anime-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('anime-title').value;
            const description = document.getElementById('anime-description').value;
            const releaseYear = document.getElementById('anime-year').value;
            const posterFile = document.getElementById('anime-poster').files[0];
            
            let posterUrl = '';
            if (posterFile) {
                const fileName = `posters/${Date.now()}_${posterFile.name}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('anime-posters')
                    .upload(fileName, posterFile);
                
                if (uploadError) {
                    alert('Ошибка загрузки постера: ' + uploadError.message);
                    return;
                }
                
                posterUrl = supabase.storage
                    .from('anime-posters')
                    .getPublicUrl(data.path).data.publicUrl;
            }
            
            const { error } = await supabase.from('anime').insert({
                title,
                description,
                release_year: releaseYear ? parseInt(releaseYear) : null,
                poster_url: posterUrl || null
            });
            
            if (error) {
                alert('Ошибка: ' + error.message);
            } else {
                alert('Аниме добавлено!');
                e.target.reset();
                loadAnimeForSelect(); // Обновляем список для выбора при добавлении серии
                loadAnimeListAdmin(); // Обновляем список в админке
            }
        });
        
        // Добавление серии
        document.getElementById('add-episode-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const animeId = document.getElementById('anime-select').value;
            const title = document.getElementById('episode-title').value;
            const episodeNumber = document.getElementById('episode-number').value;
            const videoFile = document.getElementById('episode-video').files[0];
            
            if (!videoFile) {
                alert('Выберите видеофайл');
                return;
            }
            
            // Загрузка видео
            const fileName = `episodes/${Date.now()}_${videoFile.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('anime-episodes')
                .upload(fileName, videoFile);
            
            if (uploadError) {
                alert('Ошибка загрузки видео: ' + uploadError.message);
                return;
            }
            
            const videoUrl = supabase.storage
                .from('anime-episodes')
                .getPublicUrl(data.path).data.publicUrl;
            
            // Сохранение в БД
            const { error } = await supabase.from('episodes').insert({
                anime_id: animeId,
                title,
                episode_number: parseInt(episodeNumber),
                video_url: videoUrl
            });
            
            if (error) {
                alert('Ошибка: ' + error.message);
            } else {
                alert('Серия добавлена!');
                e.target.reset();
            }
        });
        
        // Загрузка списка аниме для админки
        const loadAnimeListAdmin = async () => {
            const { data, error } = await supabase
                .from('anime')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error(error);
                return;
            }
            
            const container = document.getElementById('anime-list-admin');
            container.innerHTML = data.map(anime => `
                <div class="anime-admin-item">
                    <h4>${anime.title}</h4>
                    <p>ID: ${anime.id}</p>
                    <button class="delete-anime" data-id="${anime.id}">Удалить</button>
                </div>
            `).join('');
            
            // Обработчики удаления
            document.querySelectorAll('.delete-anime').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (!confirm('Удалить аниме и все его серии?')) return;
                    
                    const id = btn.dataset.id;
                    // Удаляем серии
                    await supabase.from('episodes').delete().eq('anime_id', id);
                    // Удаляем аниме
                    const { error } = await supabase.from('anime').delete().eq('id', id);
                    
                    if (error) {
                        alert('Ошибка удаления: ' + error.message);
                    } else {
                        loadAnimeListAdmin();
                        loadAnimeForSelect();
                    }
                });
            });
        };
        
        loadAnimeForSelect();
        loadAnimeListAdmin();
    };
    
    checkSession();
});
