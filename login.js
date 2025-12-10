document.addEventListener('DOMContentLoaded', function() {
    
    const LOGIN_API_URL = '/api/login'; 

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password'); // Selector baru
    const submitBtn = document.querySelector('.submit-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = emailInput.value.trim().toLowerCase(); 
            const password = passwordInput.value.trim(); // Ambil Password

            if (!email || !password) {
                alert("Mohon lengkapi Email dan Password.");
                return;
            }

            if (!email.endsWith('@hakaauto.co.id')) {
                alert("Akses Ditolak: Wajib menggunakan email kantor (@hakaauto.co.id)!");
                return;
            }

            // --- LOADING STATE ---
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "⏳ Verifying...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            try {
                const response = await fetch(LOGIN_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email: email, 
                        password: password // Kirim Password ke backend
                    }) 
                });

                const result = await response.json();

                if (response.ok) {
                    // === SUKSES ===
                    localStorage.setItem('currentUser', result.user.name);
                    localStorage.setItem('userEmail', result.user.email);
                    localStorage.setItem('userRole', result.user.role);
                    localStorage.setItem('userDivision', result.user.division || ''); 

                    if (result.user.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }

                } else {
                    // === GAGAL ===
                    alert("❌ Login Gagal: " + result.message);
                }

            } catch (error) {
                console.error(error);
                alert("⚠️ Terjadi kesalahan koneksi.");
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }
});