export function validateCredentials(e, username, password, setDisplayError) {
  e.preventDefault();
  // Check if username and password contain only allowed characters
  const illegalCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (illegalCharacters.test(username)) {
    setDisplayError("bad characters");
    return false;
  }
  // Check if username and password are at least 3 characters long
  if (username.length < 3) {
    setDisplayError("short username");
    return;
  }

  if (password.length < 5) {
    setDisplayError("short password");
    return;
  }

  return true;
}
