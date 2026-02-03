const toggleButtons = document.getElementById('togglebuttons');

const registerbtn = document.getElementById('registerbtn');
const loginbtn = document.getElementById('loginbtn');

const displayregisterForm = document.getElementById('displayregisterForm');
const displayloginForm = document.getElementById('displayloginForm');

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