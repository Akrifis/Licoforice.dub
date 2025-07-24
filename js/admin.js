let animeData = [];

// DOM элементы
const adminTabs = document.querySelectorAll('.admin-tab');
const selectAnime = document.getElementById('selectAnime');
const manageAnimeGrid = document.getElementById('manageAnimeGrid');
const addAnimeForm = document.getElementById('addAnimeForm');
const addEpisodeForm = document.getElementById('addEpisodeForm');

// Загрузка данных
function loadAnimeData() {
    fetch('../data/anime.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            populateAnimeSelect();
            generateManageAnimeGrid();
        });
}

// Заполнение списка аниме
function populateAnimeSelect() {
    selectAnime.innerHTML = '<option value="">-- Выберите аниме --</option>';
    animeData.forEach(anime => {
        const option = document.createElement('option');
        option.value = anime.id;
        option.textContent = anime.title;
        selectAnime.appendChild(option);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAnimeData();
    
    // Обработчики вкладок
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAdminTab(tabId);
        });
    });
    
    // Обработчик формы добавления аниме
    addAnimeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Добавление аниме
    });
    
    // Обработчик формы добавления серии
    addEpisodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Добавление серии
    });
});

function switchAdminTab(tabId) {
    // Переключение вкладок админ-панели
}
