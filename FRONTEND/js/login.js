// Variables globales
let recoveryToken = '';
let recoveryEmail = '';
let passwordStrength = "";

// Función para validar fortaleza de contraseña
function checkPasswordStrength(val) {
  const alphabet = /[a-zA-Z]/;
  const numbers = /[0-9]/;
  const scharacters = /[!,@,#,$,%,^,&,*,?,_,(,),-,+,=,~]/;
  
  if (val.match(alphabet) && val.match(numbers) && val.match(scharacters) && val.length >= 8) {
    return "strong";
  } else if (val.match(alphabet) && val.match(numbers) && val.length >= 6) {
    return "medium";
  } else if (val.match(alphabet) || val.match(numbers) || val.match(scharacters)) {
    return "weak";
  }
  return "";
}

// Actualiza la UI de la fortaleza de la contraseña
function updatePasswordStrengthUI(input, strength) {
  const label = input.closest('label');
  const showHide = label.querySelector('.show_hide');
  const indicator = label.nextElementSibling?.querySelector('.indicator');
  const text = label.nextElementSibling?.querySelector('.text');
  const errorIcon = label.nextElementSibling?.querySelector('.error_icon');

  input.classList.remove('password-weak', 'password-medium', 'password-strong');
  if (showHide) showHide.classList.remove('password-weak', 'password-medium', 'password-strong');
  if (indicator) indicator.classList.remove('password-weak', 'password-medium', 'password-strong');
  if (text) text.classList.remove('password-weak', 'password-medium', 'password-strong');
  if (errorIcon) errorIcon.classList.remove('password-weak', 'password-medium', 'password-strong');

  if (strength === "weak") {
    text.textContent = "Contraseña débil: usa letras, números y al menos 6 caracteres.";
    input.classList.add('password-weak');
    showHide?.classList.add('password-weak');
    indicator?.classList.add('password-weak');
    text?.classList.add('password-weak');
    errorIcon?.classList.add('password-weak');
  } else if (strength === "medium") {
    text.textContent = "Contraseña aceptable.";
    input.classList.add('password-medium');
    showHide?.classList.add('password-medium');
    indicator?.classList.add('password-medium');
    text?.classList.add('password-medium');
    errorIcon?.classList.add('password-medium');
  } else if (strength === "strong") {
    text.textContent = "Contraseña fuerte.";
    input.classList.add('password-strong');
    showHide?.classList.add('password-strong');
    indicator?.classList.add('password-strong');
    text?.classList.add('password-strong');
    errorIcon?.classList.add('password-strong');
  }
}

// Mostrar mensajes en el modal
function showRecoveryMessage(message, isError = true) {
  const messageElement = document.getElementById('recovery-message');
  messageElement.textContent = message;
  messageElement.style.color = isError ? '#FF6333' : '#22C32A';
  messageElement.style.display = 'block';

  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}

// Configuración del modal de recuperación
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('password-recovery-modal');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const closeModalBtn = document.querySelector('.close-modal');
  const sendCodeBtn = document.getElementById('send-code-btn');
  const verifyCodeBtn = document.getElementById('verify-code-btn');
  const resendCodeLink = document.getElementById('resend-code');
  const updatePasswordBtn = document.getElementById('update-password-btn');

  forgotPasswordLink?.addEventListener('click', e => {
    e.preventDefault();
    modal.style.display = 'flex';
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('recovery-message').style.display = 'none';
  });

  closeModalBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal?.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Enviar código de recuperación
  sendCodeBtn?.addEventListener('click', async () => {
    const email = document.getElementById('recovery-email').value.trim().toLowerCase();
    if (!email) return showRecoveryMessage("Por favor ingresa tu correo electrónico");

    recoveryEmail = email;

    try {
      const response = await fetch('/api/usuarios/send-recovery-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
        showRecoveryMessage(result.message || "Código enviado correctamente", false);
      } else {
        showRecoveryMessage(result.error || "Error al enviar el código.");
      }
    } catch (err) {
      console.error(err);
      showRecoveryMessage("Error de red al enviar código.");
    }
  });

  // Verificar código
  verifyCodeBtn?.addEventListener('click', async () => {
    const code = document.getElementById('verification-code').value.trim();
    if (!code) return showRecoveryMessage("Por favor ingresa el código de verificación");

    try {
      const response = await fetch('/api/usuarios/verify-recovery-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail, code })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        recoveryToken = result.token;
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
        showRecoveryMessage(result.message || "Código verificado", false);
      } else {
        showRecoveryMessage(result.error || "Código incorrecto");
      }
    } catch (err) {
      console.error(err);
      showRecoveryMessage("Error al verificar el código");
    }
  });

  // Reenviar código
  resendCodeLink?.addEventListener('click', async e => {
    e.preventDefault();
    if (!recoveryEmail) return showRecoveryMessage("Correo no definido");

    try {
      const response = await fetch('/api/usuarios/send-recovery-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showRecoveryMessage(result.message || "Código reenviado correctamente", false);
      } else {
        showRecoveryMessage(result.error || "Error al reenviar el código.");
      }
    } catch (err) {
      console.error(err);
      showRecoveryMessage("Error de red al reenviar código");
    }
  });

  // Actualizar contraseña
  updatePasswordBtn?.addEventListener('click', async () => {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!newPassword || !confirmPassword) return showRecoveryMessage("Por favor completa ambos campos");
    if (newPassword !== confirmPassword) return showRecoveryMessage("Las contraseñas no coinciden");
    if (passwordStrength === "weak" || passwordStrength === "") return showRecoveryMessage("La contraseña es débil");

    try {
      const response = await fetch('/api/usuarios/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail, newPassword, token: recoveryToken })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showRecoveryMessage("Contraseña actualizada correctamente", false);
        setTimeout(() => { modal.style.display = 'none'; }, 3000);
      } else {
        showRecoveryMessage(result.error || "Error al actualizar contraseña");
      }
    } catch (err) {
      console.error(err);
      showRecoveryMessage("Error de red al actualizar contraseña");
    }
  });

  // Mostrar/ocultar contraseña
  document.querySelectorAll('.show_hide').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.classList.replace('bx-hide', 'bx-show');
      } else {
        input.type = 'password';
        btn.classList.replace('bx-show', 'bx-hide');
      }
    });
  });

  // Validación de fortaleza de contraseña
  const passwordInputs = [
    document.getElementById('password'),
    document.getElementById('new-password')
  ].filter(Boolean);

  passwordInputs.forEach(input => {
    input.addEventListener('keyup', () => {
      const val = input.value;
      const strength = checkPasswordStrength(val);
      passwordStrength = strength;

      const indicator = input.closest('label')?.nextElementSibling?.querySelector('.indicator');
      if (indicator) {
        indicator.classList.add('active');
      }

      updatePasswordStrengthUI(input, strength);
    });
  });


  // Botones de login y registro
  const btnSingIn = document.getElementById("sing-in");
  const btnSingUp = document.getElementById("sing-up");
  const formRegister = document.querySelector(".register");
  const formLogin = document.querySelector(".login");

  btnSingIn?.addEventListener("click", () => {
    formRegister.classList.add("hide");
    formLogin.classList.remove("hide");
  });

  btnSingUp?.addEventListener("click", () => {
    formLogin.classList.add("hide");
    formRegister.classList.remove("hide");
  });

  if (window.location.hash === "#register") {
    formLogin.classList.add("hide");
    formRegister.classList.remove("hide");
  } else {
    formRegister.classList.add("hide");
    formLogin.classList.remove("hide");
  }

  // Mostrar mensaje de error si está presente
  const loginError = sessionStorage.getItem("loginError");
  if (loginError) {
    const errorDiv = document.getElementById("login-error-message");
    errorDiv.textContent = loginError;
    errorDiv.style.display = "block";
    sessionStorage.removeItem("loginError");
  }

});
