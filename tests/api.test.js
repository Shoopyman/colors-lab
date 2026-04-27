/**
 * @jest-environment node
 *
 * Integration Tests for LAMP API Endpoints
 */
 
const axios = require('axios');
 
const urlBase = 'http://asdfjalkjsdbf.com/LAMPAPI';
 
describe('Login.php integration', () => {
  test('returns JSON with id, firstName, lastName, and error fields', async () => {
    const response = await axios.post(`${urlBase}/Login.php`,
      { login: 'testuser', password: 'testpass' },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
 
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('firstName');
    expect(response.data).toHaveProperty('lastName');
    expect(response.data).toHaveProperty('error');
  });
 
  test('returns id of 0 for invalid credentials', async () => {
    const response = await axios.post(`${urlBase}/Login.php`,
      { login: 'nobody', password: 'wrongpass' },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
 
    expect(response.data.id).toBe(0);
  });
});
 
describe('AddColor.php integration', () => {
  test('returns JSON with an error field', async () => {
    const response = await axios.post(`${urlBase}/AddColor.php`,
      { color: 'testcolor', userId: 1 },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
 
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('error');
  });
});
 
describe('SearchColors.php integration', () => {
  test('returns JSON with error field when no results found', async () => {
    const response = await axios.post(`${urlBase}/SearchColors.php`,
      { search: 'zzznomatch', userId: 1 },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
 
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('error');
  });
 
  test('response contains either results array or error field', async () => {
    const response = await axios.post(`${urlBase}/SearchColors.php`,
      { search: '', userId: 1 },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
 
    const hasResults = Object.prototype.hasOwnProperty.call(response.data, 'results');
    const hasError = Object.prototype.hasOwnProperty.call(response.data, 'error');
    expect(hasResults || hasError).toBe(true);
  });
});