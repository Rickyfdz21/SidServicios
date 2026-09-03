const brandCards = document.querySelectorAll('.brand-card');
const amountElement = document.querySelector('.amount');
const viewerModal = document.querySelector('#viewerModal');
const modelViewer = document.querySelector('#modelViewer');
const componentViewer = document.querySelector('#componentViewer');
const viewerTitle = document.querySelector('#viewerTitle');
const viewerClose = document.querySelector('#viewerClose');
const stepCards = document.querySelectorAll('.step-card');
const categoryTitle = document.querySelector('.category-panel h3');
const productTitle = document.querySelector('.product-panel h3');
const categoryPanel = document.querySelector('.category-panel');
const categoryOptions = document.querySelector('#categoryOptions');
const productList = document.querySelector('.product-list');
const productSearch = document.querySelector('#productSearch');
const resetButton = document.querySelector('#resetButton');
const selectionSummary = document.querySelector('#selectionSummary');
const cartCount = document.querySelector('#cartCount');
let productItems = [];
let currentComponent = 'Procesador';
let cartItems = Number(localStorage.getItem('compulab-cart') || 0);
const selections = JSON.parse(localStorage.getItem('compulab-selections') || '{}');

const componentProducts = {
  Procesador: [
    { name: 'Intel Core i5-12400F', details: '6 núcleos • 12 hilos', price: 2899, image: 'intel.svg', model: 'ad8a458fa799483b92d119018f6505f1' },
    { name: 'AMD Ryzen 5 5600X', details: '6 núcleos • 12 hilos', price: 2599, image: 'ryzen.svg', model: '1649601de2014dbeab4f201010a7c366' }
  ],
  Motherboard: [
    { name: 'MSI X370 Gaming Pro', details: 'Socket AM4 • AMD X370', price: 2499, model: 'e34058f4745a4170b21f716a53883361' },
    { name: 'ASUS Prime H510M-K', details: 'Socket LGA1200 • Intel H510', price: 2199, model: 'f9a6af88120f4a0f81cd4107ce533e3e' }
  ],
  RAM: [
    { name: 'Kingston Fury Beast DDR5', details: 'DDR5 • Alto rendimiento', price: 899, model: '2a7a6efdcb294829b26fb9503a90e572' },
    { name: 'Corsair Vengeance LPX 16 GB', details: 'DDR4 • 3200 MHz', price: 1599, model: '4174c0d5b63548cbbc8956c0fe3ef263' }
  ],
  GPU: [
    { name: 'Gigabyte RTX 4060 Gaming OC', details: '8 GB • Ray tracing • DLSS 3', price: 6499, model: '678061e3fa9745af8e32c26437344e47' },
    { name: 'AMD Radeon RX 7600 XT', details: '16 GB • AMD FidelityFX', price: 5899, model: '14c331ddb107420284b7c085a9677514' }
  ],
  Almacenamiento: [
    { name: 'Samsung 980 Pro NVMe 1 TB', details: 'PCIe 4.0 • Alta velocidad', price: 1299, model: '1f386c8d782d4b208717bc64474b98b3' },
    { name: 'Samsung 970 EVO NVMe', details: 'M.2 NVMe • Alto rendimiento', price: 2199, model: '4bb502945d9e451bbdfd49e53136ed9a' }
  ]
};

