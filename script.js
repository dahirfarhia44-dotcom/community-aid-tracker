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

const addAidBtn = document.getElementById('addAidBtn');
const viewRecordsBtn = document.getElementById('viewRecordsBtn');

const addAidSection = document.getElementById('add-aid-section');
const recordsSection = document.getElementById('records-section');


const aidType = document.getElementById('aidType');
const aidQuantity = document.getElementById('aidQuantity');
const aidBeneficiary = document.getElementById('aidBeneficiary');
const aidDate = document.getElementById('aidDate');



//toggle-btns
registerbtn.addEventListener('click', () => {
  // show register form
  displayregisterForm.classList.remove('d-none');
  displayloginForm.classList.add('d-none');

  // Bootstrap button state
  registerbtn.classList.add('btn-success');
  registerbtn.classList.remove('btn-outline-success');

  loginbtn.classList.add('btn-outline-success');
  loginbtn.classList.remove('btn-success');
});

loginbtn.addEventListener('click', () => {
  // show login form
  displayloginForm.classList.remove('d-none');
  displayregisterForm.classList.add('d-none');

  // Bootstrap button state
  loginbtn.classList.add('btn-success');
  loginbtn.classList.remove('btn-outline-success');

  registerbtn.classList.add('btn-outline-success');
  registerbtn.classList.remove('btn-success');
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

const userExists = users.find(
  u => u.username === regUsername.value || u.email === regEmail.value
);

if (userExists) {
  alert('User already exists. Try another username/email.');
  return;
}


  users.push(newUser); //add new user to users array and save to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful! You can now log in.'); //notify user of successful registration

  // Clear form and switch to login form
displayregisterForm.classList.add('d-none');
displayloginForm.classList.remove('d-none');

loginbtn.classList.add('btn-success');
loginbtn.classList.remove('btn-outline-success');

registerbtn.classList.add('btn-outline-success');
registerbtn.classList.remove('btn-success');
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
  dashboardPage.classList.remove('d-none');
  welcomeUsername.textContent = user.username;
}

// AID RECORDING & DISPLAY TOGGLE
addAidBtn.addEventListener('click', () => {
  addAidSection.classList.remove('d-none');
  recordsSection.classList.add('d-none');
});

// IMPORTANT: load records when user clicks "View Records" to ensure they see the latest data
viewRecordsBtn.addEventListener('click', () => {
  recordsSection.classList.remove('d-none');
  addAidSection.classList.add('d-none');

  loadAidRecords(); // IMPORTANT
});



// LOGOUT
document.getElementById('logout-btn').onclick = () => {
  // 1️⃣ remove logged-in user
  localStorage.removeItem('loggedInUser');

  // 2️⃣ clear all form inputs
  displayloginForm.reset();
  displayregisterForm.reset();

  // 3️⃣ show auth page, hide dashboard
dashboardPage.classList.add('d-none');
  authPage.classList.remove('d-none');

  // 4️⃣ ensure LOGIN form is visible
  displayregisterForm.classList.add('d-none');
  displayloginForm.classList.remove('d-none');
  // 5️⃣ update button states
 loginbtn.classList.add('btn-success');
loginbtn.classList.remove('btn-outline-success');

registerbtn.classList.add('btn-outline-success');
registerbtn.classList.remove('btn-success');

};
// ===== AID RECORDING =====
const aidForm = document.getElementById('aid-form');

aidForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const newAid = {
    id: Date.now(),
    type: aidType.value,
    quantity: aidQuantity.value,
    beneficiary: aidBeneficiary.value,
    date: aidDate.value,
    recordedBy: loggedInUser.username
  };

  const aids = JSON.parse(localStorage.getItem('aids')) || [];
  aids.push(newAid);
  localStorage.setItem('aids', JSON.stringify(aids));

  aidForm.reset();
  alert('Aid record saved successfully');
});
// ===== AID RECORD DISPLAY =====

function loadAidRecords() {
  const tbody = document.getElementById('aid-table-body');
  const aids = JSON.parse(localStorage.getItem('aids')) || [];

  tbody.innerHTML = '';

  aids.forEach(aid => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${aid.type}</td>
      <td>${aid.quantity}</td>
      <td>${aid.beneficiary}</td>
      <td>${aid.date}</td>
      <td>${aid.recordedBy}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editAid(${aid.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteAid(${aid.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}


// ===== AID RECORD EDITING =====
function deleteAid(id) {
  let aids = JSON.parse(localStorage.getItem('aids')) || [];
  aids = aids.filter(aid => aid.id !== id);
  localStorage.setItem('aids', JSON.stringify(aids));
  loadAidRecords();
}
