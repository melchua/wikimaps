
exports.up = function(knex, Promise) {
  return knex.schema.table('maps', (table) => {
    table.string('map_key', 8);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('maps', (table) => {
    table.dropColumn('map_key');
  });
};
