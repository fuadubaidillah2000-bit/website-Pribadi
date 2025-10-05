// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const photoInput = document.getElementById('photo');
  const photoPreview = document.getElementById('photoPreview');
  const result = document.getElementById('result');

  // Photo preview
  photoInput.addEventListener('change', () => {
    photoPreview.innerHTML = '';
    const file = photoInput.files[0];
    if (!file) {
      photoPreview.innerHTML = '<span>Tidak ada foto</span>';
      photoPreview.setAttribute('aria-hidden', 'true');
      return;
    }

    if (!file.type.startsWith('image/')) {
      photoPreview.innerHTML = '<span>File bukan gambar</span>';
      return;
    }

    const img = document.createElement('img');
    img.style.maxWidth = '100%';
    img.style.maxHeight = '180px';
    img.style.objectFit = 'cover';
    img.alt = 'Preview foto';
    photoPreview.setAttribute('aria-hidden', 'false');

    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      photoPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  // Custom validation helpers
  function validateNIM(nim) {
    // contoh aturan: hanya angka, panjang 6-12
    return /^\d{6,12}$/.test(nim);
  }

  function showError(input, message) {
    // hapus error lama
    let next = input.nextElementSibling;
    if (next && next.classList.contains('error')) next.remove();

    const el = document.createElement('small');
    el.className = 'error';
    el.textContent = message;
    input.insertAdjacentElement('afterend', el);
  }

  function clearErrors(formEl) {
    formEl.querySelectorAll('.error').forEach(e => e.remove());
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    clearErrors(form);

    const data = new FormData(form);
    const fullname = data.get('fullname').trim();
    const nim = data.get('nim').trim();
    const email = data.get('email').trim();
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const faculty = data.get('faculty');
    const terms = data.get('terms');

    let isValid = true;

    if (!fullname) {
      showError(document.getElementById('fullname'), 'Nama lengkap wajib diisi.');
      isValid = false;
    }

    if (!nim || !validateNIM(nim)) {
      showError(document.getElementById('nim'), 'NIM harus berupa angka (6-12 digit).');
      isValid = false;
    }

    if (!email) {
      showError(document.getElementById('email'), 'Email wajib diisi.');
      isValid = false;
    } else {
      // simple email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError(document.getElementById('email'), 'Format email tidak valid.');
        isValid = false;
      }
    }

    if (!faculty) {
      showError(document.getElementById('faculty'), 'Pilih fakultas.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      showError(document.getElementById('password'), 'Password minimal 6 karakter.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showError(document.getElementById('confirmPassword'), 'Password tidak cocok.');
      isValid = false;
    }

    if (!terms) {
      showError(document.getElementById('terms'), 'Anda harus menyetujui syarat & ketentuan.');
      isValid = false;
    }

    if (!isValid) {
      result.innerHTML = '<strong style="color:#b91c1c">Form belum valid — periksa kembali field yang diberi tanda.</strong>';
      return;
    }

    // Jika valid: build object untuk ditampilkan / dikirim
    const formObject = {
      fullname,
      nim,
      email,
      phone: data.get('phone') || '',
      birthdate: data.get('birthdate') || '',
      gender: data.get('gender') || '',
      address: data.get('address') || '',
      faculty,
      major: data.get('major') || ''
      // jangan simpan password di localStorage pada aplikasi nyata; disini hanya simulasi
    };

    // Simulasi "kirim" — di sini kita menyimpan ke localStorage (opsional)
    try {
      const saved = JSON.parse(localStorage.getItem('pendaftaranMahasiswa') || '[]');
      saved.push({ ...formObject, timestamp: new Date().toISOString() });
      localStorage.setItem('pendaftaranMahasiswa', JSON.stringify(saved));
    } catch (err) {
      console.warn('Gagal menyimpan ke localStorage:', err);
    }

    // Tampilkan ringkasan
    result.innerHTML = renderSummary(formObject);
    form.reset();
    photoPreview.innerHTML = '<span>Tidak ada foto</span>';
  });

  // Reset handler: clear preview & errors & result
  document.getElementById('resetBtn').addEventListener('click', () => {
    clearErrors(form);
    photoPreview.innerHTML = '<span>Tidak ada foto</span>';
    result.innerHTML = '';
  });

  function renderSummary(obj) {
    return `
      <h3>Pendaftaran Berhasil (Simulasi)</h3>
      <p>Data tersimpan secara lokal (localStorage). Berikut ringkasan:</p>
      <ul>
        <li><strong>Nama:</strong> ${escapeHtml(obj.fullname)}</li>
        <li><strong>NIM:</strong> ${escapeHtml(obj.nim)}</li>
        <li><strong>Email:</strong> ${escapeHtml(obj.email)}</li>
        <li><strong>Telepon:</strong> ${escapeHtml(obj.phone)}</li>
        <li><strong>Tanggal Lahir:</strong> ${escapeHtml(obj.birthdate)}</li>
        <li><strong>Jenis Kelamin:</strong> ${escapeHtml(obj.gender)}</li>
        <li><strong>Fakultas:</strong> ${escapeHtml(obj.faculty)}</li>
        <li><strong>Jurusan:</strong> ${escapeHtml(obj.major)}</li>
        <li><strong>Alamat (ringkas):</strong> ${escapeHtml(obj.address)}</li>
      </ul>
      <p style="font-size:0.9rem;color:var(--muted)">Catatan: ini hanya simulasi. Untuk produksi, kirim data ke server dengan HTTPS dan simpan password secara aman (hash + salt).</p>
    `;
  }

  // simple html escape
  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
