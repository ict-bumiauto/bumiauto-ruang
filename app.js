document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 App.js Loaded...");

    // ============================================================
    // 1. AUTH & SECURITY (SATPAM)
    // ============================================================
    const savedName = localStorage.getItem('currentUser');
    const bookingForm = document.getElementById('bookingForm');

    // Cek: Jika ini halaman form, tapi user belum login -> USIR
    if (bookingForm && !savedName) {
        alert("Akses Ditolak: Anda harus login dulu!");
        window.location.href = '/login';
        return;
    }

    // ============================================================
    // 2. GENERATE OPSI JAM (YANG HILANG TADI)
    // ============================================================
    function populateTimeSelects() {
        const startSelect = document.querySelector('select[name="startTime"]');
        const endSelect = document.querySelector('select[name="endTime"]');

        if (!startSelect || !endSelect) return;

        // Kosongkan dulu biar gak dobel
        startSelect.innerHTML = '<option value="">Select time</option>';
        endSelect.innerHTML = '<option value="">Select time</option>';

        const startHour = 8; // Mulai jam 08:00
        const endHour = 18;  // Sampai jam 18:00

        for (let i = startHour; i <= endHour; i++) {
            // Format jam (misal 8 jadi "08")
            const hour = i.toString().padStart(2, '0');
            
            // Opsi :00
            const time00 = `${hour}:00`;
            startSelect.add(new Option(time00, time00));
            endSelect.add(new Option(time00, time00));

            // Opsi :30 (kecuali jam terakhir)
            if (i < endHour) {
                const time30 = `${hour}:30`;
                startSelect.add(new Option(time30, time30));
                endSelect.add(new Option(time30, time30));
            }
        }
    }

    // Panggil fungsi ini agar dropdown terisi!
    populateTimeSelects();


    // ============================================================
    // 3. AUTO-FILL FORM
    // ============================================================
    if (savedName && bookingForm) {
        // Isi Nama
        const formName = document.getElementById('formBorrowerName');
        if (formName) formName.value = savedName;

        // Isi Divisi
        const savedDivision = localStorage.getItem('userDivision');
        const sbuSelect = document.querySelector('select[name="sbu"]');
        if (sbuSelect && savedDivision) sbuSelect.value = savedDivision;

        // Isi WhatsApp
        const savedPhone = localStorage.getItem('userPhone');
        // Cari input WA (bisa ID 'whatsapp' atau name 'whatsappNumber')
        const waInput = document.getElementById('whatsapp') || document.querySelector('input[name="whatsappNumber"]');
        if (waInput && savedPhone) waInput.value = savedPhone;
    }


    // ============================================================
    // 4. HANDLE SUBMIT FORM
    // ============================================================
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Tahan biar gak refresh
            
            console.log("📨 Mengirim Booking...");

            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "⏳ Sending...";
            submitBtn.disabled = true;

            try {
                // Siapkan Data
                const bookingData = {
                    ticketNumber: 'T-' + Date.now(),
                    borrowerName: document.getElementById('formBorrowerName').value,
                    borrowerEmail: localStorage.getItem('userEmail'), // Email user login
                    department: document.querySelector('select[name="sbu"]').value,
                    whatsapp: document.querySelector('input[name="whatsappNumber"]').value,
                    
                    purpose: document.getElementById('purpose').value,
                    bookingDate: document.getElementById('bookingDate').value,
                    startTime: document.querySelector('select[name="startTime"]').value,
                    endTime: document.querySelector('select[name="endTime"]').value,
                    roomName: document.querySelector('select[name="roomName"]').value,
                    participants: document.getElementById('participants').value,
                    
                    addOns: document.getElementById('addOnsCheck')?.checked ? "Yes" : "No",
                    notes: document.getElementById('notes')?.value || "",
                    status: 'Pending'
                };

                // Kirim
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ Booking Berhasil! Menunggu persetujuan Admin.");
                    window.location.href = '/calendar';
                } else {
                    alert("❌ Gagal: " + result.message);
                }

            } catch (error) {
                console.error("Error:", error);
                alert("⚠️ Error Sistem: " + error.message);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});