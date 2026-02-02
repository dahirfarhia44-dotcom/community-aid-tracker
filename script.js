const displayregesterbtn = document.getElementById('regesterbtn');
const displayloginbtn = document.getElementById('loginbtn');

displayloginbtn.addEventListener('click', () => {
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
});

displayregesterbtn.addEventListener('click', () => {
  registerForm.style.display = 'block';
  loginForm.style.display = 'none';
});