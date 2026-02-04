// Get logged-in user
const user = JSON.parse(localStorage.getItem('loggedInUser'));

// Protect page
if (!user) {
  window.location.href = 'index.html';
}

// Show username
document.getElementById('welcome').textContent =
  `Hello ${user.username}, you can now manage aid requests.`;

// Logout
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
});
