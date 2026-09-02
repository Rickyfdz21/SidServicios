const brandCards = document.querySelectorAll('.brand-card');
const amountElement = document.querySelector('.amount');
const viewerModal = document.querySelector('#viewerModal');
const modelViewer = document.querySelector('#modelViewer');
const viewerTitle = document.querySelector('#viewerTitle');
const viewerClose = document.querySelector('#viewerClose');
const stepCards = document.querySelectorAll('.step-card');
const categoryTitle = document.querySelector('.category-panel h3');
const productTitle = document.querySelector('.product-panel h3');
const categoryPanel = document.querySelector('.category-panel');
const productList = document.querySelector('.product-list');
let productItems = [];

const componentProducts = {
  Procesador: [
    { name: 'Intel Core i5-12400F', details: '6 núcleos • 12 hilos', price: 2899, image: 'intel.svg', model: 'ad8a458fa799483b92d119018f6505f1' },
    { name: 'AMD Ryzen 5 5600X', details: '6 núcleos • 12 hilos', price: 2599, image: 'ryzen.svg', model: '1649601de2014dbeab4f201010a7c366' }
  ],
  Motherboard: [
    { name: 'MSI PRO B660M-A', details: 'Socket LGA1700 • DDR4', price: 2499 },
    { name: 'ASUS Prime B550M-A', details: 'Socket AM4 • DDR4', price: 2199 }
  ],
  RAM: [
    { name: 'Kingston Fury Beast 16 GB', details: 'DDR4 • 3200 MHz', price: 899 },
    { name: 'Corsair Vengeance 32 GB', details: 'DDR4 • 3600 MHz', price: 1599 }
  ],
  GPU: [
    { name: 'RTX 4060 8 GB', details: 'Ray tracing • DLSS 3', price: 6499 },
    { name: 'Radeon RX 7600 8 GB', details: 'AMD FidelityFX • 8 GB', price: 5899 }
  ],
  Almacenamiento: [
    { name: 'SSD NVMe 1 TB', details: 'PCIe 4.0 • Alta velocidad', price: 1299 },
    { name: 'SSD NVMe 2 TB', details: 'PCIe 4.0 • Gran capacidad', price: 2199 }
  ]
};

function renderProducts(componentName) {
  const products = componentProducts[componentName];
  categoryPanel.classList.toggle('is-hidden', componentName !== 'Procesador');
  categoryTitle.textContent = componentName === 'Procesador' ? '1. Marca del procesador' : `${componentName} - Opciones disponibles`;
  productTitle.textContent = `Productos de ${componentName}`;
  productList.innerHTML = products.map((product, index) => `
    <div class="product-item${index === 0 ? ' active' : ''}" data-price="${product.price}" data-model="${product.model || ''}">
      <div class="product-thumb">
        ${product.image ? `<img class="product-image" src="${product.image}" alt="${product.name}" />` : '<span class="component-placeholder">PC</span>'}
      </div>
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>${product.details}</p>
        ${product.model ? `<button class="view-360" type="button" data-product="${product.name}">Ver en 360°</button>` : ''}
      </div>
      <div class="price-tag">$${product.price.toLocaleString('es-MX')}</div>
    </div>
  `).join('');
  productItems = productList.querySelectorAll('.product-item');
  amountElement.innerHTML = `$${products[0].price.toLocaleString('es-MX')} <small>MXN</small>`;
  bindProductItems();
}

function bindProductItems() {
  productItems.forEach((item) => {
    item.addEventListener('click', () => {
      productItems.forEach((product) => product.classList.remove('active'));
      item.classList.add('active');
      const modelId = item.dataset.model;
      brandCards.forEach((brand) => brand.classList.toggle('active', brand.dataset.brand === (modelId.includes('1649601') ? 'AMD' : 'Intel')));
      const price = Number(item.dataset.price || 0);
      amountElement.innerHTML = `$${price.toLocaleString('es-MX')} <small>MXN</small>`;
    });
  });
}

stepCards.forEach((step) => {
  step.addEventListener('click', () => {
    stepCards.forEach((item) => item.classList.remove('active'));
    step.classList.add('active');
    renderProducts(step.dataset.step);
    document.querySelector('#configurador .catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

brandCards.forEach((card) => {
  card.addEventListener('click', () => {
    brandCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('.view-360');
  if (!button) return;
  event.stopPropagation();
  const product = button.closest('.product-item');
  modelViewer.src = `https://sketchfab.com/models/${product.dataset.model}/embed?ui_theme=dark&autostart=1`;
  viewerTitle.textContent = `Vista 360°: ${button.dataset.product}`;
  viewerModal.hidden = false;
  viewerClose.focus();
});

function closeViewer() {
  viewerModal.hidden = true;
}

viewerClose.addEventListener('click', closeViewer);
viewerModal.addEventListener('click', (event) => {
  if (event.target === viewerModal) closeViewer();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !viewerModal.hidden) closeViewer();
});

const initialPrice = Number(document.querySelector('.product-item.active')?.dataset.price || 0);
amountElement.innerHTML = `$${initialPrice.toLocaleString('es-MX')} <small>MXN</small>`;
renderProducts('Procesador');
