
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, user_name: 'auto', 'display_name': 'Andy1', img: '/android.jpg', hash: 'xxx'},
        {id: 2, user_name: 'auto', 'display_name': 'Andy2', img: '/android.jpg', hash: 'xxx'},
        {id: 3, user_name: 'auto', 'display_name': 'Andy3', img: '/android.jpg', hash: 'xxx'},
        {id: 4, user_name: 'auto', 'display_name': 'Andy4', img: '/android.jpg', hash: 'xxx'},
        {id: 5, user_name: 'auto', 'display_name': 'Andy5', img: '/android.jpg', hash: 'xxx'},
        {id: 6, user_name: 'auto', 'display_name': 'Andy6', img: '/android.jpg', hash: 'xxx'},
        {id: 7, user_name: 'auto', 'display_name': 'Andy7', img: '/android.jpg', hash: 'xxx'},
        {id: 8, user_name: 'auto', 'display_name': 'Andy8', img: '/android.jpg', hash: 'xxx'},
        {id: 9, user_name: 'auto', 'display_name': 'Andy9', img: '/android.jpg', hash: 'xxx'},
        {id: 10, user_name: 'auto', 'display_name': 'Andy10', img: '/android.jpg', hash: 'xxx'}        
      ]);
    });
};
