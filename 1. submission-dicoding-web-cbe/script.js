// hamburger menu
const hamburgerMenu = document.querySelector("header nav .mdi");
const navUl = document.querySelector('header nav ul');

hamburgerMenu.addEventListener('click',()=> navUl.classList.toggle('open-ul'));

// header button
const btn = document.querySelector('.button');
btn.addEventListener('click', function(e){
    e.preventDefault();
        
    const target = e.target.dataset.target;
    const options = {behavior:'smooth', block:"center"};

    if(window.innerWidth < 768){
        options.block = "start"
    }
    document.querySelector(target).scrollIntoView(options);
})


// navigasi
const navs = document.querySelectorAll('header nav ul li a');

function scrollKe(target){
    const el = document.querySelector(target);
    el.scrollIntoView({behavior:'smooth'});
}


navs.forEach(mynav=>{
  mynav.addEventListener('click', function(e){
        e.preventDefault();
        
        const target = e.target.dataset.target;
        const options = {behavior:'smooth', block:"center"};

        if(window.innerWidth < 768){
            options.block = "start"
        }
        document.querySelector(target).scrollIntoView(options);
    })
})


// aside
const aside = document.querySelector('aside');
const openAside = document.querySelector('.open-aside');
const closeAside = document.querySelector('.close-aside');

openAside.addEventListener("click",()=> aside.classList.add('show-aside'))
closeAside.addEventListener("click",()=> aside.classList.remove('show-aside'))


// track resi
const lacak_button = document.querySelector('.track button');
const form_cek_resi = document.querySelector(".track form");;
const input_resi = form_cek_resi.querySelector("input");
const alert_cek_resi = document.querySelector('.alert-cek-resi');

// card for detail resi
const card_resi = document.querySelector('.track .card');
const resi_el = document.querySelector('.track .no-resi');
const kota_tujuan_el = document.querySelector('.track .kota-tujuan');
const penerima_el = document.querySelector('.track .penerima');

const status_el = document.querySelector('.track .status .title');
const tanggal_el = document.querySelector('.track .status .tanggal');
const keterangan_el = document.querySelector('.track .status .keterangan');

form_cek_resi.addEventListener('submit',async function(e){
    try {
        e.preventDefault();

        // set loading animasi for button
        lacak_button.innerHTML = `<span class="mdi mdi-loading mdi-spin mdi-18px"></span> TUNGGU`

        const api_url = "https://tastestos-api.netlify.app/.netlify/functions/server/";
        let resi = input_resi.value.trim();
        if(!resi.length){
            lacak_button.innerHTML = `LACAK`
            alert_cek_resi.textContent = "resi tidak boleh kosong"
            return alert_cek_resi.classList.remove('hidden');
        }

        const response = await fetch(`${api_url}${resi}`);
        const json = await response.json();
        
        if(json.statusCode !== 200){
            if(!card_resi.classList.contains('hidden')){
                card_resi.classList.add('hidden')
            }

            lacak_button.innerHTML = `LACAK`
            alert_cek_resi.textContent = "resi yang kamu masukan salah"
            return alert_cek_resi.classList.remove('hidden');
        }
        
        if(!alert_cek_resi.classList.contains('hidden')){
            alert_cek_resi.classList.add('hidden');
        }

        card_resi.classList.remove('hidden')
        // kembalikan button
        lacak_button.innerHTML = `LACAK`
        // tampilkan respon data
        console.log(json)
        resi_el.textContent = json.data.waybill.waybill_number;
        kota_tujuan_el.textContent = json.data.waybill.receiver_city;
        penerima_el.textContent = json.data.waybill.receiver_name;

        status_el.textContent = json.data.delivery_status.status;
        tanggal_el.textContent = json.data.details[json.data.details.length - 1].shipping_date;
        keterangan_el.textContent = json.data.details[json.data.details.length - 1].shipping_description + json.data.details[json.data.details.length - 1].city_name;


    } catch (err) {
        console.log(err);
    }
})



// send email
const alert_contact_form = document.querySelector('.alert-contact-form');
const contact_form = document.querySelector('.contact-form form');
const nama_input = document.querySelector('.contact-form #nama');
const email_input = document.querySelector('.contact-form #email');
const pesan_input = document.querySelector('.contact-form #pesan');
const contact_button = document.querySelector('.contact-form button');

contact_form.addEventListener('submit', async function(e){
    e.preventDefault();
    const form_submit_url = "https://formsubmit.co/ajax/kutu.melompat@gmail.com";

    let nama = nama_input.value.trim();
    let email = email_input.value.trim();
    let pesan = pesan_input.value.trim();

    if(!nama.length || !email.length || !pesan.length){
        alert_contact_form.innerHTML = '<p>Field tidak boleh kosong</p>';
        return alert_contact_form.classList.remove('hidden')
    }
    const data = {
        name: `${nama} {${email}}`,
        message: pesan
    }

    try {

        if(!alert_contact_form.classList.contains('hidden')){
            alert_contact_form.classList.add('hidden');
        }

        contact_button.innerHTML = `<span class="mdi mdi-loading mdi-spin mdi-18px"></span> MENGIRIM`


        const response = await fetch(form_submit_url,{
            method:"POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        console.log(json);
        contact_button.textContent = "TERKIRIM"
    } catch (err) {
        alert_contact_form.innerHTML = "<p>Gagal mengirim pesan, silahkan coba lagi</p>"
        alert_contact_form.classList.remove('hidden');
    } finally{
        contact_form.reset();
        setTimeout(()=> contact_button.textContent = "KIRIM", 1500)
    }
})

