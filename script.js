const toggleButtons = document.getElementById('togglebuttons');

const registerbtn = document.getElementById('registerbtn');
const loginbtn = document.getElementById('loginbtn');

const displayregisterForm = document.getElementById('displayregisterForm');
const displayloginForm = document.getElementById('displayloginForm');


const regUsername = document.getElementById('regUsername');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');

const authPage = document.getElementById('authentication');
const dashboardPage = document.getElementById('dashboard-page');
const welcomeUsername = document.getElementById('welcome-username');

//toggle-btns
registerbtn.addEventListener('click', () => {
  displayregisterForm.style.display = 'block';
  displayloginForm.style.display = 'none';

  registerbtn.classList.add('active');
  loginbtn.classList.remove('active');

  toggleButtons.classList.add('move-up');
});

loginbtn.addEventListener('click', () => {
  displayregisterForm.style.display = 'none';
  displayloginForm.style.display = 'block';

  registerbtn.classList.remove('active');
  loginbtn.classList.add('active');

  toggleButtons.classList.add('move-up');

});

// ===== REGISTER =====
displayregisterForm.addEventListener('submit', (e) => {
  e.preventDefault(); //e.preventDefault() stops page from refreshing on form submit

  let users = JSON.parse(localStorage.getItem('users')) || []; //get existing users or start with empty array

  const newUser = { //create new user object
    username: regUsername.value,
    email: regEmail.value,
    password: regPassword.value
  };

  users.push(newUser); //add new user to users array and save to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful! You can now log in.'); //notify user of successful registration

  // Clear form and switch to login form
  displayregisterForm.reset();
  displayregisterForm.style.display = 'none';  // hide register form
  displayloginForm.style.display = 'block';    // show login form

  
  registerbtn.classList.remove('active');
  loginbtn.classList.add('active');
});




// ===== LOGIN =====

displayloginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(
    u =>
      u.username === loginUsername.value &&
      u.password === loginPassword.value
  );

  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    showDashboard(user);
  } else {
    alert('Invalid username or password');
  }
});


// DASHBOARD DISPLAY
function showDashboard(user) {
  authPage.style.display = 'none';
  dashboardPage.style.display = 'block';
  welcomeUsername.textContent = user.username;
}


// LOGOUT
document.getElementById('logout-btn').onclick = () => {
  // 1️⃣ remove logged-in user
  localStorage.removeItem('loggedInUser');

  // 2️⃣ clear all form inputs
  displayloginForm.reset();
  displayregisterForm.reset();

  // 3️⃣ show auth page, hide dashboard
  dashboardPage.style.display = 'none';
  authPage.style.display = 'block';

  // 4️⃣ ensure LOGIN form is visible
  displayregisterForm.style.display = 'none';
  displayloginForm.style.display = 'block';

  // 5️⃣ update button states
  registerbtn.classList.remove('active');
  loginbtn.classList.add('active');
};



