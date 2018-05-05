
exports.up = function(knex, Promise) {
  return Promise.all([
        knex.schema.createTable('maps', function (table) {
      table.increments('id');
      table.string('name');
      table.float('latitude',10,6);
      table.float('longitude',10,6);
      table.integer('zoom');
      table.timestamps();
      table.integer('user_id').notNull().references('users.id')
    }),
    knex.schema.createTable('places', function (table) {
      table.increments('id');
      table.string('name');
      table.float('latitude',10,6);
      table.float('longitude',10,6);
      table.string('image');
      table.string('description');
    }),
    knex.schema.createTable('contributions', function(table){
      table.increments();
      table.integer('user_id').notNull().references('users.id')
    }),
    knex.schema.createTable('favorites', function(table){
      table.increments();
      table.integer('user_id').notNull().references('users.id')
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('maps'),
    knex.schema.dropTable('places'),
    knex.schema.dropTable('contributions'),
    knex.schema.dropTable('favorites')
    ]);
};
