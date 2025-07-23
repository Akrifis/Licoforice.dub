// Имитация базы данных
let animeDB = [];

// Загрузка данных из LocalStorage
function loadDatabase() {
    const saved = localStorage.getItem('animeDB');
    if (saved) {
        animeDB = JSON.parse(saved);
    } else {
        // Начальные данные (можно удалить)
        animeDB = [
            {
                id: '1',
                title: 'Пример аниме',
                description: 'Это тестовое аниме для демонстрации',
                posterUrl: 'https://via.placeholder.com/300x450',
                episodes: [
                    { number: 1, videoUrl: 'https://example.com/video1.mp4' },
                    { number: 2, videoUrl: 'https://example.com/video2.mp4' }
                ]
            }
        ];
        saveDatabase();
    }
}

// Сохранение данных в LocalStorage
function saveDatabase() {
    localStorage.setItem('animeDB', JSON.stringify(animeDB));
}

// Получить список всех аниме
function getAllAnime() {
    return animeDB;
}

// Получить аниме по ID
function getAnimeById(id) {
    return animeDB.find(anime => anime.id === id);
}

// Добавить новое аниме
function addAnime(anime) {
    animeDB.push(anime);
    saveDatabase();
}

// Загрузить данные при запуске
loadDatabase();
