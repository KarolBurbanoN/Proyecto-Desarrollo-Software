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
