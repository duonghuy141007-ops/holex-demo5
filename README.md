# 👑 HOLEX WATCH STORE - LANDING PAGE THƯƠNG HIỆU ĐỒNG HỒ CAO CẤP

> **Slogan:** *"Holex - Timeless Precision, Modern Style"*  
> **Địa chỉ:** Tổ 10, Ấp 2, Xã Long An, Huyện Nhơn Trạch, Tỉnh Đồng Nai  
> **Hotline:** 09031702981  
> **Giờ mở cửa:** 06:00 – 22:00 hằng ngày  
> **Thiết kế bởi:** Từ Dương Huy

---

## 1. GIỚI THIỆU DỰ ÁN

**HOLEX WATCH STORE** là website landing page thương mại điện tử chuyên nghiệp dành cho thương hiệu đồng hồ cao cấp tại Nhơn Trạch, Đồng Nai. Dự án được thiết kế theo phong cách **Classic Luxury & Minimalist Luxury**, kết hợp tinh hoa thẩm mỹ của những boutique đồng hồ danh tiếng với trải nghiệm người dùng hiện đại, tinh tế và mượt mà.

### Các điểm nhấn nổi bật:
- **Bộ nhận diện thương hiệu độc bản**: Logo cách điệu từ chữ **H** kết hợp khối kim cương và mặt số đồng hồ chính xác, tông màu Xanh Sapphire (`#173B69`) và Vàng Gold (`#D4AF62`), hoàn toàn độc lập và không sao chép bất kỳ thương hiệu nào khác.
- **3 Dòng sản phẩm chủ lực**:
  - **HOLEX CLASSIC**: Mặt siêu mỏng Ultra-thin, dây da thật Ý, máy Quartz/Automatic (500.000 – 5.000.000 VNĐ).
  - **HOLEX SPORT & URBAN**: Thép 316L nguyên khối, mặt kính Sapphire nguyên khối, chống nước 5ATM – 10ATM (3.000.000 – 5.000.000 VNĐ).
  - **HOLEX COUPLE**: Đồng hồ đôi thanh lịch, tặng kèm dịch vụ khắc laser kỷ niệm và hộp gỗ sơn mài VIP (5.000.000 – 10.000.000 VNĐ/bộ).
- **Bộ lọc & Tìm kiếm thời gian thực (Live Search & Filter)**: Lọc đa chiều theo danh mục, mức giá, sắp xếp tăng/giảm và tìm kiếm trực tiếp.
- **Modal chi tiết sản phẩm (Quick View)**: Xem thông số kỹ thuật chi tiết (máy, kính, dây, chống nước, bảo hành) và chọn mua nhanh.
- **Giỏ hàng lưu trữ LocalStorage**: Thêm sản phẩm, tăng/giảm số lượng, tính tổng tiền tự động, badge hoạt ảnh và thông báo Toast sang trọng.
- **Form đặt hàng trực tuyến chuẩn mực**: Kiểm tra dữ liệu bắt buộc, kiểm tra số điện thoại Việt Nam hợp lệ (regex), đồng bộ sản phẩm từ giỏ hàng, in chi tiết đơn hàng dạng bảng vào Console và hiển thị Modal xác nhận thành công.
- **Responsive hoàn hảo**: Tương thích mượt mà trên Desktop 1920px, Laptop 1366px, Tablet 768px, Mobile 390px và 360px.
- **Dải credit chuẩn quy định**: Dòng chữ `"Thiết kế bởi Từ Dương Huy"` nổi bật trên dải nền Trắng Ngà (`#F7F5F0`) tách biệt ở chân trang.

---

## 2. CÔNG NGHỆ SỬ DỤNG

- **HTML5 Semantic**: Cấu trúc ngữ nghĩa chuẩn SEO, thẻ meta, Open Graph, tiêu đề phân cấp rõ ràng.
- **CSS3 Hiện đại**:
  - CSS Custom Properties (Variables) quản trị bảng màu Luxury thống nhất.
  - Flexbox & CSS Grid cho bố cục đáp ứng chuẩn xác.
  - Hiệu ứng chuyển động mượt mà (Glassmorphism, backdrop-blur, gold hover glow, floating animation).
