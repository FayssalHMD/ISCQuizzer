//Nav-links Buttons Appear :

const menuButton = document.getElementById('menu-button');
const popupNav = document.getElementById('pop-up-nav');

menuButton.addEventListener('click', () => {
  popupNav.classList.toggle('activeBar');
});


//Profil Button Clicked
const profilButton = document.getElementById('profil-button');
const profilNav = document.getElementById('profil-options');

profilButton.addEventListener('click', () => {
  profilNav.classList.toggle('active');
});