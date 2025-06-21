const btnSingIn = document.getElementById("sing-in"),
      btnSingUp = document.getElementById("sing-up"),
      formRegister = document.querySelector(".register"),
      formLogin = document.querySelector(".login");

// Mostrar sección según botón
btnSingIn.addEventListener("click", e => {
    formRegister.classList.add("hide");
    formLogin.classList.remove("hide");
});

btnSingUp.addEventListener("click", e => {
    formLogin.classList.add("hide");
    formRegister.classList.remove("hide");
});

// Mostrar formulario correcto según el hash de la URL
window.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash === "#register") {
        formLogin.classList.add("hide");
        formRegister.classList.remove("hide");
    } else {
        formRegister.classList.add("hide");
        formLogin.classList.remove("hide");
    }
});

document.getElementById("login-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  window.location.href = "FRONTEND/dashboard.html";
});

// Función para manejar mostrar/ocultar contraseña
function setupPasswordToggle(passwordInputId, showHideBtn) {
  const passwordInput = document.getElementById(passwordInputId);

  if (passwordInput && showHideBtn) {
    showHideBtn.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showHideBtn.classList.replace("bx-hide", "bx-show");
      } else {
        passwordInput.type = "password";
        showHideBtn.classList.replace("bx-show", "bx-hide");
      }
    });
  }
}

// Configurar para ambos formularios
const registerShowHide = document.querySelector(".register .show_hide");
const loginShowHide = document.querySelector(".login .show_hide");

setupPasswordToggle("password", registerShowHide); // Formulario de registro
setupPasswordToggle("login-password", loginShowHide); // Formulario de login

// Password Strength Checker (solo para registro)
const registerPasswordInput = document.getElementById("password");
if (registerPasswordInput) {
  const showHide = document.querySelector(".register .show_hide"),
        indicator = document.querySelector(".indicator"),
        iconText = document.querySelector(".icon-text"),
        text = document.querySelector(".text"),
        errorIcon = document.querySelector(".error_icon");

  const alphabet = /[a-zA-Z]/,
        numbers = /[0-9]/,
        scharacters = /[!,@,#,$,%,^,&,*,?,_,(,),-,+,=,~]/;

  registerPasswordInput.addEventListener("keyup", () => {
      indicator.classList.add("active");
      let val = registerPasswordInput.value;
      
      // Resetear clases
      registerPasswordInput.classList.remove("password-weak", "password-medium", "password-strong");
      showHide.classList.remove("password-weak", "password-medium", "password-strong");
      iconText.classList.remove("password-weak", "password-medium", "password-strong");
      errorIcon.classList.remove("password-weak", "password-medium", "password-strong");
      
      if(val.match(alphabet) || val.match(numbers) || val.match(scharacters)){
          text.textContent = "Contraseña débil";
          registerPasswordInput.classList.add("password-weak");
          showHide.classList.add("password-weak");
          iconText.classList.add("password-weak");
          errorIcon.classList.add("password-weak");
      }
      if(val.match(alphabet) && val.match(numbers) && val.length >= 6){
          text.textContent = "Contraseña aceptable";
          registerPasswordInput.classList.add("password-medium");
          showHide.classList.add("password-medium");
          iconText.classList.add("password-medium");
          errorIcon.classList.add("password-medium");
      }
      if(val.match(alphabet) && val.match(numbers) && val.match(scharacters) && val.length >= 8){
          text.textContent = "Contraseña fuerte";
          registerPasswordInput.classList.add("password-strong");
          showHide.classList.add("password-strong");
          iconText.classList.add("password-strong");
          errorIcon.classList.add("password-strong");
      }
      if(val == ""){
          indicator.classList.remove("active");
          registerPasswordInput.classList.remove("password-weak", "password-medium", "password-strong");
          showHide.classList.remove("password-weak", "password-medium", "password-strong");
          iconText.classList.remove("password-weak", "password-medium", "password-strong");
          errorIcon.classList.remove("password-weak", "password-medium", "password-strong");
      }
  });
}