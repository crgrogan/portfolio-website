document.addEventListener(
  "DOMContentLoaded",
  () => {
    /* Variables */
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".section-link");
    const portfolioLink = document.querySelector(".portfolio-link");
    const viewPortfolioBtn = document.querySelector(".view-portfolio-btn");
    const portfolioNavItems = document.querySelectorAll(".portfolio-nav-item");
    const contactForm = document.getElementById("contact-form");
    const emailModal = document.querySelector(".email-modal");
    const emailModalBody = document.querySelector(".email-modal-body");
    const closeEmailModal = document.querySelector(".close-email-modal");
    const linkToTop = document.querySelector(".link-to-top");
    // grab the sections (targets) and menu_links (triggers)
    // for menu items to apply active link styles to
    const sections = document.querySelectorAll(".template__section");
    const menu_links = document.querySelectorAll(".nav-item");
    // change the active link a bit above the actual section
    // this way it will change as you're approaching the section rather
    // than waiting until the section has passed the top of the screen
    const sectionMargin = 100;

    // keep track of the currently active link
    // use this so as not to change the active link over and over
    // as the user scrolls but rather only change when it becomes
    // necessary because the user is in a new section of the page
    let currentActive = 0;

    /* Functions */

    const removeHash = () => {
      history.replaceState(
        "",
        document.title,
        window.location.origin +
          window.location.pathname +
          window.location.search
      );
    };

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
      const currentPage = document.querySelector(".active-nav-item");
      if (currentPage) {
        currentPage.classList.remove("active-nav-item");
      }
      e.target.parentElement.classList.add("active-nav-item");
      if (
        document
          .querySelector(".nav-links")
          .classList.contains("hamburger-active")
      ) {
        toggleHamburgerMenu();
      }
      setTimeout(() => {
        removeHash();
      }, 5);
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

    // functions to add and remove the active class from links as appropriate
    const makeActive = (link) =>
      menu_links[link].classList.add("active-nav-item");
    const removeActive = (link) =>
      menu_links[link].classList.remove("active-nav-item");
    const removeAllActive = () =>
      [...Array(sections.length).keys()].forEach((link) => removeActive(link));

    /* Event Listeners */

    window.addEventListener("scroll", () => {
      if (window.scrollY + 65 > window.innerHeight) {
        navbar.classList.add("solid");
      } else {
        navbar.classList.remove("solid");
      }
      // check in reverse order so we find the last section
      // that's present - checking in non-reverse order would
      // report true for all sections up to and including
      // the section currently in view
      //
      // Data in play:
      // window.scrollY    - is the current vertical position of the window
      // sections          - is a list of the dom nodes of the sections of the page
      //                     [...sections] turns this into an array so we can
      //                     use array options like reverse() and findIndex()
      // section.offsetTop - is the vertical offset of the section from the top of the page
      //
      // basically this lets us compare each section (by offsetTop) against the
      // viewport's current position (by window.scrollY) to figure out what section
      // the user is currently viewing
      const current =
        sections.length -
        [...sections]
          .reverse()
          .findIndex(
            (section) => window.scrollY >= section.offsetTop - sectionMargin
          ) -
        1;

      // only if the section has changed
      // remove active class from all menu links
      // and then apply it to the link for the current section
      if (current !== currentActive) {
        removeAllActive();
        currentActive = current;
        makeActive(current);
      }
    });

    document
      .querySelector(".open-hamburger")
      .addEventListener("click", toggleHamburgerMenu);

    document
      .querySelector(".close-hamburger")
      .addEventListener("click", toggleHamburgerMenu);

    navLinks.forEach((item) => item.addEventListener("click", changeSection));

    viewPortfolioBtn.addEventListener("click", () => {
      window.location.href = "#portfolio";
      setTimeout(() => {
        removeHash();
      }, 5);
      const currentPage = document.querySelector(".active-nav-item");
      if (currentPage) {
        currentPage.classList.remove("active-nav-item");
      }
      portfolioLink.classList.add("active-nav-item");
    });

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

    linkToTop.addEventListener("click", () => {
      setTimeout(() => {
        removeHash();
      }, 5);
    });
  },
  false
);
