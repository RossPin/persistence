
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, user_name: 'auto1', 'display_name': 'Andy', img: '/android.jpg', hash: 'xxx'},
        {id: 2, user_name: 'auto2', 'display_name': 'Lisa', img: '/lisa.jpg', hash: 'xxx'},
        {id: 3, user_name: 'auto3', 'display_name': 'Morty', img: '/Morty.png', hash: 'xxx'},
        {id: 4, user_name: 'auto4', 'display_name': 'Jasmine', img: '/Jasmine.jpeg', hash: 'xxx'},
        {id: 5, user_name: 'auto5', 'display_name': 'Bender', img: '/Bender.png', hash: 'xxx'},
        {id: 6, user_name: 'auto6', 'display_name': 'Meg', img: '/Meg.jpg', hash: 'xxx'},
        {id: 7, user_name: 'auto7', 'display_name': 'Kenny', img: '/Kenny.png', hash: 'xxx'},
        {id: 8, user_name: 'auto8', 'display_name': 'Summer', img: '/Summer.png', hash: 'xxx'},
        {id: 9, user_name: 'auto9', 'display_name': 'Cartman', img: '/Cartman.png', hash: 'xxx'}       
      ], 'id');
    });
};
