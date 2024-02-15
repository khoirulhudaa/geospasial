const capitalizeEveryWord = (inputString: string) => {
    // Memisahkan teks menjadi array kata
    const words = inputString.split(' ');

    // Mengonversi huruf pertama dari kata pertama menjadi kapital
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

    // Mengonversi seluruh huruf dari kata-kata berikutnya menjadi huruf kecil
    for (let i = 1; i < words.length; i++) {
        words[i] = words[i].toLowerCase();
    }

    // Menggabungkan kembali array kata menjadi string
    const resultString = words.join(' ');

    return resultString;
}

export default capitalizeEveryWord