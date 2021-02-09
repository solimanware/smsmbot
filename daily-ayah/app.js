async function getRandomAyah() {
    let data = await fetch(`http://api.alquran.cloud/v1/ayah/${getNumberBetween(1,6236)}`)
    let json = await data.json();
    return json?.data;
}

async function displayAyah(){
let ayah = await getRandomAyah();
document.getElementById('ayah').innerText = ayah?.text;
document.getElementById('surahname').innerText = ayah?.surah?.name;
document.getElementById('surahnumber').innerText = (ayah?.numberInSurah).toString().EntoAr();

}

displayAyah();


function getNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//English to Arabic digits.
String.prototype.EntoAr= function() {
    return this.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
  }