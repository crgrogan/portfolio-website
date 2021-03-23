/* Variables */
const navItems = document.querySelectorAll(".nav-item");
const portfolioNavItems = document.querySelectorAll(".portfolio-nav-item");

/* Functions */

const toggleHamburgerMenu = () => {
  document.querySelector(".nav-links").classList.toggle("hamburger-active");
};

const changeCategory = (e) => {
  document
    .querySelector(".active-portfolio-category")
    .classList.remove("active-portfolio-category");
  e.target.classList.add("active-portfolio-category");
};

const changePage = (e) => {
  const currentPage = document.querySelector(".active-nav-item");
  if (currentPage) {
    currentPage.classList.remove("active-nav-item");
  }
  e.target.parentElement.classList.add("active-nav-item");
  toggleHamburgerMenu();
};

/* Event Listeners */

document
  .querySelector(".open-hamburger")
  .addEventListener("click", toggleHamburgerMenu);

document
  .querySelector(".close-hamburger")
  .addEventListener("click", toggleHamburgerMenu);

navItems.forEach((item) => item.addEventListener("click", changePage));

portfolioNavItems.forEach((item) =>
  item.addEventListener("click", changeCategory)
);
