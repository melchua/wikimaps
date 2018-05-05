
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('places', (table) => {
      table.integer('map_id').notNull().references('maps.id');
    }),
    knex.schema.table('contributions', (table) => {
      table.integer('map_id').notNull().references('maps.id');
    }),
    knex.schema.table('favorites',(table) => {
      table.integer('map_id').notNull().references('maps.id');
    })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('places', (table) => {
      table.dropColumn('map_id');
    }),
    knex.schema.table('contributions', (table) => {
      table.dropColumn('map_id');
    }),
    knex.schema.table('favorites',(table) => {
      table.dropColumn('map_id');
    })
    ])
};
