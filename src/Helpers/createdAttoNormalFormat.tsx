const formatIsoDate = (isoDate: any) => {
    const date = new Date(isoDate);

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[date.getUTCDay()]; // Mendapatkan nama hari
    const day = String(date.getUTCDate()).padStart(2, '0'); // Menambahkan 0 di depan jika kurang dari 10
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getUTCFullYear();

    // Mengembalikan format: Hari, tanggal-bulan-tahun
    return `${dayName}, ${day}-${month}-${year}`;
}

export default formatIsoDate
