// Add data to tables
exports.seed = function(knex, Promise) {
  const deleteContributionsPlacesFavorites = Promise.all([
      knex('favorites').del(),
      knex('places').del(),
      knex('contributions').del()
    ]);
  const deleteMaps = deleteContributionsPlacesFavorites
    .then(() => {
      return knex('maps').del();
    });
  const deleteUsers = deleteMaps
    .then(() => {
      return knex('users').del();
    });

  const createUsers = deleteUsers
    .then(() => {
      return knex('users')
        .returning('*')
        .insert([{name: 'Dahlia', email: 'dahlia@dahlia.com'}, {name: 'Mel', email: 'mel@mel.com'}])
        .then((users) => {
          console.log(users);
          const dahlia = users[0];
          const mel = users[1];
          console.log('users[0]', users);
          return knex('maps')
            .returning('*')
            .insert([
              {name: 'Cambie Cofee Shopes', latitude: 65.2345, longitude: 43.56743, zoom: 3, user_id: dahlia.id, map_key: 'A123456Z'},
              {name: 'Gastowm Resturants', latitude: 25.2345, longitude: 15.56743, zoom: 4, user_id: dahlia.id, map_key: 'B123456Y'},
              {name: 'Vancouver malls', latitude: 12.3456, longitude: 87.2345, zoom: 5, user_id: mel.id, map_key: 'C123456X'},
              {name: 'Vancouvers Cinemas', latitude: 29.83221, longitude: 23.7897, zoom: 6, user_id: mel.id, map_key: 'D123456W'}])
            .then((maps) => {
              const map1 = maps[0];
              const map2 = maps[1];
              const map3 = maps[2];
              const map4 = maps[3];
              console.log(maps);
              console.log('map[0]', maps);
              return knex('contributions')
                .insert([{map_id: map1.id, user_id: map1.user_id}, {map_id: map2.id, user_id: map2.user_id}, {map_id: map3.id, user_id: map3.user_id}, {map_id: map4.id, user_id: map4.user_id}])
            .returning('*')
          })
        })
    });
  return createUsers;
};
