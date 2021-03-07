import plugin from '../index';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

test('load and replace variable from .env', () => {
  const result = plugin().transform(`let a = process.env.VUE_APP_TEST;`, 'index.js');

  expect(result?.code).toEqual('let a = "value";');
});

test('replace custom variables', () => {
  const result = plugin({
    BASE_URL: '/',
  }).transform(`let a = process.env.BASE_URL;`, 'index.js');

  expect(result?.code).toEqual('let a = "/";');
});

test('replace multiple usage of the same variable', () => {
  const result = plugin().transform(`let a = process.env.VUE_APP_TEST; let b = process.env.VUE_APP_TEST;`, 'index.js');

  expect(result?.code).toEqual('let a = "value"; let b = "value";');
});

test('handle files only with allowed file extensions', () => {
  let config = { fileRegexp: /\.js$/ };

  const tsResult = plugin({}, config).transform(`let a = process.env.VUE_APP_TEST`, 'index.ts');
  expect(tsResult?.code).toBeUndefined();

  const jsResult = plugin({}, config).transform(`let a = process.env.VUE_APP_TEST`, 'index.js');
  expect(jsResult?.code).toEqual('let a = "value"');
});

test('change getEnvFullName', () => {
  const result = plugin(
    {},
    {
      getEnvFullName: (name: string) => `import.meta.${name}`,
    }
  ).transform(`let a = import.meta.VUE_APP_TEST`, 'index.js');

  expect(result?.code).toEqual('let a = "value"');
});

test('change variable prefix', () => {
  const result = plugin({}, { variablePrefix: 'VUE_' }).transform(`let a = process.env.VUE_TEST`, 'index.js');

  expect(result?.code).toEqual('let a = "value"');
});

test('custom variables rewrites .env vars', () => {
  const result = plugin({ VUE_APP_TEST: 'nope' }).transform(`let a = process.env.VUE_APP_TEST`, 'index.js');

  expect(result?.code).toEqual('let a = "nope"');
});
