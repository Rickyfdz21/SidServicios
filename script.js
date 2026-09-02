const brandCards = document.querySelectorAll('.brand-card');
const productItems = document.querySelectorAll('.product-item');
const amountElement = document.querySelector('.amount');
const viewerModal = document.querySelector('#viewerModal');
const viewerStage = document.querySelector('#viewerStage');
const caseViewer = document.querySelector('#case360');
const viewerTitle = document.querySelector('#viewerTitle');
const viewerClose = document.querySelector('#viewerClose');
let isDragging = false;
let startX = 0;
let rotation = 0;

brandCards.forEach((card) => {
  card.addEventListener('click', () => {
    brandCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

productItems.forEach((item) => {
  item.addEventListener('click', () => {
    productItems.forEach((product) => product.classList.remove('active'));
    item.classList.add('active');

    const price = Number(item.dataset.price || 0);
    amountElement.innerHTML = `$${price.toLocaleString('es-MX')} <small>MXN</small>`;
  });
});

document.querySelectorAll('.view-360').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    viewerTitle.textContent = `Vista 360°: ${button.dataset.product}`;
    viewerModal.hidden = false;
    viewerClose.focus();
  });
});

function closeViewer() {
  viewerModal.hidden = true;
}

viewerClose.addEventListener('click', closeViewer);
viewerModal.addEventListener('click', (event) => {
  if (event.target === viewerModal) closeViewer();
});

viewerStage.addEventListener('pointerdown', (event) => {
  isDragging = true;
  startX = event.clientX;
  viewerStage.classList.add('is-dragging');
  viewerStage.setPointerCapture(event.pointerId);
});

viewerStage.addEventListener('pointermove', (event) => {
  if (!isDragging) return;
  rotation += (event.clientX - startX) * 0.7;
  startX = event.clientX;
  caseViewer.style.setProperty('--rotation', `${rotation}deg`);
});

viewerStage.addEventListener('pointerup', () => {
  isDragging = false;
  viewerStage.classList.remove('is-dragging');
});

viewerStage.addEventListener('pointercancel', () => {
  isDragging = false;
  viewerStage.classList.remove('is-dragging');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !viewerModal.hidden) closeViewer();
});

const initialPrice = Number(document.querySelector('.product-item.active')?.dataset.price || 0);
amountElement.innerHTML = `$${initialPrice.toLocaleString('es-MX')} <small>MXN</small>`;
