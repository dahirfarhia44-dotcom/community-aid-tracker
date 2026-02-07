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



const welcomeBio = document.getElementById('welcome-bio');



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

 const newUser = {
  username: regUsername.value,
  email: regEmail.value,
  password: regPassword.value,
  role: "user",
  bio: ""   // default empty bio
};


// Check if username or email already exists
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
  authPage.classList.add('d-none');
  dashboardPage.classList.remove('d-none');

  // Username + admin badge
  if (user.role === 'admin') {
    welcomeUsername.innerHTML = `
      ${user.username}
      <span class="badge bg-warning ms-2">ADMIN</span>
    `;
  } else {
    welcomeUsername.textContent = user.username;
  }

  // Bio (this was missing before)
  welcomeBio.textContent = user.bio || '';
}


// Load profile data into form when "Profile" is clicked
function loadProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  document.getElementById('profileUsername').value = loggedInUser.username;
  document.getElementById('profilePassword').value = loggedInUser.password;
  document.getElementById('profileBio').value = loggedInUser.bio || "";
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

// reset dashboard sections
addAidSection.classList.add('d-none');
recordsSection.classList.add('d-none');


};
// ===== AID RECORDING =====
const aidForm = document.getElementById('aid-form');

aidForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const editingAidId = localStorage.getItem('editingAidId');

const newAid = {
  id: editingAidId ? Number(editingAidId) : Date.now(),
  type: aidType.value,
  quantity: aidQuantity.value,
  beneficiary: aidBeneficiary.value,
  date: aidDate.value,
  recordedBy: editingAidId
    ? JSON.parse(localStorage.getItem('originalRecorder'))
    : loggedInUser.username,
  updatedBy: editingAidId ? loggedInUser.username : null
};


  let aids = JSON.parse(localStorage.getItem('aids')) || [];

const index = aids.findIndex(aid => aid.id === newAid.id);

if (index > -1) {
  // EDIT MODE → replace existing record
  aids[index] = newAid;
} else {
  // NEW RECORD → add
  aids.push(newAid);
}

localStorage.setItem('aids', JSON.stringify(aids));

// clear edit state
localStorage.removeItem('editingAidId');
localStorage.removeItem('originalRecorder');

  localStorage.setItem('aids', JSON.stringify(aids));

  aidForm.reset();
  alert('Aid record saved successfully');
});



// ===== AID RECORD DISPLAY =====

function loadAidRecords() {
  const tbody = document.getElementById('aid-table-body');
  const aids = JSON.parse(localStorage.getItem('aids')) || [];
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const users = JSON.parse(localStorage.getItem('users')) || [];


  tbody.innerHTML = '';

  aids.forEach(aid => {
    const isOwner = aid.recordedBy === loggedInUser.username;
    const isAdmin = loggedInUser.role === 'admin'; // ✅ check admin role
    const recordUser = users.find(u => u.username === aid.recordedBy);
    const bio = recordUser?.bio || '';


    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${aid.type}</td>
      <td>${aid.quantity}</td>
      <td>${aid.beneficiary}</td>
      <td>${aid.date}</td>
      <td>
          <strong>${aid.recordedBy}</strong><br>
          <small class="text-muted">${bio}</small>
      </td>

      <td>
        ${
          isOwner || isAdmin  // ✅ allow if owner OR admin
            ? `
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-warning" onclick="editAid(${aid.id})">✏️ Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAid(${aid.id})">🗑 Delete</button>
              </div>

            `
            : `<span class="text-muted">No access</span>`
        }
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


//edit functionality: when user clicks "Edit", we load the aid data into the form and delete the old record. This way, when they save, it creates a new record with the updated info but keeps the same "recordedBy" for accountability.
// When user clicks "Edit", we load the aid data into the form and delete the old record.
function editAid(id) {
  const aids = JSON.parse(localStorage.getItem('aids')) || [];
  const aid = aids.find(a => a.id === id);
  if (!aid) return;

  // Save edit context
  localStorage.setItem('editingAidId', id);
  localStorage.setItem('originalRecorder', JSON.stringify(aid.recordedBy));

  // Show form
  addAidSection.classList.remove('d-none');
  recordsSection.classList.add('d-none');

  // Prefill form
  aidType.value = aid.type;
  aidQuantity.value = aid.quantity;
  aidBeneficiary.value = aid.beneficiary;
  aidDate.value = aid.date;

  // DO NOT delete yet
}



// ===== PROFILE MANAGEMENT =====
const profileBtn = document.getElementById('profileBtn');
const profileSection = document.getElementById('profile-section');

profileBtn.addEventListener('click', () => {
  profileSection.classList.remove('d-none');
  addAidSection.classList.add('d-none');
  recordsSection.classList.add('d-none');

  loadProfile();
});


// When user submits profile form, we update their info in both "users" and "loggedInUser" in localStorage, then refresh the dashboard to show updated username and bio.
document.getElementById('profile-form').addEventListener('submit', (e) => {
  e.preventDefault();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const newUsername = document.getElementById('profileUsername').value;
  const newPassword = document.getElementById('profilePassword').value;
  const newBio = document.getElementById('profileBio').value;

  users = users.map(user => {
    if (user.username === loggedInUser.username) {
      return {
        ...user,
        username: newUsername,
        password: newPassword,
        bio: newBio
      };
    }
    return user;
  });


  // Update loggedInUser object
  loggedInUser.username = newUsername;
  loggedInUser.password = newPassword;
  loggedInUser.bio = newBio;

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));


  showDashboard(loggedInUser);
alert('Profile updated successfully!');

// reset UI
profileSection.classList.add('d-none');
addAidSection.classList.add('d-none');
recordsSection.classList.add('d-none');

});
