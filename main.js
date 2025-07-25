const apiURL = 'https://brocnrollbackend.onrender.com';

async function loadFoodData() {
  try {
    const response = await fetch(`${apiURL}/food`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const suitableItems = data.foods.filter(item => item.suitableforelderly === true);
    console.log(`suitableItems: ${suitableItems[0]}`);

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const container = document.getElementById('foodList');
    container.innerHTML = '';

    if (suitableItems.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No suitable food items found.</p>';
      return;
    }

    suitableItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow text-left';

      card.innerHTML = `
        <h3 class="text-xl font-bold mb-1">${item.foodname}</h3>
        ${isLoggedIn ? `
          <img src="${item.photo}">
          <p class="text-sm text-gray-700 mb-1"><strong>Nutrition:</strong></p>
          <p class="text-sm text-gray-700 mb-1">Calorie: ${item.nutritioninfo.calories}</p>
          <p class="text-sm text-gray-700 mb-1">Carb: ${item.nutritioninfo.carbs}</p>
          <p class="text-sm text-gray-700 mb-1">Fat: ${item.nutritioninfo.fats}</p>
          <p class="text-sm text-gray-700 mb-1">Protein: ${item.nutritioninfo.proteins}</p>
          <p class="text-sm text-gray-700 mb-1"><strong>Dietary:</strong> ${item.dietaryrestriction}</p>     
        ` : `
          <p class="text-sm text-gray-500 italic mb-1">Login to view nutrition and dietary info.</p>
        `}
        <p class="text-sm text-gray-600 italic">${item.additionnote}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Failed to load data:', error);
    document.getElementById('foodList').innerHTML = '<p class="text-red-600">Unable to load food data.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFoodData();
});


// Register Form
document.addEventListener('DOMContentLoaded', function () {
  const registerBtn = document.getElementById('Register');
  const registerForm = document.getElementById('RegisterForm');
  const closeBtn = document.getElementById('closeUpForm'); // optional

  if (registerBtn && registerForm) {
    registerBtn.addEventListener('click', function () {
      registerForm.classList.remove('hidden');
    });
  }

  if (closeBtn && registerForm) {
    closeBtn.addEventListener('click', function () {
      registerForm.classList.add('hidden');
    });
  }
});


// Register User

document.addEventListener('DOMContentLoaded', () => {
  const bRegister = document.getElementById('bRegister');
  const username = document.getElementById('rname');
  const password = document.getElementById('rpassword');
  const cpassword = document.getElementById('rcpassword');
  const gender = document.getElementById('rgender');
  const age = document.getElementById('rage');
  const weight = document.getElementById('rweight');
  const height = document.getElementById('rheight');

  bRegister.addEventListener('click', async (e) => {
    e.preventDefault();
    const uVal = username.value;
    const pVal = password.value;
    const cpVal = cpassword.value;
    const gVal = gender.value;
    const aVal = age.value;
    const wVal = weight.value;
    const hVal = height.value;

    console.log(`name: ${uVal}, password: ${pVal}, gender: ${gVal}, age: ${aVal}, weight: ${wVal}, height: ${hVal}`)

    if (pVal !== cpVal) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${apiURL}/account/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: uVal, password: pVal, role: 'user', gender: gVal, age: aVal, height: wVal, weight: hVal }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! You can now log in.');
        window.location.href = 'product.html';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while trying to register. Please try again later.');
    }
  });
});


// Login Form

document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('Login');
  const loginForm = document.getElementById('LoginForm');
  const closeBtn = document.getElementById('closeInForm');

  // Show login form
  if (loginBtn && loginForm) {
    loginBtn.addEventListener('click', function () {
      loginForm.classList.remove('hidden');
    });
  }

  // Hide login form
  if (closeBtn && loginForm) {
    closeBtn.addEventListener('click', function () {
      loginForm.classList.add('hidden');
    });
  }
});


// Swap in between Register and Login

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('RegisterForm');
  const loginForm = document.getElementById('LoginForm');

  const showLoginFromRegister = document.getElementById('showLoginFromRegister');
  const showRegisterFromLogin = document.getElementById('showRegisterFromLogin');

  // Show Login form from Register form link
  showLoginFromRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Show Register form from Login form link
  showRegisterFromLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });
});


// Login User

document.addEventListener('DOMContentLoaded', () => {
  const bLogin = document.getElementById('bLogin');
  const username = document.getElementById('sname');
  const password = document.getElementById('spassword');

  if (!bLogin) {
    console.error('Login button not found!');
    return;
  }

  bLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    const uVal = username.value.trim();
    const pVal = password.value;

    if (!uVal || !pVal) {
      alert('Please enter username and password');
      return;
    }

    try {
      const response = await fetch(`${apiURL}/account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: uVal, password: pVal }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'product.html'; // redirect after login
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while trying to log in. Please try again later.');
    }
  });
});