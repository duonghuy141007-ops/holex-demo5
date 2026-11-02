/**
 * HOLEX WATCH STORE - Cart System
 * Quản lý giỏ hàng với LocalStorage, tính toán số lượng, tổng tiền và kết nối Checkout
 */

const CART_STORAGE_KEY = 'holex_watch_cart_v1';

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.drawerElement = document.getElementById('cartDrawer');
    this.overlayElement = document.getElementById('cartOverlay');
    this.badgeElements = document.querySelectorAll('.cart-count-badge');
    this.cartListElement = document.getElementById('cartItemList');
    this.cartTotalElement = document.getElementById('cartTotalPrice');
    this.cartSubtotalElement = document.getElementById('cartSubtotalPrice');
    this.emptyCartElement = document.getElementById('cartEmptyState');
    this.cartFooterElement = document.getElementById('cartFooter');

    this.initEventListeners();
    this.render();
  }

  // Tải dữ liệu từ LocalStorage
  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Không thể đọc giỏ hàng từ LocalStorage:', e);
      return [];
    }
  }

  // Lưu dữ liệu vào LocalStorage
  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Không thể lưu giỏ hàng vào LocalStorage:', e);
    }
  }

  // Thêm sản phẩm vào giỏ
  addItem(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      this.showToast('Không tìm thấy sản phẩm!', 'error');
      return;
    }

    const existingIndex = this.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryLabel: product.categoryLabel,
        quantity: quantity
      });
    }

    this.saveCart();
    this.render();
    this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');

    // Hiệu ứng nhịp tim trên icon giỏ hàng
    this.badgeElements.forEach(badge => {
      badge.classList.remove('pulse-animation');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('pulse-animation');
    });
  }

  // Cập nhật số lượng
  updateQuantity(productId, newQty) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      if (newQty <= 0) {
        this.removeItem(productId);
        return;
      }
      this.items[index].quantity = newQty;
      this.saveCart();
      this.render();
    }
  }

  // Xóa sản phẩm khỏi giỏ
  removeItem(productId) {
    const item = this.items.find(i => i.id === productId);
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    this.render();
    if (item) {
      this.showToast(`Đã xóa "${item.name}" khỏi giỏ hàng.`, 'info');
    }
  }

  // Xóa sạch giỏ hàng sau khi đặt thành công
  clearCart() {
    this.items = [];
    this.saveCart();
    this.render();
  }

  // Tổng số lượng sản phẩm
  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Tổng giá trị giỏ hàng
  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Mở Drawer giỏ hàng
  open() {
    if (this.drawerElement) {
      this.drawerElement.classList.add('is-open');
      document.body.classList.add('modal-open');
    }
    if (this.overlayElement) {
      this.overlayElement.classList.add('is-active');
    }
  }

  // Đóng Drawer giỏ hàng
  close() {
    if (this.drawerElement) {
      this.drawerElement.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
    if (this.overlayElement) {
      this.overlayElement.classList.remove('is-active');
    }
  }

  // Render giao diện giỏ hàng
  render() {
    const count = this.getTotalCount();
    const total = this.getTotalPrice();

    // Cập nhật badge
    this.badgeElements.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    if (!this.cartListElement) return;

    if (this.items.length === 0) {
      if (this.emptyCartElement) this.emptyCartElement.style.display = 'block';
      if (this.cartFooterElement) this.cartFooterElement.style.display = 'none';
      this.cartListElement.innerHTML = '';
      if (this.cartTotalElement) this.cartTotalElement.textContent = '0 VNĐ';
      if (this.cartSubtotalElement) this.cartSubtotalElement.textContent = '0 VNĐ';
      return;
    }

    if (this.emptyCartElement) this.emptyCartElement.style.display = 'none';
    if (this.cartFooterElement) this.cartFooterElement.style.display = 'block';

    this.cartListElement.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-header">
            <span class="cart-item-tag">${item.categoryLabel}</span>
            <button class="cart-remove-btn" title="Xóa khỏi giỏ" onclick="window.holexCart.removeItem('${item.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-code">${item.code}</span>
          <div class="cart-item-price-qty">
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            <div class="cart-qty-control">
              <button class="qty-btn" onclick="window.holexCart.updateQuantity('${item.id}', ${item.quantity - 1})" title="Giảm">−</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="window.holexCart.updateQuantity('${item.id}', ${item.quantity + 1})" title="Tăng">+</button>
            </div>
          </div>
          <div class="cart-item-subtotal">
            Thành tiền: <strong>${formatCurrency(item.price * item.quantity)}</strong>
          </div>
        </div>
      </div>
    `).join('');

    const formattedTotal = formatCurrency(total);
    if (this.cartTotalElement) this.cartTotalElement.textContent = formattedTotal;
    if (this.cartSubtotalElement) this.cartSubtotalElement.textContent = formattedTotal;
  }

  // Khởi tạo các sự kiện
  initEventListeners() {
    // Mở drawer khi click các nút có class .open-cart-trigger
    document.querySelectorAll('.open-cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Đóng drawer khi click nút close hoặc overlay
    const closeBtn = document.getElementById('cartCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (this.overlayElement) this.overlayElement.addEventListener('click', () => this.close());

    // Nút "Tiến hành đặt hàng" trong giỏ
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.close();
        // Cuộn tới form đặt hàng và đồng bộ sản phẩm
        const orderSection = document.getElementById('dat-hang');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth' });
          if (window.syncCartToOrderForm) {
            window.syncCartToOrderForm();
          }
        }
      });
    }
  }

  // Toast Notification sang trọng
  showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `holex-toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF62" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF62" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
}

// Khởi tạo toàn cục giỏ hàng
document.addEventListener('DOMContentLoaded', () => {
  window.holexCart = new CartManager();
});
