exports.seed = (knex, Promise) => {
  return knex('movies').del()
    .then(() => {
      return knex('movies').insert({
        name: 'The Land Before Time',
        genre: 'Fantasy',
        rating: 7,
        explicit: false
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Jurassic Park',
        genre: 'Science Fiction',
        rating: 9,
        explicit: true
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Ice Age: Dawn of the Dinosaurs',
        genre: 'Action/Romance',
        rating: 5,
        explicit: false
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Pulp Fiction',
        genre: 'Crime',
        rating: 10,
        explicit: true
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Lord of the Rings: Fellowship of the Ring',
        genre: 'Science Fiction',
        rating: 10,
        explicit: false
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Lord of the Rings: The Two Towers',
        genre: 'Science Fiction',
        rating: 10,
        explicit: false
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Lord of the Rings: The Return of the King',
        genre: 'Science Fiction',
        rating: 10,
        explicit: false
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Graduate',
        genre: 'Comedy/Drama',
        rating: 9,
        explicit: true
      });
    })
    .then(() => {
      return knex('movies').insert({
        name: 'Happy Gilmore',
        genre: 'Comedy/Romance',
        rating: 5,
        explicit: false
      });
    });
};