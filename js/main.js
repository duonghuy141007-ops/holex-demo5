/**
 * HOLEX WATCH STORE - Main Application Logic
 * Quản lý giao diện, bộ lọc sản phẩm, modal chi tiết, form đặt hàng và hiệu ứng UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initProductCatalog();
  initProductModal();
  initOrderForm();
  initBackToTop();
  initSmoothScroll();
});

/* ==========================================================================
   1. HEADER & NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Hiệu ứng cuộn thanh Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Hamburger Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('is-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('mobile-menu-open', isOpen);
    });

    // Đóng mobile menu khi click vào link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', false);
        document.body.classList.remove('mobile-menu-open');
      });
    });
  }

  // Header Search Trigger (focus vào ô tìm kiếm hoặc mở bộ lọc)
  const headerSearchBtn = document.getElementById('headerSearchBtn');
  if (headerSearchBtn) {
    headerSearchBtn.addEventListener('click', () => {
      const searchInput = document.getElementById('searchInput');
      const catalogSection = document.getElementById('bo-suu-tap');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (searchInput) searchInput.focus();
        }, 500);
      }
    });
  }
}

/* ==========================================================================
   2. DANH MỤC SẢN PHẨM & BỘ LỌC (FILTERS & SEARCH)
   ========================================================================== */
let activeCategory = 'all';
let activePriceRange = 'all';
let activeSort = 'default';
let searchKeyword = '';

