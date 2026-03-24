export const getLikes = () => {
    return JSON.parse(localStorage.getItem('newshub_likes')) || [];
};

export const toggleLikeInStorage = (id) => {
    let likes = getLikes();
    if (likes.includes(id)) {
        likes = likes.filter(itemId => itemId !== id);
    } else {
        likes.push(id);
    }
    localStorage.setItem('newshub_likes', JSON.stringify(likes));
    return likes;
};