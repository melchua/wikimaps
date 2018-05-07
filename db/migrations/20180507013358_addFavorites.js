
exports.up = function(knex, Promise) {
  return knex.schema.table('maps', (table) => {
    table.boolean('favorites');
  });
};

exports.down = function(knex, Promise) {
   return knex.schema.table('maps', (table) => {
    table.dropColumn('favorites');
  });
};