function initProductCatalog() {
  const productGrid = document.getElementById('productGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const priceFilter = document.getElementById('priceFilter');
  const sortSelect = document.getElementById('sortSelect');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const productCountDisplay = document.getElementById('productResultCount');

  // Render sản phẩm lần đầu
  renderProducts();

  // Tab Danh mục
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      renderProducts();
    });
  });

  // Tìm kiếm theo tên theo thời gian thực
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value.trim().toLowerCase();
      renderProducts();
    });
  }

  // Lọc theo khoảng giá
  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      activePriceRange = e.target.value;
      renderProducts();
    });
  }

  // Sắp xếp
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  // Nút xóa bộ lọc
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activePriceRange = 'all';
      activeSort = 'default';
      searchKeyword = '';

      if (searchInput) searchInput.value = '';
      if (priceFilter) priceFilter.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      categoryTabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));

      renderProducts();
      if (window.holexCart) {
        window.holexCart.showToast('Đã xóa tất cả bộ lọc sản phẩm.', 'info');
      }
    });
  }

  // Hàm render sản phẩm dựa trên bộ lọc
  function renderProducts() {
    if (!productGrid) return;

    let filtered = PRODUCTS.filter(product => {
      // 1. Lọc theo danh mục hoặc giới tính
      let matchCategory = true;
      if (activeCategory === 'all') {
        matchCategory = true;
      } else if (activeCategory === 'men' || activeCategory === 'women') {
        matchCategory = product.gender === activeCategory || product.gender === 'unisex';
      } else {
        matchCategory = product.category === activeCategory;
      }

      // 2. Lọc theo khoảng giá
      let matchPrice = true;
      if (activePriceRange === 'under-2m') {
        matchPrice = product.price < 2000000;
      } else if (activePriceRange === '2m-5m') {
        matchPrice = product.price >= 2000000 && product.price <= 5000000;
      } else if (activePriceRange === '5m-10m') {
        matchPrice = product.price > 5000000 && product.price <= 10000000;
      }

      // 3. Lọc theo từ khóa tìm kiếm (tên, mã sản phẩm hoặc danh mục)
      let matchSearch = true;
      if (searchKeyword) {
        const targetString = `${product.name} ${product.code} ${product.categoryLabel} ${product.strapMaterial}`.toLowerCase();
        matchSearch = targetString.includes(searchKeyword);
      }

      return matchCategory && matchPrice && matchSearch;
    });

    // Sắp xếp sản phẩm
    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Hiển thị số lượng kết quả
    if (productCountDisplay) {
      productCountDisplay.textContent = `Hiển thị ${filtered.length} trên tổng số ${PRODUCTS.length} mẫu đồng hồ`;
    }

    // Nếu không tìm thấy kết quả
    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="no-products-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF62" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3>Không tìm thấy mẫu đồng hồ phù hợp</h3>
          <p>Quý khách vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc giá & danh mục.</p>
          <button class="btn btn-outline-gold" onclick="document.getElementById('resetFilterBtn').click()">Xóa bộ lọc & Xem tất cả</button>
        </div>
      `;
      return;
    }

    // Render danh sách thẻ sản phẩm
    productGrid.innerHTML = filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-badge badge-${product.badgeType}">${product.badge}</div>
        
        <div class="product-image-wrap" onclick="openProductDetail('${product.id}')">
          <img class="product-main-img" src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-hover-overlay">
            <button class="quick-view-btn" onclick="event.stopPropagation(); openProductDetail('${product.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Xem chi tiết
            </button>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-category-row">
            <span class="product-category-name">${product.categoryLabel}</span>
            <span class="product-sku">${product.code}</span>
          </div>

          <h3 class="product-title" onclick="openProductDetail('${product.id}')" title="${product.name}">${product.name}</h3>

          <div class="product-specs-chips">
            <span class="spec-chip">⚙ ${product.movementType.split(' ')[0]}</span>
            <span class="spec-chip">💎 ${product.glassMaterial.split(' ')[1] || 'Sapphire'}</span>
            <span class="spec-chip">💧 ${product.waterResistance.split(' ')[0]}</span>
          </div>

          <p class="product-short-desc">${product.shortDesc}</p>

          <div class="product-price-row">
            <div class="product-price-wrap">
              <span class="current-price">${formatCurrency(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
            </div>
            <div class="product-rating">
              <span class="star-icon">★</span>
              <span class="rating-val">${product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div class="product-actions-row">
            <button class="btn btn-outline-gold btn-sm" onclick="openProductDetail('${product.id}')">
              Chi tiết
            </button>
            <button class="btn btn-gold btn-sm" onclick="window.holexCart.addItem('${product.id}', 1)" title="Thêm vào giỏ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Thêm giỏ
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   3. MODAL CHI TIẾT SẢN PHẨM (PRODUCT DETAIL MODAL)
   ========================================================================== */
function initProductModal() {
  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('productModalClose');

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
  if (overlay) overlay.addEventListener('click', closeProductModal);

  // Phím Esc để đóng modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      if (window.holexCart) window.holexCart.close();
    }
  });
}

function openProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('productModalContent');
  const overlay = document.getElementById('modalOverlay');

  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <div class="modal-gallery">
        <div class="modal-main-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="modal-main-img" id="modalImageDisplay">
          <span class="modal-badge badge-${product.badgeType}">${product.badge}</span>
        </div>
        <div class="modal-guarantee-box">
          <div class="guarantee-item">
            <span class="guarantee-icon">🛡️</span>
            <div>
              <strong>Bảo hành chính hãng 5 năm</strong>
              <p>Cam kết phụ tùng & máy móc tiêu chuẩn chính xác</p>
            </div>
          </div>
          <div class="guarantee-item">
            <span class="guarantee-icon">🚚</span>
            <div>
              <strong>Giao hàng hỏa tốc toàn quốc</strong>
              <p>Đồng kiểm tra hàng trước khi thanh toán</p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-details">
        <div class="modal-category-tag">${product.categoryLabel}</div>
        <h2 class="modal-product-title">${product.name}</h2>
        <div class="modal-meta-row">
          <span class="modal-sku">Mã SP: <strong>${product.code}</strong></span>
          <div class="modal-rating-badge">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${product.rating.toFixed(1)}/5.0</span>
            <span class="reviews-count">(${product.reviewsCount} đánh giá)</span>
          </div>
        </div>

        <div class="modal-price-box">
          <span class="modal-current-price">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="modal-old-price">${formatCurrency(product.originalPrice)}</span>` : ''}
          <span class="modal-savings-tag">Tiết kiệm ${formatCurrency((product.originalPrice || product.price) - product.price)}</span>
        </div>

        <div class="modal-description">
          <p>${product.description}</p>
        </div>

        <div class="modal-specs-table">
          <h4>Thông số kỹ thuật chính:</h4>
          <table>
            <tr>
              <td>Chất liệu dây:</td>
              <td><strong>${product.strapMaterial}</strong></td>
            </tr>
            <tr>
              <td>Loại bộ máy:</td>
              <td><strong>${product.movementType}</strong></td>
            </tr>
            <tr>
              <td>Mặt kính:</td>
              <td><strong>${product.glassMaterial}</strong></td>
            </tr>
            <tr>
              <td>Khả năng chống nước:</td>
              <td><strong>${product.waterResistance}</strong></td>
            </tr>
            <tr>
              <td>Kích thước mặt:</td>
              <td><strong>${product.caseDiameter}</strong></td>
            </tr>
            <tr>
              <td>Chế độ bảo hành:</td>
              <td><strong>${product.warranty}</strong></td>
            </tr>
          </table>
        </div>

        <div class="modal-purchase-actions">
          <div class="modal-qty-selector">
            <label>Số lượng:</label>
            <div class="qty-control-box">
              <button type="button" class="qty-btn" onclick="adjustModalQty(-1)">−</button>
              <input type="number" id="modalQtyInput" value="1" min="1" max="10" readonly>
              <button type="button" class="qty-btn" onclick="adjustModalQty(1)">+</button>
            </div>
          </div>

          <div class="modal-buttons-group">
            <button class="btn btn-gold btn-block" onclick="addModalItemToCart('${product.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Thêm vào giỏ hàng
            </button>
            <button class="btn btn-sapphire btn-block" onclick="buyNowFromModal('${product.id}')">
              Đặt mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('is-open');
  if (overlay) overlay.classList.add('is-active');
  document.body.classList.add('modal-open');
}

