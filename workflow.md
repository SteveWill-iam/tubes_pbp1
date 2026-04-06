# Workflow — Self-Service Kiosk System

## 1. Overview
Workflow ini menjelaskan alur interaksi user (customer & admin) dari awal sampai akhir sistem.

---

## 2. Customer Workflow

### Step 1: Entry (Homepage)
- User memilih:
  - Dine In
  - Takeaway
- Sistem menyimpan `order_type`
- Navigasi ke `/menu`

---

### Step 2: Menu Browsing
- User melihat daftar produk
- User dapat:
  - Tambah ke cart
  - Lihat detail (opsional)
- Navigasi ke `/cart`

---

### Step 3: Cart Management
- User melihat item dalam cart
- User dapat:
  - Ubah quantity
  - Hapus item
- Sistem menghitung total harga
- Navigasi ke `/checkout`

---

### Step 4: Checkout
- Menampilkan ringkasan pesanan
- Menampilkan order type
- User klik "Bayar"
- Navigasi ke `/payment`

---

### Step 5: Payment (Dummy QRIS)
- Sistem menampilkan QRIS dummy
- Delay 2 detik
- Backend dipanggil untuk membuat order:
  - generate queue_number
  - simpan order
  - simpan order_items
- Navigasi ke `/receipt`

---

### Step 6: Receipt
- Menampilkan:
  - Nomor antrian
  - Detail pesanan
  - Total harga
- User dapat:
  - Print
  - Kembali ke homepage
- Sistem reset cart & state

---

## 3. Admin Workflow

### Step 1: Login
- Admin klik "Login as Admin"
- Navigasi ke `/login`
- Input username & password
- Backend validasi
- Jika sukses:
  - JWT disimpan
  - Navigasi ke `/admin`

---

### Step 2: Dashboard (Default)
- Menampilkan:
  - Order list
  - Statistik harian
- Auto refresh setiap 5 detik
- Highlight order baru (< 1 menit)

---

### Step 3: Order Management
- Admin melihat daftar order
- Admin dapat:
  - Mengubah status ke `completed`

---

### Step 4: Product Management
- Navigasi ke `/admin/products`
- Admin dapat:
  - Tambah produk
  - Edit produk
  - Hapus produk

---

### Step 5: Statistik
- Ditampilkan di dashboard atau halaman terpisah
- Data:
  - Total order
  - Total revenue
  - Order hari ini
  - Revenue hari ini

---

## 4. System Behaviors

### Auto Refresh
- Polling setiap 5 detik untuk order list

### Highlight Order Baru
- Order dengan `created_at < 1 menit` diberi highlight

### Queue Number
- Increment berdasarkan hari
- Reset setiap hari

---

## 5. Error Handling
- Cart kosong tidak bisa checkout
- Endpoint dilindungi untuk admin
- Error ditangani oleh middleware

---

## 6. Notes
- Tidak ada data customer disimpan
- Sistem berbasis kiosk (bukan user account)
- Fokus pada simplicity dan flow linear