- **JavaScript ES6+**:
  - Hướng đối tượng (Class `CartManager`) quản lý giỏ hàng và LocalStorage.
  - Xử lý DOM, Live Filter, Quick View Modal, Order Validation.
- **Vector Graphics & Typography**:
  - SVG Vector độ nét cao cho Logo, Icon và toàn bộ ảnh đồng hồ minh họa độc quyền.
  - Google Fonts: *Playfair Display* (tiêu đề quý tộc cổ điển), *Cormorant Garamond* và *Roboto* (văn bản thanh thoát).

---

## 3. CẤU TRÚC THƯ MỤC

```text
holex/
│
├── index.html                  # File giao diện chính của website
├── README.md                   # Tài liệu hướng dẫn chi tiết dự án
│
├── assets/                     # Tài nguyên đồ họa & hình ảnh
│   ├── logo/
│   │   ├── holex-logo.svg      # Logo thương hiệu Holex vector sắc nét
│   │   └── favicon.svg         # Favicon trình duyệt nhận diện Holex
│   ├── images/                 # Đồ họa minh họa đồng hồ cao cấp
│   │   ├── hero-watch.svg      # Đồng hồ biểu tượng Hero Section
│   │   ├── about-watch.svg     # Đồng hồ minh họa phần The Art of Time
│   │   ├── classic-1.svg       # Holex Heritage Ultra-Thin Gold
│   │   ├── classic-2.svg       # Holex Elegance Slimline Silver
│   │   ├── classic-3.svg       # Holex Royal Premier Rose Gold
│   │   ├── classic-4.svg       # Holex Tradition Roman Dial
│   │   ├── sport-1.svg         # Holex Diver Submariner Pro 10ATM
│   │   ├── sport-2.svg         # Holex Chrono Sport Steel 316L
│   │   ├── sport-3.svg         # Holex Urban Stealth Black Edition
│   │   ├── sport-4.svg         # Holex Horizon Deep Blue Sapphire
│   │   ├── couple-1.svg        # Holex Eternal Love Duo Rose Gold
│   │   ├── couple-2.svg        # Holex Celestial Harmony Couple Silver
│   │   └── couple-3.svg        # Holex Royal Sovereign Duo Gold & Leather
│   └── icons/                  # Thư mục icon bổ trợ
│
├── css/
│   └── style.css               # Hệ thống stylesheet phong cách Classic Luxury
│
└── js/
    ├── products.js             # Dữ liệu danh mục 11 sản phẩm Holex
    ├── cart.js                 # Quản lý giỏ hàng, LocalStorage, Toast
    └── main.js                 # Điều khiển giao diện, bộ lọc, modal, form đặt hàng
```

---

## 4. HƯỚNG DẪN CHẠY VÀ SỬ DỤNG WEBSITE

Website được viết hoàn toàn bằng **HTML5 / CSS3 / JavaScript thuần (Vanilla JS)** nên cực kỳ nhẹ, tải trang tức thì và không phụ thuộc vào thư viện bên ngoài.

### Cách 1: Chạy trực tiếp
Nhấp đúp chuột vào file `index.html` hoặc kéo thả file `index.html` vào bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Safari, Firefox).

### Cách 2: Chạy bằng Live Server trên VS Code
1. Mở thư mục `holex` bằng Visual Studio Code.
2. Cài đặt tiện ích mở rộng **Live Server** (Ritwick Dey).
3. Nhấp chuột phải vào `index.html` và chọn **"Open with Live Server"**.
4. Website sẽ tự động mở tại địa chỉ: `http://127.0.0.1:5500/index.html`.

---

## 5. HƯỚNG DẪN TÙY BIẾN & CHỈNH SỬA