function renderProducts(componentName) {
  currentComponent = componentName;
  const products = componentProducts[componentName];
  categoryPanel.classList.remove('is-hidden');
  categoryTitle.textContent = componentName === 'Procesador' ? '1. Marca del procesador' : `${componentName} - Opciones disponibles`;
  productTitle.textContent = `Productos de ${componentName}`;
  categoryOptions.innerHTML = componentName === 'Procesador'
    ? '<div class="brand-card active" data-brand="Intel"><div class="brand-badge intel">I</div>Intel</div><div class="brand-card" data-brand="AMD"><div class="brand-badge amd">A</div>AMD</div>'
    : products.map((product, index) => `
      <div class="brand-card${index === 0 ? ' active' : ''}" data-product-name="${product.name}">
        <div class="brand-badge intel">${componentName === 'RAM' ? 'R' : componentName === 'GPU' ? 'G' : componentName === 'Almacenamiento' ? 'S' : 'M'}</div>
        ${product.name}
      </div>
    `).join('');
  const selectedName = selections[componentName] || products[0].name;
  selections[componentName] = selectedName;
  const searchTerm = productSearch.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm));
  productList.innerHTML = visibleProducts.length ? visibleProducts.map((product) => `
    <div class="product-item${product.name === selectedName ? ' active' : ''}" data-name="${product.name}" data-price="${product.price}" data-model="${product.model || ''}" data-model-type="${product.modelType || ''}">
      <div class="product-thumb">
        ${product.image ? `<img class="product-image" src="${product.image}" alt="${product.name}" />` : '<span class="component-placeholder">PC</span>'}
      </div>
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>${product.details}</p>
        ${product.model || product.modelType ? `<button class="view-360" type="button" data-product="${product.name}">Ver en 3D</button>` : ''}
        <button class="add-button" type="button" data-add-product="${product.name}">Agregar al carrito</button>
      </div>
      <div class="price-tag">$${product.price.toLocaleString('es-MX')}</div>
    </div>
  `).join('') : '<div class="empty-products">No se encontraron productos.</div>';
  productItems = productList.querySelectorAll('.product-item');
  const selectedProduct = products.find((product) => product.name === selectedName) || products[0];
  amountElement.innerHTML = `$${selectedProduct.price.toLocaleString('es-MX')} <small>MXN</small>`;
  updateSummary();
  bindProductItems();
}

function updateSummary() {
  const components = [
    ['Procesador', 'Procesador'],
    ['Motherboard', 'Tarjeta madre'],
    ['RAM', 'Memoria RAM'],
    ['GPU', 'Tarjeta de video'],
    ['Almacenamiento', 'Almacenamiento']
  ];
  selectionSummary.innerHTML = components.map(([key, label], index) => `
    <li class="${key === currentComponent ? 'active' : ''}">
      <span class="step-number">${index + 1}</span> ${selections[key] || label}
    </li>
  `).join('');
  cartCount.textContent = cartItems;
  localStorage.setItem('compulab-selections', JSON.stringify(selections));
  localStorage.setItem('compulab-cart', String(cartItems));
}

function bindProductItems() {
  productItems.forEach((item) => {
    item.addEventListener('click', () => {
      productItems.forEach((product) => product.classList.remove('active'));
      item.classList.add('active');
      selections[currentComponent] = item.dataset.name;
      const modelId = item.dataset.model;
      categoryOptions.querySelectorAll('.brand-card[data-brand]').forEach((brand) => brand.classList.toggle('active', brand.dataset.brand === (modelId.includes('1649601') ? 'AMD' : 'Intel')));
      const price = Number(item.dataset.price || 0);
      amountElement.innerHTML = `$${price.toLocaleString('es-MX')} <small>MXN</small>`;
      updateSummary();
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

categoryOptions.addEventListener('click', (event) => {
  const card = event.target.closest('.brand-card');
  if (!card) return;
  categoryOptions.querySelectorAll('.brand-card').forEach((item) => item.classList.remove('active'));
  card.classList.add('active');
  if (card.dataset.brand) {
    const product = [...productItems].find((item) => item.dataset.name.startsWith(card.dataset.brand === 'AMD' ? 'AMD' : 'Intel'));
    if (product) product.click();
  }
  if (card.dataset.productName) {
    const product = [...productItems].find((item) => item.dataset.name === card.dataset.productName);
    if (product) product.click();
  }
});

productSearch.addEventListener('input', () => renderProducts(currentComponent));
resetButton.addEventListener('click', () => {
  Object.keys(selections).forEach((key) => delete selections[key]);
  productSearch.value = '';
  cartItems = 0;
  renderProducts(currentComponent);
});

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-product]');
  if (!addButton) return;
  event.stopPropagation();
  cartItems += 1;
  updateSummary();
  addButton.textContent = 'Agregado';
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('.view-360');
  if (!button) return;
  event.stopPropagation();
  const product = button.closest('.product-item');
  const modelType = product.dataset.modelType;
  const hasSketchfabModel = Boolean(product.dataset.model);
  modelViewer.hidden = !hasSketchfabModel;
  componentViewer.hidden = hasSketchfabModel;
  if (hasSketchfabModel) {
    modelViewer.src = `https://sketchfab.com/models/${product.dataset.model}/embed?ui_theme=dark&autostart=1`;
  } else {
    componentViewer.className = `component-3d ${modelType}`;
  }
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
