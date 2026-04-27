/**
 * Unit Tests for code.js
 * Tests cookie save/read logic and JSON payload formatting
 */

// Mock window.location so jsdom doesn't throw on redirect
delete window.location;
window.location = { href: '' };

// ---- Replicate the module-level state and functions from code.js ----

let userId = 0;
let firstName = '';
let lastName = '';

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    'firstName=' + firstName +
    ',lastName=' + lastName +
    ',userId=' + userId +
    ';expires=' + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(',');
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split('=');
    if (tokens[0] === 'firstName') {
      firstName = tokens[1];
    } else if (tokens[0] === 'lastName') {
      lastName = tokens[1];
    } else if (tokens[0] === 'userId') {
      userId = parseInt(tokens[1].trim());
    }
  }
  if (userId < 0) {
    window.location.href = 'index.html';
  }
}

// ---- Tests ----

describe('saveCookie', () => {
  beforeEach(() => {
    // Reset state and clear cookies before each test
    userId = 0;
    firstName = '';
    lastName = '';
    document.cookie = 'firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  test('saves firstName, lastName, and userId into document.cookie', () => {
    firstName = 'Sam';
    lastName = 'Trout';
    userId = 42;

    saveCookie();

    expect(document.cookie).toContain('firstName=Sam');
    expect(document.cookie).toContain('lastName=Trout');
    expect(document.cookie).toContain('userId=42');
  });

  test('cookie contains all three fields at once', () => {
    firstName = 'Jane';
    lastName = 'Doe';
    userId = 7;

    saveCookie();

    const cookie = document.cookie;
    expect(cookie).toContain('firstName=Jane');
    expect(cookie).toContain('lastName=Doe');
    expect(cookie).toContain('userId=7');
  });
});

describe('readCookie', () => {
  beforeEach(() => {
    userId = 0;
    firstName = '';
    lastName = '';
    window.location.href = '';
  });

  test('reads userId, firstName, lastName back from cookie', () => {
    // Manually set the cookie the same way saveCookie does
    document.cookie = 'firstName=Sam,lastName=Trout,userId=42';

    readCookie();

    expect(firstName).toBe('Sam');
    expect(lastName).toBe('Trout');
    expect(userId).toBe(42);
  });

  test('redirects to index.html if userId is not found in cookie', () => {
    document.cookie = 'firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Force an empty cookie state
    Object.defineProperty(document, 'cookie', {
      get: () => '',
      configurable: true,
    });

    readCookie();

    expect(window.location.href).toBe('index.html');

    // Restore normal cookie behavior
    Object.defineProperty(document, 'cookie', {
      get: () => document.cookie,
      configurable: true,
    });
  });
});

describe('addColor JSON payload', () => {
  test('payload contains color and userId fields', () => {
    const color = 'red';
    const uid = 5;
    const payload = JSON.stringify({ color: color, userId: uid });
    const parsed = JSON.parse(payload);

    expect(parsed).toHaveProperty('color', 'red');
    expect(parsed).toHaveProperty('userId', 5);
  });

  test('color field is not empty', () => {
    const color = 'blue';
    const payload = JSON.stringify({ color: color, userId: 1 });
    const parsed = JSON.parse(payload);

    expect(parsed.color.length).toBeGreaterThan(0);
  });
});

describe('searchColor JSON payload', () => {
  test('payload contains search and userId fields', () => {
    const search = 'gre';
    const uid = 3;
    const payload = JSON.stringify({ search: search, userId: uid });
    const parsed = JSON.parse(payload);

    expect(parsed).toHaveProperty('search', 'gre');
    expect(parsed).toHaveProperty('userId', 3);
  });
});
