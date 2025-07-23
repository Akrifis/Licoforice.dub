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



// Регистрация
function register(email, password, username) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

// Вход
function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// Выход
function logout() {
    return auth.signOut();
}

// Проверка состояния аутентификации
auth.onAuthStateChanged((user) => {
    if (user) {
        // Пользователь вошел
        console.log("User logged in:", user.email);
    } else {
        // Пользователь вышел
        console.log("User logged out");
    }
});



// Загрузка комментариев
function loadComments(animeId, episodeId) {
    return db.collection('comments')
        .where('animeId', '==', animeId)
        .where('episodeId', '==', episodeId)
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            const comments = [];
            querySnapshot.forEach((doc) => {
                comments.push(doc.data());
            });
            return comments;
        });
}

// Отправка комментария
function addComment(animeId, episodeId, userId, text) {
    return db.collection('comments').add({
        animeId: animeId,
        episodeId: episodeId,
        userId: userId,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0
    });
}

// Лайк комментария
function likeComment(commentId, userId) {
    const commentRef = db.collection('comments').doc(commentId);
    return commentRef.update({
        likes: firebase.firestore.FieldValue.increment(1),
        likedBy: firebase.firestore.FieldValue.arrayUnion(userId)
    });
}


// Добавление в избранное
function addToFavorites(userId, animeId) {
    return db.collection('users').doc(userId).update({
        favorites: firebase.firestore.FieldValue.arrayUnion(animeId)
    });
}

// Оценка аниме
function rateAnime(userId, animeId, rating) {
    return db.collection('ratings').doc(`${userId}_${animeId}`).set({
        userId: userId,
        animeId: animeId,
        rating: rating,
        ratedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Получение средней оценки
function getAverageRating(animeId) {
    return db.collection('ratings')
        .where('animeId', '==', animeId)
        .get()
        .then((querySnapshot) => {
            let total = 0;
            let count = 0;
            
            querySnapshot.forEach((doc) => {
                total += doc.data().rating;
                count++;
            });
            
            return count > 0 ? (total / count).toFixed(1) : 0;
        });
}


// Подписка на уведомления о новых сериях
function subscribeToNotifications(userId, animeId) {
    return db.collection('subscriptions').doc(`${userId}_${animeId}`).set({
        userId: userId,
        animeId: animeId,
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Отправка уведомлений (админская функция)
function sendNotification(animeId, message) {
    // Здесь можно интегрировать с Firebase Cloud Messaging
    console.log(`Notification sent for anime ${animeId}: ${message}`);
}


// Добавление в историю просмотров
function addToHistory(userId, animeId, episodeId) {
    return db.collection('history').add({
        userId: userId,
        animeId: animeId,
        episodeId: episodeId,
        watchedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Получение истории просмотров
function getHistory(userId, limit = 10) {
    return db.collection('history')
        .where('userId', '==', userId)
        .orderBy('watchedAt', 'desc')
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            const history = [];
            querySnapshot.forEach((doc) => {
                history.push(doc.data());
            });
            return history;
        });
}
