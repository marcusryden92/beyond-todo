export function validateCredentials(username, password) {
  // Check if username and password are at least 3 characters long
  if (username.length < 3 || password.length < 3) {
    return false;
  }

  // Check if username and password contain only allowed characters
  const illegalCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (illegalCharacters.test(username) || illegalCharacters.test(password)) {
    return false;
  }

  return true;
}
