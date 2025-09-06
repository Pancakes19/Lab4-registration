// Key to store data in localStorage
const KEY = "students";

// Year validation function
function validateYear() {
  const yearInput = document.getElementById("Year");
  const yearError = document.getElementById("yearError");
  const value = parseInt(yearInput.value);

  if (isNaN(value) || value <= 0) {
    yearError.textContent = "Year must be greater than 0";
    yearInput.style.borderColor = "red";
    return false; // invalid
  } else {
    yearError.textContent = "";
    yearInput.style.borderColor = "green";
    return true; // valid
  }
}

// Live validation
document.getElementById("Year").addEventListener("input", validateYear);

// Handle form submit
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault(); // stop refresh

  // Block submit if year invalid
  if (!validateYear()) return;

  const fileInput = document.getElementById("Photo");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      saveStudent(event.target.result); // Base64 string of image
    };
    reader.readAsDataURL(file); // convert image to base64
  } else {
    saveStudent("No photo");
  }
});

function saveStudent(photoData) {
  // Collect values from form fields
  const student = {
    firstname: document.getElementById("firstname").value.trim(),
    lastname: document.getElementById("lastname").value.trim(),
    email: document.getElementById("Email").value.trim(),
    programme: document.getElementById("Programme").value.trim(),
    year: document.getElementById("Year").value.trim(),
    interests: document.getElementById("Interests").value.trim(),
    photo: photoData
  };

  // Get current list or start fresh
  let students = JSON.parse(localStorage.getItem(KEY)) || [];

  // Add new student
  students.push(student);

  // Save back to localStorage
  localStorage.setItem(KEY, JSON.stringify(students));

  // Redirect to dashboard
  window.location.href = "home.html";
}