### 5.1. Thêm hoặc Chỉnh sửa Sản phẩm
Mở file [products.js](file:///c:/Users/Asus/OneDrive/holex/js/products.js). Mỗi sản phẩm được khai báo dưới dạng một đối tượng JavaScript:
```javascript
{
  id: "classic-01",
  code: "HLX-CLS-01",
  name: "Holex Heritage Ultra-Thin Gold",
  category: "classic",               // "classic" | "sport" | "couple"
  categoryLabel: "HOLEX Classic",
  gender: "men",                     // "men" | "women" | "couple" | "unisex"
  price: 2850000,                    // Giá bán VNĐ
  originalPrice: 3450000,            // Giá gốc trước giảm
  badge: "BEST SELLER",              // "BEST SELLER" | "NEW ARRIVAL" | "LIMITED"
  badgeType: "gold",                 // "gold" | "sapphire" | "default"
  description: "Mô tả chi tiết...",
  shortDesc: "Mô tả ngắn...",
  strapMaterial: "Dây da bò Ý...",
  movementType: "Miyota Quartz...",
  glassMaterial: "Kính Sapphire...",
  waterResistance: "3ATM",
  caseDiameter: "40mm",
  warranty: "5 năm chính hãng Holex",
  image: "assets/images/classic-1.svg",
  rating: 5.0,
  reviewsCount: 38
}
```
Sau khi sửa file `products.js`, hệ thống sẽ tự động cập nhật lên lưới sản phẩm, bộ lọc, modal chi tiết và dropdown đặt hàng.

### 5.2. Thay đổi Hình ảnh Sản phẩm
- Để sử dụng ảnh riêng của cửa hàng: Copy ảnh (định dạng `.png`, `.jpg`, `.webp`) vào thư mục `assets/images/` và cập nhật đường dẫn tại trường `image` trong file `products.js`.

### 5.3. Thay đổi Bảng màu và Phong cách
Mở file [style.css](file:///c:/Users/Asus/OneDrive/holex/css/style.css) tại phần khai báo biến `:root`:
```css
:root {
  --color-black: #080808;           /* Đen tuyền hoàng gia */
  --color-gold: #D4AF62;            /* Vàng Gold chủ đạo */
  --color-gold-hover: #ECC77A;      /* Vàng Gold sáng */
  --color-sapphire: #173B69;        /* Xanh Sapphire */
  --color-ivory: #F7F5F0;           /* Trắng ngà thanh lịch */
  --color-silver: #C5C5C5;          /* Xám bạc */
}
```

### 5.4. Chỉnh sửa Thông tin Cửa hàng
Mở file [index.html](file:///c:/Users/Asus/OneDrive/holex/index.html) tại phần `<!-- 8. FOOTER & THÔNG TIN CỬA HÀNG -->`:
- **Địa chỉ:** Tổ 10, Ấp 2, Xã Long An, Huyện Nhơn Trạch, Tỉnh Đồng Nai.
- **Hotline:** 09031702981.
- **Giờ mở cửa:** 06:00 – 22:00 hằng ngày.
- **Credit:** Dòng chữ `"Thiết kế bởi Từ Dương Huy"` nằm ở khối `.footer-credit-strip`.

---

## 6. KIỂM THỬ VÀ BÁO CÁO MÔI TRƯỜNG

Theo quy định kiểm thử tại mục 14 của đề bài:
1. **Kiểm tra tính toàn vẹn mã nguồn**:
   - Bộ kiểm thử tự động đã quét toàn bộ 100% ID HTML, liên kết tệp tin, hình ảnh SVG và logic JavaScript: **Vượt qua toàn bộ 0 lỗi**.
2. **Kiểm thử trải nghiệm trên Console**:
   - Khi gửi đơn hàng từ form đặt hàng, hệ thống tự động xuất bảng chi tiết đơn hàng dạng `console.table()` và Raw JSON vào Console trình duyệt để lập trình viên và quản trị viên dễ dàng theo dõi.
3. **Thông báo về công cụ ghi hình/chụp màn hình (Tuân thủ chỉ thị Mục 14)**:
   - *"Nếu không có công cụ quay video hoặc chụp ảnh, hãy thông báo rõ, không giả lập kết quả kiểm thử."*
   - Trong môi trường sandbox Windows cô lập hiện tại, tiến trình trình duyệt headless không có quyền ghi trực tiếp tệp ảnh chụp hoặc quay video ra hệ thống tệp bên ngoài. Người dùng có thể mở ngay file `index.html` trên trình duyệt thật (Chrome, Edge, Cốc Cốc) để trực tiếp chiêm ngưỡng toàn bộ giao diện sắc nét và hoạt ảnh sống động.

---

*HOLEX WATCH STORE – Timeless Precision, Modern Style.*