function adjustModalQty(delta) {
  const input = document.getElementById('modalQtyInput');
  if (input) {
    let val = parseInt(input.value, 10) || 1;
    val = Math.max(1, Math.min(10, val + delta));
    input.value = val;
  }
}

function addModalItemToCart(productId) {
  const qtyInput = document.getElementById('modalQtyInput');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
  if (window.holexCart) {
    window.holexCart.addItem(productId, qty);
  }
  closeProductModal();
}

function buyNowFromModal(productId) {
  const qtyInput = document.getElementById('modalQtyInput');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  closeProductModal();

  // Điền vào form đặt hàng và cuộn đến form
  const orderProductSelect = document.getElementById('orderProductSelect');
  const orderQtyInput = document.getElementById('orderQuantity');
  const orderSection = document.getElementById('dat-hang');

  if (orderProductSelect) {
    orderProductSelect.value = productId;
    // Kích hoạt tính lại tổng tiền form
    orderProductSelect.dispatchEvent(new Event('change'));
  }
  if (orderQtyInput) {
    orderQtyInput.value = qty;
    orderQtyInput.dispatchEvent(new Event('input'));
  }

  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal) modal.classList.remove('is-open');
  if (overlay) overlay.classList.remove('is-active');
  document.body.classList.remove('modal-open');
}

/* ==========================================================================
   4. KHU VỰC ĐẶT HÀNG (ORDER FORM CHECKOUT)
   ========================================================================== */
