document.querySelector('.nav-button').addEventListener('click', function() {
  var sidebar = document.querySelector('.side-bar-container');
  var header = document.querySelector('.header-container');
  const secondBar = document.getElementById('secondBar');
  let isToggled = secondBar.getAttribute('width') === '0';

  // Toggle sidebar
  if (sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    setTimeout(() => header.classList.remove('header-no-shadow'), 200);
    secondBar.setAttribute('width', '70');
    secondBar.setAttribute('y', '70');
  } else {
    sidebar.classList.add('show');
    header.classList.add('header-no-shadow');
    secondBar.setAttribute('width', '0');
    secondBar.setAttribute('y', '40');
  }
});

// Add event listeners to all sidebar buttons
document.querySelectorAll('.nav-bar, .nav-bar5').forEach(button => {
  button.addEventListener('click', function() {
    // Remove active class from all buttons
    document.querySelectorAll('.nav-bar, .nav-bar5').forEach(btn => {
      btn.classList.remove('active');
    });
    // Add active class to the clicked button
    this.classList.add('active');
    // Store the active button's ID in sessionStorage
    sessionStorage.setItem('activeButton', this.id);
  });
});

// Load the active button state on page load
window.addEventListener('load', function() {
  const activeButtonId = sessionStorage.getItem('activeButton');
  if (activeButtonId) {
    const activeButton = document.getElementById(activeButtonId);
    if (activeButton) {
      activeButton.classList.add('active'); // Set the active class to the stored button
    }
  }
});

// Hide sidebar on scroll
window.addEventListener('scroll', function() {
  var sidebar = document.querySelector('.side-bar-container');
  var header = document.querySelector('.header-container');
  const secondBar = document.getElementById('secondBar');

  if (sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    header.classList.remove('header-no-shadow');
    secondBar.setAttribute('width', '70');
    secondBar.setAttribute('y', '70');
  }
});

// Hide sidebar when clicking outside of it
document.addEventListener('click', function(event) {
  var sidebar = document.querySelector('.side-bar-container');
  var header = document.querySelector('.header-container');
  var navButton = document.querySelector('.nav-button');
  const secondBar = document.getElementById('secondBar');

  if (!sidebar.contains(event.target) && !navButton.contains(event.target)) {
    if (sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      header.classList.remove('header-no-shadow');
      secondBar.setAttribute('width', '70');
      secondBar.setAttribute('y', '70');
    }
  }
});

// Remaining code for fetching content and other functionalities...


document.addEventListener("DOMContentLoaded", function() {
  const logo = document.querySelector('.hover-logo');

  // Function to update logo title based on the current content type
  function updateLogoTitle(contentType) {
    logo.title = contentType === 'home' ? "Reload" : "Home";
  }

  // Initially check what content is currently being displayed
  let currentContentType = window.location.pathname.endsWith('/index.html') ? 'home' : 'other';
  updateLogoTitle(currentContentType);

  // Attach the click event to the logo
  logo.onclick = function() {
    goHome(); // This will navigate to home
    fetchContent('home'); // Simulate loading home content
  };

  // Load BAU content
  function loadBAUContent() {
    fetchContent('BAU'); // Change to 'BAU' content type
    updateLogoTitle('BAU'); // Update the logo title to reflect BAU content
  }

  // Example: Fetching other content on page load or based on your logic
  document.getElementById('nav-bar3').addEventListener('click', function() {
    loadBAUContent(); // Call to load BAU content
    sessionStorage.setItem('currentPage', 'bau'); // Store the current page
  });

  // Load content based on stored state or default to the main page
  window.addEventListener('load', function() {
    const storedPage = sessionStorage.getItem('currentPage');
    if (storedPage) {
      loadContent(storedPage); // Load the stored page
      updateLogoTitle(storedPage); // Update the logo title based on stored page
    } else {
      loadContent('main'); // Load default main content if nothing is stored
    }
  });
});

