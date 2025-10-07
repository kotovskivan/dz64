// public/js/auth-example.js
async function sendJSON(path, payload) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload || {})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || ("HTTP " + res.status));
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const checkBtn = document.getElementById('check-passport');

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(loginForm);
    try {
      const out = await sendJSON('/auth/login', { email: form.get('email'), password: form.get('password') });
      alert(out.message || 'OK');
    } catch (err) {
      alert(err.message);
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(registerForm);
    try {
      const out = await sendJSON('/auth/register', { email: form.get('email'), password: form.get('password') });
      alert(out.message || 'OK');
    } catch (err) {
      alert(err.message);
    }
  });

  checkBtn?.addEventListener('click', async () => {
    try {
      const res = await fetch('/protected_passport', { credentials: 'same-origin' });
      const data = await res.json();
      alert(JSON.stringify(data));
    } catch (e) {
      alert('Помилка перевірки доступу');
    }
  });
});