function initOrderForm() {
  const orderForm = document.getElementById('holexOrderForm');
  const productSelect = document.getElementById('orderProductSelect');
  const qtyInput = document.getElementById('orderQuantity');
  const orderTotalDisplay = document.getElementById('orderFormTotalPrice');
  const orderTimeInput = document.getElementById('orderTime');

  if (!orderForm) return;

  // Điền danh sách sản phẩm vào Dropdown
  if (productSelect) {
    productSelect.innerHTML = `
      <option value="">-- Chọn mẫu đồng hồ quý khách yêu thích --</option>
      ${PRODUCTS.map(p => `
        <option value="${p.id}" data-price="${p.price}">
          ${p.name} (${p.code}) - ${formatCurrency(p.price)}
        </option>
      `).join('')}
    `;
  }

  // Tự động điền ngày giờ hiện tại
  if (orderTimeInput) {
    const now = new Date();
    const formattedDate = now.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    orderTimeInput.value = formattedDate;
  }

  // Tính tổng tiền đơn hàng khi đổi sản phẩm hoặc số lượng
  function calculateOrderTotal() {
    if (!productSelect || !qtyInput || !orderTotalDisplay) return;
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const qty = parseInt(qtyInput.value, 10) || 1;
    
    if (selectedOption && selectedOption.dataset.price) {
      const price = parseInt(selectedOption.dataset.price, 10);
      const total = price * qty;
      orderTotalDisplay.textContent = formatCurrency(total);
    } else {
      orderTotalDisplay.textContent = '0 VNĐ';
    }
  }

  if (productSelect) productSelect.addEventListener('change', calculateOrderTotal);
  if (qtyInput) qtyInput.addEventListener('input', calculateOrderTotal);

  // Xử lý gửi form đặt hàng
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullNameInput = document.getElementById('orderFullName');
    const phoneInput = document.getElementById('orderPhone');
    const addressInput = document.getElementById('orderAddress');
    const noteInput = document.getElementById('orderNote');

    // 1. Kiểm tra không bỏ trống các trường bắt buộc
    let isValid = true;
    clearFormErrors();

    if (!fullNameInput.value.trim()) {
      showFieldError(fullNameInput, 'Vui lòng nhập họ và tên của quý khách.');
      isValid = false;
    }

    // 2. Kiểm tra số điện thoại hợp lệ (Regex SĐT Việt Nam: 10 số, bắt đầu bằng 03, 05, 07, 08, 09)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const cleanPhone = phoneInput.value.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      showFieldError(phoneInput, 'Vui lòng nhập số điện thoại nhận hàng.');
      isValid = false;
    } else if (!phoneRegex.test(cleanPhone)) {
      showFieldError(phoneInput, 'Số điện thoại không hợp lệ (Ví dụ hợp lệ: 0903170298 hoặc 0912345678).');
      isValid = false;
    }

    if (!addressInput.value.trim()) {
      showFieldError(addressInput, 'Vui lòng nhập địa chỉ nhận hàng chi tiết.');
      isValid = false;
    }

    if (!productSelect.value) {
      showFieldError(productSelect, 'Vui lòng chọn một mẫu đồng hồ từ danh sách.');
      isValid = false;
    }

    const qty = parseInt(qtyInput.value, 10);
    if (!qty || qty < 1) {
      showFieldError(qtyInput, 'Số lượng tối thiểu là 1.');
      isValid = false;
    }

    if (!isValid) {
      if (window.holexCart) {
        window.holexCart.showToast('Vui lòng kiểm tra lại các thông tin bắt buộc!', 'error');
      }
      return;
    }

    // Lấy thông tin sản phẩm đã chọn
    const selectedProduct = PRODUCTS.find(p => p.id === productSelect.value);
    const totalPrice = selectedProduct ? selectedProduct.price * qty : 0;

    // Tạo đối tượng đơn hàng
    const orderData = {
      orderId: 'HLX-' + Date.now().toString().slice(-6),
      orderDate: new Date().toISOString(),
      orderTimeFormatted: orderTimeInput.value,
      customer: {
        fullName: fullNameInput.value.trim(),
        phone: cleanPhone,
        address: addressInput.value.trim(),
        note: noteInput.value.trim() || 'Không có ghi chú'
      },
      product: {
        id: selectedProduct.id,
        code: selectedProduct.code,
        name: selectedProduct.name,
        price: selectedProduct.price,
        formattedPrice: formatCurrency(selectedProduct.price),
        category: selectedProduct.categoryLabel,
        quantity: qty
      },
      totalAmount: totalPrice,
      formattedTotal: formatCurrency(totalPrice),
      storeLocation: 'Tổ 10, Ấp 2, Xã Long An, Huyện Nhơn Trạch, Tỉnh Đồng Nai',
      storeHotline: '09031702981'
    };

    // Hiển thị thông tin đơn hàng trong Console phục vụ kiểm thử theo mục 7
    console.log('%c======================================================', 'color: #D4AF62; font-weight: bold;');
    console.log('%c✨ HOLEX WATCH STORE - ĐƠN HÀNG MỚI ĐÃ ĐƯỢC GỬI THÀNH CÔNG! ✨', 'color: #D4AF62; font-size: 14px; font-weight: bold;');
    console.log('%c======================================================', 'color: #D4AF62; font-weight: bold;');
    console.table([
      { 'Mục': 'Mã đơn hàng', 'Thông tin': orderData.orderId },
      { 'Mục': 'Khách hàng', 'Thông tin': orderData.customer.fullName },
      { 'Mục': 'Số điện thoại', 'Thông tin': orderData.customer.phone },
      { 'Mục': 'Địa chỉ', 'Thông tin': orderData.customer.address },
      { 'Mục': 'Thời gian đặt', 'Thông tin': orderData.orderTimeFormatted },
      { 'Mục': 'Sản phẩm', 'Thông tin': `${orderData.product.name} (${orderData.product.code})` },
      { 'Mục': 'Số lượng', 'Thông tin': orderData.product.quantity },
      { 'Mục': 'Tổng thanh toán', 'Thông tin': orderData.formattedTotal },
      { 'Mục': 'Ghi chú', 'Thông tin': orderData.customer.note }
    ]);
    console.log('Chi tiết Raw JSON Đơn hàng:', orderData);
    console.log('%c(Lưu ý: Đây là phiên bản demo frontend. Dữ liệu chưa lưu lên máy chủ backend thực tế)', 'color: #888; font-style: italic;');

    // Hiển thị thông báo thành công cho người dùng
    showOrderSuccessModal(orderData);

    // Reset form
    orderForm.reset();
    calculateOrderTotal();

    // Cập nhật lại thời gian hiện tại
    const now = new Date();
    orderTimeInput.value = now.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // Đồng bộ giỏ hàng sang form đặt hàng
  window.syncCartToOrderForm = function() {
    if (!window.holexCart || window.holexCart.items.length === 0) return;
    const firstCartItem = window.holexCart.items[0];
    if (productSelect) {
      productSelect.value = firstCartItem.id;
    }
    if (qtyInput) {
      qtyInput.value = firstCartItem.quantity;
    }
    calculateOrderTotal();

    // Điền ghi chú tóm tắt nếu có nhiều hơn 1 món trong giỏ
    const noteInput = document.getElementById('orderNote');
    if (noteInput && window.holexCart.items.length > 1) {
      const summaryList = window.holexCart.items.map(i => `${i.name} x${i.quantity}`).join('; ');
      noteInput.value = `[Đơn hàng từ giỏ gồm: ${summaryList}]`;
    }
  };
}

