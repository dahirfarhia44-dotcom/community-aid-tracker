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
const profileBtn = document.getElementById('profileBtn');
const profileSection = document.getElementById('profile-section');

// Initialize - show login form by default
document.addEventListener('DOMContentLoaded', function() {
    displayloginForm.classList.remove('d-none');
    loginbtn.classList.add('btn-success');
    loginbtn.classList.remove('btn-outline-success');
    registerbtn.classList.add('btn-outline-success');
    registerbtn.classList.remove('btn-success');
});

// Toggle buttons
registerbtn.addEventListener('click', () => {
    displayregisterForm.classList.remove('d-none');
    displayloginForm.classList.add('d-none');
    registerbtn.classList.add('btn-success');
    registerbtn.classList.remove('btn-outline-success');
    loginbtn.classList.add('btn-outline-success');
    loginbtn.classList.remove('btn-success');
});

loginbtn.addEventListener('click', () => {
    displayloginForm.classList.remove('d-none');
    displayregisterForm.classList.add('d-none');
    loginbtn.classList.add('btn-success');
    loginbtn.classList.remove('btn-outline-success');
    registerbtn.classList.add('btn-outline-success');
    registerbtn.classList.remove('btn-success');
});

// ===== REGISTER =====
displayregisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const newUser = {
        username: regUsername.value,
        email: regEmail.value,
        password: regPassword.value,
        role: "user",
        bio: ""
    };

    // Check if username or email already exists
    const userExists = users.find(
        u => u.username === regUsername.value || u.email === regEmail.value
    );

    if (userExists) {
        alert('User already exists. Try another username/email.');
        return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');

    // Clear form and switch to login form
    displayregisterForm.reset();
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
        u => u.username === loginUsername.value && u.password === loginPassword.value
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
        welcomeUsername.innerHTML = `${user.username} <span class="badge bg-warning ms-2">ADMIN</span>`;
    } else {
        welcomeUsername.textContent = user.username;
    }

    // Bio
    welcomeBio.textContent = user.bio || '';
}

// Load profile data into form when "Profile" is clicked
function loadProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('profileUsername').value = loggedInUser.username;
        document.getElementById('profilePassword').value = loggedInUser.password;
        document.getElementById('profileBio').value = loggedInUser.bio || "";
    }
}

// AID RECORDING & DISPLAY TOGGLE
addAidBtn.addEventListener('click', () => {
    addAidSection.classList.remove('d-none');
    recordsSection.classList.add('d-none');
    profileSection.classList.add('d-none');
});

viewRecordsBtn.addEventListener('click', () => {
    recordsSection.classList.remove('d-none');
    addAidSection.classList.add('d-none');
    profileSection.classList.add('d-none');
    loadAidRecords();
});

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    displayloginForm.reset();
    displayregisterForm.reset();
    dashboardPage.classList.add('d-none');
    authPage.classList.remove('d-none');
    
    // Show login form by default
    displayregisterForm.classList.add('d-none');
    displayloginForm.classList.remove('d-none');
    loginbtn.classList.add('btn-success');
    loginbtn.classList.remove('btn-outline-success');
    registerbtn.classList.add('btn-outline-success');
    registerbtn.classList.remove('btn-success');
    
    // Reset dashboard sections
    addAidSection.classList.add('d-none');
    recordsSection.classList.add('d-none');
    profileSection.classList.add('d-none');
});

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
        aids[index] = newAid;
    } else {
        aids.push(newAid);
    }

    localStorage.setItem('aids', JSON.stringify(aids));
    localStorage.removeItem('editingAidId');
    localStorage.removeItem('originalRecorder');

    aidForm.reset();
    alert('Aid record saved successfully');

    // After saving, return to records view
    addAidSection.classList.add('d-none');
    recordsSection.classList.remove('d-none');
    loadAidRecords();
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
        const isAdmin = loggedInUser && loggedInUser.role === 'admin';
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
                ${isOwner || isAdmin
                    ? `<div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-warning" onclick="editAid(${aid.id})">✏️ Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteAid(${aid.id})">🗑 Delete</button>
                        </div>`
                    : `<span class="text-muted">No access</span>`
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== AID RECORD EDITING =====
function deleteAid(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        let aids = JSON.parse(localStorage.getItem('aids')) || [];
        aids = aids.filter(aid => aid.id !== id);
        localStorage.setItem('aids', JSON.stringify(aids));
        loadAidRecords();
    }
}

function editAid(id) {
    const aids = JSON.parse(localStorage.getItem('aids')) || [];
    const aid = aids.find(a => a.id === id);
    if (!aid) return;

    localStorage.setItem('editingAidId', id);
    localStorage.setItem('originalRecorder', JSON.stringify(aid.recordedBy));

    addAidSection.classList.remove('d-none');
    recordsSection.classList.add('d-none');
    profileSection.classList.add('d-none');

    aidType.value = aid.type;
    aidQuantity.value = aid.quantity;
    aidBeneficiary.value = aid.beneficiary;
    aidDate.value = aid.date;
}

// ===== PROFILE MANAGEMENT =====
profileBtn.addEventListener('click', () => {
    profileSection.classList.remove('d-none');
    addAidSection.classList.add('d-none');
    recordsSection.classList.add('d-none');
    loadProfile();
});

document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const newUsername = document.getElementById('profileUsername').value;
    const newPassword = document.getElementById('profilePassword').value;
    const newBio = document.getElementById('profileBio').value;

    // Update all aids recorded by this user with new username
    let aids = JSON.parse(localStorage.getItem('aids')) || [];
    aids = aids.map(aid => {
        if (aid.recordedBy === loggedInUser.username) {
            return { ...aid, recordedBy: newUsername };
        }
        return aid;
    });
    localStorage.setItem('aids', JSON.stringify(aids));

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

    // Reset UI
    profileSection.classList.add('d-none');
});