// Function to clear sessionStorage and navigate to home
function goHome() {
  sessionStorage.clear(); // Clear sessionStorage when navigating to home
  window.location.href = 'index.html'; // Always go to the main index page
}

function NavHome() {
  sessionStorage.clear(); // Clear sessionStorage

  // Check if content is already stored in localStorage
  const savedContent = localStorage.getItem('homeContent');


  // Update the logo title
  const logo = document.querySelector('.hover-logo');
  logo.title = "Reload"; // Update the title when navigating to home


  if (savedContent) {
    // If content is in localStorage, load it into .main
    document.querySelector('.main').innerHTML = savedContent;
  } else {
    // Fetch the HTML file if not in localStorage
    fetch('cont/00.home/home.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        document.querySelector('.main').innerHTML = data; // Insert the fetched HTML into .main
        localStorage.setItem('homeContent', data); // Save content to localStorage
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
}

// When the page loads, automatically check for saved content
window.addEventListener('load', () => {
  const savedContent = localStorage.getItem('homeContent');
  const currentPage = sessionStorage.getItem('currentPage');
  
  if (!currentPage) {
    // If there's no current page stored, fetch the home page by default
    NavHome(); // Fetch and display home content
  } else {
    // Load the stored page
    loadContent(currentPage); 
  }
});





// Simulated fetch function to demonstrate changing content
function fetchContent(contentType) {
  console.log(`Fetching ${contentType} content...`);
  // Implement your logic for loading new content here
}

// Function to load specific content
function loadContent(page) {
  const mainContent = document.querySelector('.main');

  // Reset any existing counters
  resetCounters();

  let filePath = '';
  let activeNavButton = '';

  switch (page) {
    case 'bau':
      filePath = 'cont/00.bau/bau.html';
      activeNavButton = 'nav-bar3'; // Set the active button for BAU
      break;
    case 'main':
      filePath = 'cont/main.html'; // Replace with your main content file path
      activeNavButton = 'nav-bar1'; // Set the active button for Main
      break;
    // Add cases for other pages if needed
    default:
      return;
  }

  fetch(filePath)
    .then(response => response.ok ? response.text() : Promise.reject('Failed to load'))
    .then(data => {
      mainContent.innerHTML = data;

      // Remove existing script if it exists
      const existingScript = document.querySelector('script[src="cont/00.bau/bau.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Load bau.js dynamically after content is loaded
      const script = document.createElement('script');
      script.src = 'cont/00.bau/bau.js'; // Path to your JS file
      script.type = 'text/javascript';
      script.onload = () => {
        console.log("BAU JavaScript loaded");
        // Call the counting function here if needed
        startCounting(); // Ensure you call startCounting() if defined in bau.js
      };
      document.body.appendChild(script);

      // Activate the correct nav button
      document.querySelectorAll('.nav-bar, .nav-bar5').forEach(btn => {
        btn.classList.remove('active');
      });
      document.getElementById(activeNavButton).classList.add('active');
    })
    .catch(error => console.error('Error loading content:', error));
}

// Modify the loadBAU function to store the current page
function loadBAU() {
  loadContent('bau'); // Load BAU content
  sessionStorage.setItem('currentPage', 'bau'); // Store the current page in sessionStorage
}

// Function to reset counters
function resetCounters() {
  const counters = document.querySelectorAll(".info-container div");
  counters.forEach((counter) => {
    counter.innerText = counter.classList.contains("ST") ? "0+" : "0"; // Reset to 0 or '0+' for Students
  });
}

// Additional dropdown and translation functions remain unchanged


/*-----------------------------------------------------------------------*/ 


function toggleDropdown() {
  const dropdown = document.getElementById("lang-dropdown");
  dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
}

// Close the dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.lang-button')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    Array.from(dropdowns).forEach(openDropdown => {
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    });
  }
};

