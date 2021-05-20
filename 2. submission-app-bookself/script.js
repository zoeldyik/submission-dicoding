const rak_buku = "RAK_BUKU";
let filter_buku = null;

const search_input = document.querySelector("#search");
const container_input_book = document.querySelector("#input-book")
const container_update_book = document.querySelector("#update-book");
const form_input_book = document.querySelector("#form-input-book");
const form_update_book = document.querySelector("#form-update-book");

const card_selesai = document.querySelector("#selesai");
const card_belum_selesai = document.querySelector("#belum-selesai");

const btn_close_modal = document.querySelector("#modal-delete .cancel");
const btn_confirm_hapus = document.querySelector("#modal-delete .hapus");


window.addEventListener("load", render);

search_input.addEventListener('input', search)
form_input_book.addEventListener("submit", addBook);
form_input_book.checkbox.addEventListener('change', change_form_btn_text);

form_update_book.addEventListener('submit', update_book);

btn_close_modal.addEventListener('click', confirm_hapus);
btn_confirm_hapus.addEventListener("click", confirm_hapus)

card_belum_selesai.addEventListener('click', function(e){
    if(e.target.className.includes('hapus')){
        const id = e.target.dataset.id;
        hapus(id);
    }
  
    if(e.target.className.includes('status')){
        const id = e.target.dataset.id;
        pindah_rak(id);
    }
    
    if(e.target.className.includes('update')){
        const id = e.target.dataset.id;
        open_update_form(id);
    }

})

card_selesai.addEventListener('click', function(e){
    if(e.target.className.includes('hapus')){
        const id = e.target.dataset.id;
        hapus(id);
    }

    if(e.target.className.includes('status')){
        const id = e.target.dataset.id;
        pindah_rak(id);
    }

    if(e.target.className.includes('update')){
        const id = e.target.dataset.id;
        open_update_form(id);
    }
})

container_update_book.addEventListener('click', function(e){
    if(e.target.className.includes('cancel-update')){
        this.setAttribute('hidden', true);
        container_input_book.removeAttribute('hidden')
    }
})




function addBook(e){
    e.preventDefault();

    const id = Date.now();
    const title = form_input_book.judul.value;
    const author = form_input_book.penulis.value;
    const year = form_input_book.tahun.value;
    const isComplete = form_input_book.checkbox.checked;
    const submit_btn = document.querySelector("form button span");

    const new_book = {id, title, author, year, isComplete};
    
    addToStorage(new_book);
    form_input_book.reset();
    submit_btn.textContent = "belum selesai dibaca";
    reset_search();
    render();
}


function addToStorage(new_book){
    // // cek if rak is empty
    if(window.localStorage.getItem(rak_buku) === null){
        window.localStorage.setItem(rak_buku, JSON.stringify([new_book]));
    }else{
        const books = JSON.parse(window.localStorage.getItem(rak_buku));
        window.localStorage.setItem(rak_buku, JSON.stringify([...books, new_book]));
    }
}


function change_form_btn_text(){
    const submit_btn = document.querySelector("form button span");
    if(this.checked){
        submit_btn.textContent = "selesai dibaca";
    }else{
        submit_btn.textContent = "belum selesai dibaca";
    }
}


function render(){
    const semua_buku = JSON.parse(window.localStorage.getItem(rak_buku)) || [];
    let belum_selesai = semua_buku.filter(buku=> buku.isComplete === false);
    let selesai = semua_buku.filter(buku=> buku.isComplete);
    

    if(filter_buku){
        belum_selesai = filter_buku.filter(buku=> buku.isComplete === false);
        selesai = filter_buku.filter(buku=> buku.isComplete);
    }

    render_buku_belum_selesai(belum_selesai);
    render_buku_selesai(selesai);
}


function render_buku_belum_selesai(books){
    const tBody = document.querySelector('#belum-selesai table tbody');

    if(!books.length){
        tBody.innerHTML =  "<tr class='text-center'><td colspan='5'>tidak ada buku</td></tr>";
    }

    if(books.length){
        tBody.innerHTML = "";
        books.forEach((buku, idx)=>{
            const row = tBody.insertRow();
            row.insertCell(0).textContent = idx+1;
            row.insertCell(1).textContent = buku.title;
            row.insertCell(2).textContent = buku.author;
            row.insertCell(3).textContent = buku.year;
            row.insertCell(4).innerHTML = `
                                            <button class="btn btn-sm btn-success status" data-id="${buku.id}">selesai</button>
                                            <button class="btn btn-sm btn-primary update" data-id="${buku.id}">update</button>
                                            <button class="btn btn-sm btn-dark hapus" data-id="${buku.id}">hapus</button>
                                          `;
        })
    }
}


