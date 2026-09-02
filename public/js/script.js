// jss/script.js - FINAL FIXED VERSION

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ script.js loaded.");

    // 1. Find Elements
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtn = document.querySelector('.close-btn');

    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const customerTab = document.getElementById('customerTab');
    const vendorTab = document.getElementById('vendorTab');

    const customerLoginFields = document.getElementById('customerLoginFields');
    const vendorLoginFields = document.getElementById('vendorLoginFields');
    const customerRegisterFields = document.getElementById('customerRegisterFields');
    const vendorRegisterFields = document.getElementById('vendorRegisterFields');

    // --- Helper: Toggle Required Attributes (THIS FIXES YOUR ERROR) ---
    function toggleRequired(container, isRequired) {
        if (!container) return;
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            if (isRequired) {
                input.setAttribute('required', '');
            } else {
                input.removeAttribute('required');
            }
        });
    }

    // --- Modal Logic ---
    const openModal = () => {
        if (authModal) authModal.style.display = 'flex';
    };
    const closeModal = () => {
        if (authModal) authModal.style.display = 'none';
    };

    if (loginBtn && registerBtn && closeBtn && authModal) {
        loginBtn.onclick = () => {
            if (loginForm && registerForm) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            }
            openModal();
        };
        registerBtn.onclick = () => {
            if (loginForm && registerForm) {
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            }
            openModal();
        };

        closeBtn.onclick = closeModal;
        window.onclick = (event) => {
            if (event.target == authModal) closeModal();
        };
    }

    // --- Switch between Login and Register ---
    if (showRegisterLink && showLoginLink && loginForm && registerForm) {
        showRegisterLink.onclick = (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        };

        showLoginLink.onclick = (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        };
    }

    // --- Tab Switching Logic ---
    if (customerTab && vendorTab) {

        // Switch to Student
        customerTab.onclick = (e) => {
            e.preventDefault();
            customerTab.classList.add('active');
            vendorTab.classList.remove('active');

            customerLoginFields.classList.remove('hidden');
            customerRegisterFields.classList.remove('hidden');

            vendorLoginFields.classList.add('hidden');
            vendorRegisterFields.classList.add('hidden');

            // ENABLE Student Validation / DISABLE Vendor Validation
            toggleRequired(customerLoginFields, true);
            toggleRequired(customerRegisterFields, true);
            toggleRequired(vendorLoginFields, false);
            toggleRequired(vendorRegisterFields, false);
        };

        // Switch to Vendor
        vendorTab.onclick = (e) => {
            e.preventDefault();
            vendorTab.classList.add('active');
            customerTab.classList.remove('active');

            vendorLoginFields.classList.remove('hidden');
            vendorRegisterFields.classList.remove('hidden');

            customerLoginFields.classList.add('hidden');
            customerRegisterFields.classList.add('hidden');

            // ENABLE Vendor Validation / DISABLE Student Validation
            toggleRequired(vendorLoginFields, true);
            toggleRequired(vendorRegisterFields, true);
            toggleRequired(customerLoginFields, false);
            toggleRequired(customerRegisterFields, false);
        };

        // Initialize Default State (Student Active)
        toggleRequired(vendorLoginFields, false);
        toggleRequired(vendorRegisterFields, false);
    }
});