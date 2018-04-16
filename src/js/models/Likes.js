export default class Likes {

   constructor() {
      this.likes = [];
   }

   addLike(id, title, author, img) {
      const like = {
         id,
         title,
         author,
         img
      }
      this.likes.push(like);
      //Data to localStorage
      this.storageData();
      return like;
   }

   deleteLike(id) {
      const index = this.likes.findIndex(el => el.id === id);
      this.likes.splice(index, 1);

      //Data delete from localStorage
   }

   isLiked(id) {
      return this.likes.findIndex(el => el.id === id) !== -1;
   }

   getNumberLikes() {
      return this.likes.length;
   }

   storageData() {
      localStorage.setItem('likes', JSON.stringify(this.likes));
   }

   retrieveStorageData() {
      const storage = JSON.parse(localStorage.getItem('likes'));
      if (storage) this.likes = storage;
   }
}