function showFieldError(inputElement, message) {
  inputElement.classList.add('input-error');
  let errSpan = inputElement.parentElement.querySelector('.field-error-message');
  if (!errSpan) {
    errSpan = document.createElement('span');
    errSpan.className = 'field-error-message';
    inputElement.parentElement.appendChild(errSpan);
  }
  errSpan.textContent = message;
}

function clearFormErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.field-error-message').forEach(el => el.remove());
}

function showOrderSuccessModal(orderData) {
  let successModal = document.getElementById('orderSuccessModal');
  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'orderSuccessModal';
    successModal.className = 'order-success-modal';
    document.body.appendChild(successModal);
  }

  successModal.innerHTML = `
    <div class="success-modal-backdrop"></div>
    <div class="success-modal-card">
      <div class="success-badge-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D4AF62" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="16 9 10 15 7 12"></polyline>
        </svg>
      </div>
      <h3 class="success-modal-title">Đơn hàng đã được gửi thành công!</h3>
      <p class="success-modal-brand">HOLEX xin chân thành cảm ơn quý khách <strong>${orderData.customer.fullName}</strong>.</p>
      
      <div class="success-summary-box">
        <div class="summary-line">
          <span>Mã đơn hàng:</span>
          <strong>${orderData.orderId}</strong>
        </div>
        <div class="summary-line">
          <span>Sản phẩm:</span>
          <span>${orderData.product.name} (x${orderData.product.quantity})</span>
        </div>
        <div class="summary-line">
          <span>Tổng thanh toán:</span>
          <strong class="gold-text">${orderData.formattedTotal}</strong>
        </div>
        <div class="summary-line">
          <span>Số điện thoại:</span>
          <span>${orderData.customer.phone}</span>
        </div>
        <div class="summary-line">
          <span>Địa chỉ giao hàng:</span>
          <span>${orderData.customer.address}</span>
        </div>
      </div>

      <p class="success-modal-desc">
        Chuyên viên của Holex Watch Store tại Đồng Nai sẽ liên hệ trực tiếp với quý khách qua số điện thoại <strong>${orderData.customer.phone}</strong> trong vòng 15-30 phút để xác nhận và đóng gói sản phẩm cao cấp.
      </p>

      <button class="btn btn-gold btn-block" onclick="document.getElementById('orderSuccessModal').classList.remove('is-active')">
        Tiếp tục trải nghiệm Holex
      </button>
    </div>
  `;

  successModal.classList.add('is-active');
  const backdrop = successModal.querySelector('.success-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => successModal.classList.remove('is-active'));
  }

  if (window.holexCart) {
    window.holexCart.showToast('Đơn hàng đã được gửi thành công! HOLEX xin cảm ơn quý khách.', 'success');
  }
}

/* ==========================================================================
   5. NÚT QUAY VỀ ĐẦU TRANG & SMOOTH SCROLL
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
