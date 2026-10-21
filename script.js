/* ==================== DATA MENU KAFE (DATABASE LOKAL) ==================== */
const menuData = [
    {
        id: 1,
        name: "Kopi Susu Gula Aren",
        category: "minuman",
        price: 18000,
        description: "Espresso dipadu dengan fresh milk dan manisnya gula aren asli.",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "Matcha Latte Creamy",
        category: "minuman",
        price: 22000,
        description: "Minuman teh hijau Jepang pilihan dengan susu segar yang lembut.",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        name: "Nasi Goreng Spesial",
        category: "makanan",
        price: 25000,
        description: "Nasi goreng gurih dengan suwiran ayam, telur mata sapi, dan kerupuk.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "Chicken Katsu Donburi",
        category: "makanan",
        price: 28000,
        description: "Nasi putih hangat dengan ayam katsu renyah dan saus khas Jepang.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        name: "French Fries Crispy",
        category: "camilan",
        price: 15000,
        description: "Kentang goreng renyah disajikan dengan saus sambal dan mayones.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        name: "Roti Bakar Keju Cokelat",
        category: "camilan",
        price: 16000,
        description: "Roti panggang tebal dengan taburan keju melimpah dan lelehan cokelat.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80"
    }
];

// Array Penyimpan Keranjang Belanja
let cart = [];

/* ==================== ELEMEN DOM HTML ==================== */
const menuGrid = document.getElementById("menu-grid");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartBar = document.getElementById("cart-bar");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartModal = document.getElementById("cart-modal");
const cartItemsList = document.getElementById("cart-items-list");

/* ==================== FUNGSIONALITAS APLIKASI ==================== */

// Format angka ke mata uang Rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// Deteksi otomatis Nomor Meja dari URL parameter saat halaman dimuat
// Contoh URL: https://namatoko.github.io/menu/?meja=05
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get("meja");
    const tableInput = document.getElementById("table-input");

    if (tableParam && tableInput) {
        tableInput.value = `Meja ${tableParam}`;
        tableInput.disabled = true; // Kunci input agar tidak diubah pelanggan
    }

    displayMenu(menuData);
});

