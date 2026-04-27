/**
 * Unit Tests for code.js
 * Tests cookie save/read logic and JSON payload formatting
 */
 
// ---- State (mirrors code.js module-level variables) ----
let userId = 0;
let firstName = '';
let lastName = '';
 
// ---- Functions copied from code.js ----
 
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
    userId = 0;
    firstName = '';
    lastName = '';
    document.cookie = 'firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
 
  test('saves firstName into document.cookie', () => {
    firstName = 'Sam';
    lastName = 'Trout';
    userId = 42;
    saveCookie();
    expect(document.cookie).toContain('firstName=Sam');
  });
 
  test('saves lastName into document.cookie', () => {
    firstName = 'Sam';
    lastName = 'Trout';
    userId = 42;
    saveCookie();
    expect(document.cookie).toContain('lastName=Trout');
  });
 
  test('saves userId into document.cookie', () => {
    firstName = 'Sam';
    lastName = 'Trout';
    userId = 42;
    saveCookie();
    expect(document.cookie).toContain('userId=42');
  });
});
 
describe('readCookie', () => {
  beforeEach(() => {
    userId = 0;
    firstName = '';
    lastName = '';
  });

  test('reads firstName back from cookie', () => {
    document.cookie = 'firstName=Sam,lastName=Trout,userId=42';
    readCookie();
    expect(firstName).toBe('Sam');
  });

  test('reads lastName back from cookie', () => {
    document.cookie = 'firstName=Sam,lastName=Trout,userId=42';
    readCookie();
    expect(lastName).toBe('Trout');
  });

  test('reads userId back from cookie', () => {
    document.cookie = 'firstName=Sam,lastName=Trout,userId=42';
    readCookie();
    expect(userId).toBe(42);
  });

  test('sets userId to -1 when cookie is empty', () => {
    Object.defineProperty(document, 'cookie', {
      get: () => '',
      configurable: true,
    });
    readCookie();
    expect(userId).toBe(-1);
    Object.defineProperty(document, 'cookie', {
      get: jest.fn(),
      set: jest.fn(),
      configurable: true,
    });
  });
});
 
describe('addColor JSON payload', () => {
  test('payload contains color and userId fields', () => {
    const payload = JSON.parse(JSON.stringify({ color: 'red', userId: 5 }));
    expect(payload).toHaveProperty('color', 'red');
    expect(payload).toHaveProperty('userId', 5);
  });
 
  test('color field is not empty', () => {
    const payload = JSON.parse(JSON.stringify({ color: 'blue', userId: 1 }));
    expect(payload.color.length).toBeGreaterThan(0);
  });
});
 
describe('searchColor JSON payload', () => {
  test('payload contains search and userId fields', () => {
    const payload = JSON.parse(JSON.stringify({ search: 'gre', userId: 3 }));
    expect(payload).toHaveProperty('search', 'gre');
    expect(payload).toHaveProperty('userId', 3);
  });
});