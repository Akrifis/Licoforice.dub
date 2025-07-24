// Данные аниме
let animeData = [];

// DOM элементы
const newReleasesGrid = document.getElementById('new-releases');
const popularAnimeGrid = document.getElementById('popular-anime');
const playerModal = document.getElementById('playerModal');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const vkPlayer = document.getElementById('vkPlayer');
const playerTitle = document.getElementById('playerTitle');
const episodeGrid = document.getElementById('episodeGrid');

// Загрузка данных
function loadAnimeData() {
    fetch('data/anime.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            generateAnimeCards();
        });
}

// Генерация карточек аниме
function generateAnimeCards() {
    // ... (код из предыдущего ответа)
}

// Открытие плеера
function openPlayer(animeId) {
    // ... (код из предыдущего ответа)
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAnimeData();
    
    closePlayerBtn.addEventListener('click', closePlayer);
    playerModal.addEventListener('click', (e) => {
        if (e.target === playerModal) closePlayer();
    });
});

function closePlayer() {
    playerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    vkPlayer.src = '';
}