// Menampilkan kartu menu di layar
function displayMenu(itemsToDisplay) {
    menuGrid.innerHTML = "";

    if (itemsToDisplay.length === 0) {
        menuGrid.innerHTML = `<p style="text-align: center; color: #a4b0be; grid-column: 1 / -1; padding: 20px;">Menu tidak ditemukan.</p>`;
        return;
    }

    itemsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("menu-card");

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-img">
            <div class="menu-details">
                <div>
                    <h3 class="menu-name">${item.name}</h3>
                    <p class="menu-desc">${item.description}</p>
                </div>
                <div class="menu-footer-card">
                    <span class="menu-price">${formatRupiah(item.price)}</span>
                    <button class="btn-add" onclick="addToCart(${item.id})">+ Tambah</button>
                </div>
            </div>
        `;

        menuGrid.appendChild(card);
    });
}

/* ==================== PENCARIAN & FILTER KATEGORI ==================== */
let currentCategory = "semua";
let currentSearchKeyword = "";

function filterAndSearchMenu() {
    let filtered = menuData;

    if (currentCategory !== "semua") {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (currentSearchKeyword.trim() !== "") {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(currentSearchKeyword) ||
            item.description.toLowerCase().includes(currentSearchKeyword)
        );
    }

    displayMenu(filtered);
}

searchInput.addEventListener("input", (e) => {
    currentSearchKeyword = e.target.value.toLowerCase();
    filterAndSearchMenu();
});

categoryButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        currentCategory = e.target.getAttribute("data-category");
        filterAndSearchMenu();
    });
});

/* ==================== LOGIKA KERANJANG & PPN 10% ==================== */
function addToCart(itemId) {
    const product = menuData.find(item => item.id === itemId);
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function updateCartUI() {
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });

    // Perhitungan PPN (10%) & Total Bayar
    let tax = subtotal * 0.10;
    let grandTotal = subtotal + tax;

    // Update Tampilan Floating Cart Bar
    cartCount.innerText = `${totalItems} Item`;
    cartTotal.innerText = formatRupiah(grandTotal);

    // Update Tampilan Rincian di Modal Konfirmasi
    document.getElementById("modal-subtotal").innerText = formatRupiah(subtotal);
    document.getElementById("modal-tax").innerText = formatRupiah(tax);
    document.getElementById("modal-total-price").innerText = formatRupiah(grandTotal);

    if (totalItems > 0) {
        cartBar.classList.remove("hidden");
    } else {
        cartBar.classList.add("hidden");
    }

    renderCartModalItems();
}

function renderCartModalItems() {
    if (cart.length === 0) {
        cartItemsList.innerHTML = `<p class="empty-cart-msg">Keranjang Anda masih kosong.</p>`;
        return;
    }

    cartItemsList.innerHTML = "";
    cart.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f1f2f6; padding-bottom: 8px;";
        
        itemRow.innerHTML = `
            <div>
                <h4 style="font-size: 0.95rem; color: #2f3542;">${item.name}</h4>
                <p style="font-size: 0.8rem; color: #747d8c;">${formatRupiah(item.price)} x ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <button onclick="changeQuantity(${item.id}, -1)" style="padding: 2px 8px; background: #dfe4ea; border: none; border-radius: 4px; cursor: pointer;">-</button>
                <span style="font-size: 0.9rem; font-weight: 600;">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)" style="padding: 2px 8px; background: #dfe4ea; border: none; border-radius: 4px; cursor: pointer;">+</button>
            </div>
        `;
        cartItemsList.appendChild(itemRow);
    });
}

function changeQuantity(itemId, amount) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += amount;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartUI();
}

/* ==================== PEMROSESAN PESANAN & STRUK DIGITAL ==================== */
function toggleCartModal() {
    cartModal.classList.toggle("active");
}

function processOrder() {
    if (cart.length === 0) return;

    const tableInput = document.getElementById("table-input").value || "Meja Umum";
    const receiptDetails = document.getElementById("receipt-details");
    
    let subtotal = 0;
    let now = new Date();
    let timeString = now.toLocaleDateString("id-ID") + " " + now.toLocaleTimeString("id-ID");

    let itemsHtml = `
        <div style="margin-bottom: 6px;">
            <strong>No. Meja :</strong> ${tableInput}<br>
            <strong>Waktu    :</strong> ${timeString}
        </div>
        <div class="receipt-divider">-----------------------------------</div>
    `;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += `
            <div style="display: flex; justify-content: space-between;">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatRupiah(itemTotal)}</span>
            </div>
        `;
    });

    let tax = subtotal * 0.10;
    let grandTotal = subtotal + tax;

    itemsHtml += `
        <div class="receipt-divider">-----------------------------------</div>
        <div style="display: flex; justify-content: space-between;">
            <span>Subtotal</span>
            <span>${formatRupiah(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>PPN (10%)</span>
            <span>${formatRupiah(tax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 4px;">
            <span>TOTAL BAYAR</span>
            <span>${formatRupiah(grandTotal)}</span>
        </div>
        <div class="receipt-divider">-----------------------------------</div>
        <div style="text-align: center; margin-top: 8px;">
            <p>Terima Kasih!</p>
            <small>*Pesanan Anda telah diteruskan ke dapur*</small>
        </div>
    `;

    receiptDetails.innerHTML = itemsHtml;

    // Tutup modal keranjang dan tampilkan struk digital
    toggleCartModal();
    document.getElementById("receipt-modal").classList.add("active");
}

function closeReceipt() {
    document.getElementById("receipt-modal").classList.remove("active");
}

function finishAndReset() {
    cart = [];
    updateCartUI();
    closeReceipt();
}