const translations = {
  en: {
    title: "MCQs Coronary Academic",
    language: "Language",
    login: "Login",
    register: "Sign Up",
    HomeNavButton: "Home",
    mcqsLibrary: "MCQs Library",
    Uni: "BAU",
    contactUs: "Contact Us",
    help: "Help",
    footerText: "© 2024 Coronary Academic MCQs. All rights reserved.",
    beta: "Beta Version – Work in Progress",
    btnEn: "English",
    btnAr: "Arabic"
  },
  ar: {
    title: "MCQs كوروناري أكاديمي",
    language: "اللغة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    HomeNavButton: "الصفحة الرئيسية",
    mcqsLibrary: "مكتبة الأسئلة",
    Uni: "جامعة البلقاء التطبيقية",
    contactUs: "اتصل بنا",
    help: "المساعدة",
    footerText: "© 2024 أم سي كيو كوروناري أكاديمي. جميع الحقوق محفوظة.",
    beta: "النسخة التجريبية - قيد التطوير",
    btnEn: "إنجليزي",
    btnAr: "عربي"
  },
};

function translatePage(lang) {
  const trans = translations[lang];

  // Update title and buttons
  document.title = trans.title;
  document.querySelector('.lang-button').textContent = trans.language;
  document.querySelector('.login-button').textContent = trans.login;
  document.querySelector('.register-button').textContent = trans.register;

  // Update all sidebar buttons
  document.querySelectorAll('.nav-bar').forEach((btn, index) => {
    if (index === 0) {
      btn.textContent = trans.HomeNavButton;
    } else if (index === 1) {
      btn.textContent = trans.mcqsLibrary;
    } else if (index === 2) {
      btn.textContent = trans.Uni;
    } else if (index === 3) {
      btn.textContent = trans.contactUs;
    }
  });
  document.querySelector('.nav-bar5').textContent = trans.help;

  // Update main content
  document.querySelector('.end-margin-text01').textContent = trans.footerText;
  document.querySelector('.end-margin-text02').textContent = trans.beta;

  // Update dropdown button texts
  document.getElementById('btn-en').textContent = trans.btnEn;
  document.getElementById('btn-ar').textContent = trans.btnAr;

  // Manage active state for dropdown buttons
  const langButtons = document.querySelectorAll('#lang-dropdown button');
  langButtons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(lang === 'en' ? 'btn-en' : 'btn-ar').classList.add('active');

  // Set the Arabic font for the body if Arabic is selected
  if (lang === 'ar') {
    document.body.classList.add('arabic-font');
  } else {
    document.body.classList.remove('arabic-font');
  }

  // Save the selected language to localStorage
  localStorage.setItem('selectedLanguage', lang);
}

// Load the selected language on page load
window.onload = function() {
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // Default to English if none is saved
  translatePage(savedLanguage);
};

// Hide dropdown on window resize
window.addEventListener('resize', function() {
  document.getElementById('lang-dropdown').style.display = 'none';
});

// Language button click events
document.querySelectorAll('#lang-dropdown button').forEach(btn => {
  btn.addEventListener('click', function() {
    const lang = this.id === 'btn-en' ? 'en' : 'ar';
    translatePage(lang);
  });
});
function loadContactUs() {
  fetch('cont/00.contact/contact.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text();
      })
      .then(data => {
          // Load the content into the main div
          document.querySelector('.main').innerHTML = data;

          // Store the current page in sessionStorage
          sessionStorage.setItem('currentPage', 'contact');
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}

// Function to load the page based on session storage
function loadCurrentPage() {
  const currentPage = sessionStorage.getItem('currentPage');

  if (currentPage === 'contact') {
      loadContactUs();
  } else {
      // Load home content or other default content
      loadHomeContent(); // Define this function to load the home page
  }
}

// Call loadCurrentPage on page load
window.onload = loadCurrentPage;

// Optionally define the loadHomeContent function
function loadHomeContent() {
  // Example to fetch home content
  fetch('cont/home.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text();
      })
      .then(data => {
          document.querySelector('.main').innerHTML = data;
          // Optionally store the home page state
          sessionStorage.setItem('currentPage', 'home');
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}
