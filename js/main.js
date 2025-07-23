// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBn5pWh0pmWXJ1qSEbG_c00EIubr86a-TU",
    authDomain: "licoforice-98586.firebaseapp.com",
    projectId: "licoforice-98586",
    storageBucket: "licoforice-98586.firebasestorage.app",
    messagingSenderId: "478236357284",
    appId: "1:478236357284:web:3e7d736b335bc8bd082c31"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Загрузка аниме
function loadAnime() {
    db.collection("anime").get().then((querySnapshot) => {
        const animeList = document.getElementById('anime-list');
        animeList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const anime = doc.data();
            animeList.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${anime.poster}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${anime.title}</h5>
                            <p class="card-text">${anime.description.substring(0, 100)}...</p>
                            <button onclick="showAnime('${doc.id}')" class="btn btn-primary">Смотреть</button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

// Показ аниме и серий
function showAnime(animeId) {
    db.collection("anime").doc(animeId).get().then((doc) => {
        const anime = doc.data();
        document.getElementById('episode-title').textContent = anime.title;
        
        // Загрузка серий
        db.collection("episodes").where("animeId", "==", animeId).get().then((querySnapshot) => {
            const select = document.getElementById('episode-select');
            select.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const episode = doc.data();
                select.innerHTML += `<option value="${episode.videoUrl}">Серия ${episode.number}: ${episode.title || ''}</option>`;
            });
            
            // Автовоспроизведение первой серии
            if (querySnapshot.size > 0) {
                const firstEpisode = querySnapshot.docs[0].data();
                document.getElementById('anime-player').src = firstEpisode.videoUrl;
            }
            
            // Показ модального окна
            const modal = new bootstrap.Modal(document.getElementById('playerModal'));
            modal.show();
        });
    });
}

// Инициализация
window.onload = function() {
    loadAnime();
    
    // Смена серии
    document.getElementById('episode-select').addEventListener('change', function() {
        document.getElementById('anime-player').src = this.value;
    });
    
    // Отправка комментария
    document.getElementById('send-comment').addEventListener('click', function() {
        const text = document.getElementById('comment-text').value;
        if (text.trim()) {
            // Здесь код для сохранения комментария
            alert('Комментарий отправлен!');
            document.getElementById('comment-text').value = '';
        }
    });
};
