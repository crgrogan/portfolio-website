/* Variables */
const navLinks = document.querySelectorAll(".section-link");
const portfolioNavItems = document.querySelectorAll(".portfolio-nav-item");
const contactForm = document.getElementById("contact-form");
const emailModal = document.querySelector(".email-modal");
const emailModalBody = document.querySelector(".email-modal-body");
const closeEmailModal = document.querySelector(".close-email-modal");

/* Functions */
const toggleHamburgerMenu = () => {
  document.querySelector(".nav-links").classList.toggle("hamburger-active");
};

const changePortfolioCategory = (e) => {
  document
    .querySelector(".active-portfolio-category")
    .classList.remove("active-portfolio-category");
  e.target.classList.add("active-portfolio-category");
};

const changeSection = (e) => {
  console.log(e.target);
  const currentPage = document.querySelector(".active-nav-item");
  if (currentPage) {
    currentPage.classList.remove("active-nav-item");
  }
  e.target.parentElement.classList.add("active-nav-item");
  toggleHamburgerMenu();
};

const sendMail = (mail) => {
  fetch("http://localhost:5000/send", {
    method: "POST",
    body: mail,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => clearForm(data.message));
};

const clearForm = (msg) => {
  contactForm.reset();
  emailModalBody.innerHTML = msg;
  emailModal.style.display = "flex";
};

/* Event Listeners */
document
  .querySelector(".open-hamburger")
  .addEventListener("click", toggleHamburgerMenu);

document
  .querySelector(".close-hamburger")
  .addEventListener("click", toggleHamburgerMenu);

navLinks.forEach((item) => item.addEventListener("click", changeSection));

portfolioNavItems.forEach((item) =>
  item.addEventListener("click", changePortfolioCategory)
);

const contactFormEvent = contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let mail = new FormData(contactForm);
  sendMail(mail);
});

// When the user clicks on x button, close the modal
closeEmailModal.addEventListener("click", () => {
  emailModal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (e) => {
  if (e.target == emailModal) {
    emailModal.style.display = "none";
  }
});
