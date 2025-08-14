const apiURL = 'https://brocnrollbackend.onrender.com';

async function loadFoodData() {
  try {
    const response = await fetch(`${apiURL}/food`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const container = document.getElementById('foodList');
    container.innerHTML = '';

    if (isLoggedIn) {

      // Retrieve user ID from localStorage (saved after login)
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('No user ID found in localStorage');

      // Fetch profile using your existing backend route
      const profileRes = await fetch(`${apiURL}/account/${userId}`);
      if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
      const profile = await profileRes.json();

      // Convert height & weight to numbers
      const heightNum = parseFloat(profile.account.height);
      const weightNum = parseFloat(profile.account.weight);

      // Calculate BMI
      const heightM = heightNum / 100; // cm → m
      const bmi = (weightNum / (heightM ** 2)).toFixed(1);

      // Convert string age to number if needed
      let ageNum;
      if (typeof profile.account.age === 'string') {
        const match = profile.account.age.match(/\d+/g);
        ageNum = match ? parseInt(match[0], 10) : 25; // fallback
      } else {
        ageNum = profile.account.age;
      }

      // Calculate BMR
      let bmr;
      if (profile.gender === 'male') {
        bmr = 88.362 + (13.397 * profile.account.weight) + (4.799 * profile.account.height) - (5.677 * ageNum);
      } else {
        bmr = 447.593 + (9.247 * profile.account.weight) + (3.098 * profile.account.height) - (4.330 * ageNum);
      }
      bmr = bmr.toFixed(0);

      // Create popup profile box
      const popup = document.createElement('div');
      popup.className = 'fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 border border-gray-300 max-w-xs z-50';
      popup.innerHTML = `
        <h2 class="text-lg font-bold mb-2">${profile.account.name}'s Profile</h2>
        <p><strong>Height:</strong> ${profile.account.height} cm</p>
        <p><strong>Weight:</strong> ${profile.account.weight} kg</p>
        <p><strong>BMI:</strong> ${bmi}</p>
        <p><strong>BMR:</strong> ${bmr} kcal/day</p>
        <button id="closeProfile" class="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Close</button>
      `;
      document.body.appendChild(popup);

      // Close button functionality
      document.getElementById('closeProfile').addEventListener('click', () => {
        popup.remove();
      });

      // Render food cards
      data.foods.forEach(item => {
        const card = document.createElement('div');
        card.className = 'flex flex-col items-center justify-center bg-white p-2 rounded shadow text-left';

        card.innerHTML = `
        <h3 class="text-xl font-bold mb-1">${item.foodname}</h3>
          <img src="${item.photo}" class="w-[50%] h-[50%]" alt="Image of ${item.foodname} not available">
          <p class="text-sm text-gray-700 mb-1"><strong>Nutrition:</strong></p>
          <p class="text-sm text-gray-700 mb-1">Calorie: ${item.nutritioninfo.calories}</p>
          <p class="text-sm text-gray-700 mb-1">Carb: ${item.nutritioninfo.carbs}</p>
          <p class="text-sm text-gray-700 mb-1">Fat: ${item.nutritioninfo.fats}</p>
          <p class="text-sm text-gray-700 mb-1">Protein: ${item.nutritioninfo.proteins}</p>
          <p class="text-sm text-gray-700 mb-1"><strong>Dietary:</strong> ${item.dietaryrestriction}</p>
        <p class="text-sm text-gray-600 italic">${item.additionnote}</p>
      `;
        container.appendChild(card);
      });

    }
    else {
      data.foods.forEach(item => {
        const card = document.createElement('div');
        card.className = 'flex flex-col items-center justify-center bg-white p-4 rounded shadow text-left';

        card.innerHTML = `
        <h3 class="text-xl font-bold mb-1">${item.foodname}</h3>
        <p class="text-sm text-gray-500 italic mb-1">Login to view nutrition and dietary info.</p>
        <p class="text-sm text-gray-600 italic">${item.additionnote}</p>`;
        container.appendChild(card);
      });

    };

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
        body: JSON.stringify({ name: uVal, password: pVal, role: 'user', gender: gVal, age: aVal, weight: wVal, height: hVal }),
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
        localStorage.setItem('userId', data.account.id);
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