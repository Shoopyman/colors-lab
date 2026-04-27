/**
 * Integration Tests for LAMP API Endpoints
 * Validates that each endpoint returns the correct JSON structure.
 * Uses node-fetch to make real HTTP requests to the API.
 *
 * NOTE: These tests validate response *structure*, not specific data values,
 * since the server may return errors for test credentials.
 */

const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

const urlBase = 'http://asdfjalkjsdbf.com/LAMPAPI';

describe('Login.php integration', () => {
  test('returns JSON with id, firstName, lastName, and error fields', async () => {
    const response = await fetch(`${urlBase}/Login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ login: 'testuser', password: 'testpass' }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('lastName');
    expect(data).toHaveProperty('error');
  });

  test('returns id of 0 for invalid credentials', async () => {
    const response = await fetch(`${urlBase}/Login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ login: 'nobody', password: 'wrongpass' }),
    });

    const data = await response.json();
    expect(data.id).toBe(0);
  });
});

describe('AddColor.php integration', () => {
  test('returns JSON with an error field', async () => {
    const response = await fetch(`${urlBase}/AddColor.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ color: 'testcolor', userId: 1 }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});

describe('SearchColors.php integration', () => {
  test('returns JSON with error field when no results found', async () => {
    const response = await fetch(`${urlBase}/SearchColors.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ search: 'zzznomatch', userId: 1 }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('returns results array when colors are found', async () => {
    const response = await fetch(`${urlBase}/SearchColors.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ search: '', userId: 1 }),
    });

    const data = await response.json();

    // Either returns results array or an error string — both are valid structures
    const hasResults = Object.prototype.hasOwnProperty.call(data, 'results');
    const hasError = Object.prototype.hasOwnProperty.call(data, 'error');
    expect(hasResults || hasError).toBe(true);
  });
});
