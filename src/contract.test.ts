import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { DEFAULT_WEIGHTS, VINTAGE_REGISTER } from './shared/schema';
import { HealthController } from './health.controller';
import { SchemaController } from './schema.controller';

test('healthz returns plain ok', () => {
  assert.equal(new HealthController().healthz(), 'ok');
});

test('default weights sum to 1', () => {
  const total = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `weights sum to ${total}`);
});

test('every source carries a vintage', () => {
  for (const [name, v] of Object.entries(VINTAGE_REGISTER)) {
    assert.ok(v.label.length > 0, `${name} has no label`);
    assert.ok(v.source.length > 0, `${name} has no source`);
  }
});

test('/api/schema exposes themes, langs, weights and vintages', () => {
  const body = new SchemaController().schema();
  assert.ok(body.scored_themes.includes('drinking_water'));
  assert.ok(body.scored_themes.includes('roads_connectivity'));
  assert.ok(body.unscored_themes.includes('other'));
  assert.equal(body.supported_langs.length, 5);
  assert.equal(body.default_weights.equity, 0.25);

  const antyodaya = body.vintages.antyodaya_facilities;
  assert.ok(antyodaya, 'antyodaya_facilities must be in the vintage register');
  assert.equal(antyodaya.vintage, 2020);

  const census = body.vintages.census_vd;
  assert.ok(census, 'census_vd must be in the vintage register');
  assert.equal(census.vintage, 2011);

  assert.ok(Object.keys(body.contracts).length > 0);
});