function render_buku_selesai(books){
    const tBody = document.querySelector('#selesai table tbody');

    if(!books.length){
        tBody.innerHTML =  "<tr class='text-center'><td colspan='5'>tidak ada buku</td></tr>";
    }

    if(books.length){
        tBody.innerHTML = "";
        books.forEach((buku, idx)=>{
            const row = tBody.insertRow();
            row.insertCell(0).textContent = idx+1;
            row.insertCell(1).textContent = buku.title;
            row.insertCell(2).textContent = buku.author;
            row.insertCell(3).textContent = buku.year;
            row.insertCell(4).innerHTML = `
                                            <button class="btn btn-sm btn-success status" data-id="${buku.id}">belum selesai</button>
                                            <button class="btn btn-sm btn-primary update" data-id="${buku.id}">update</button>
                                            <button class="btn btn-sm btn-dark hapus" data-id="${buku.id}">hapus</button>
                                          `;
        })
    }
}


function hapus(id){
    let books = JSON.parse(window.localStorage.getItem(rak_buku));
    const idx = books.findIndex(book=> book.id == id);

    // open modal
    document.getElementById("modal-delete").classList.add('d-block');
    document.querySelector("#modal-delete .modal-body p").innerHTML = `hapus buku dengan judul <b>${books[idx].title.toLowerCase()}</b> ?`;

    books.splice(idx, 1);
    window.localStorage.setItem("TEMP_HAPUS", JSON.stringify(books));
}


function confirm_hapus(e){
    document.getElementById("modal-delete").classList.remove('d-block');
    
    if(e.target.className.includes('hapus')){
        
        const list_buku = JSON.parse(window.localStorage.getItem("TEMP_HAPUS"));
        window.localStorage.setItem(rak_buku,JSON.stringify(list_buku));
        window.localStorage.removeItem("TEMP_HAPUS");
        search();
        render();

    }else{
        window.localStorage.removeItem("TEMP_HAPUS");
        return false;
    }
}


function pindah_rak(id){
    let list_buku = JSON.parse(window.localStorage.getItem(rak_buku));
    const idx = list_buku.findIndex(book=> book.id == id);
    
    // rubah nilai property isComplete
    list_buku[idx].isComplete = !list_buku[idx].isComplete;
    
    window.localStorage.setItem(rak_buku, JSON.stringify(list_buku));
    search();
    render();
}


function open_update_form(id){
    container_input_book.setAttribute("hidden",true);
    container_update_book.removeAttribute('hidden');

    const list_buku = JSON.parse(window.localStorage.getItem(rak_buku)) || [];
    const buku = list_buku.filter(b=> b.id == id)[0];

    const form = document.querySelector("#form-update-book");
    form.id.value = buku.id;
    form.judul.value = buku.title;
    form.penulis.value = buku.author;
    form.tahun.value = buku.year;
    form.checkbox.checked = buku.isComplete ? true : false;
}


function update_book(e){
    e.preventDefault();
    const form = document.querySelector("#form-update-book");
    const id = form.id.value;
    const title = form.judul.value;
    const author = form.penulis.value;
    const year = form.tahun.value;
    const isComplete = form.checkbox.checked;

    const updated_book = {id, title, author, year, isComplete};
    const list_buku = JSON.parse(window.localStorage.getItem(rak_buku)) || [];
    const idx = list_buku.findIndex(buku=> buku.id == id);
    
    list_buku.splice(idx, 1, updated_book);
    window.localStorage.setItem(rak_buku, JSON.stringify(list_buku));

    container_input_book.removeAttribute("hidden");
    container_update_book.setAttribute('hidden', true);

    search();
    render();
}


function search(){
    const teks = search_input.value;
    const list_buku = JSON.parse(window.localStorage.getItem(rak_buku)) || [];

    if(!teks.length){
       filter_buku = null;
        render()
    }else{
        filter_buku = list_buku.filter(buku=> buku.title.toLowerCase().includes(teks.toLowerCase()));
        render();
    }
}


function reset_search(){
    search_input.value = "";
    filter_buku = null;
}