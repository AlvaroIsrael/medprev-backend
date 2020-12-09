import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('people', tableBuilder => {
    tableBuilder.increments('personId').primary();
    tableBuilder.string('kind').notNullable();
    tableBuilder.string('role').notNullable();
    tableBuilder.string('document').notNullable();
    tableBuilder.string('corporateName').nullable();
    tableBuilder.string('name').notNullable();
    tableBuilder.string('email').nullable();
    tableBuilder.string('password').notNullable();
    tableBuilder.string('landlinePhoneNumber').nullable();
    tableBuilder.string('mobilePhoneNumber').nullable();
    tableBuilder.string('avatarUrl').nullable();
    tableBuilder.string('sex').nullable();
    tableBuilder.string('birthDate').nullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('people');
}
