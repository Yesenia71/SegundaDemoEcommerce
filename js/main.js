/*-- ====================================================================================== -->
<!-- LOGICA DE CONTROL DE JAVASCRIPT -->
<!-- ====================================================================================== -->
<>
// ----------------------------------------------------
// Base de Datos de Productos de Prueba (Datos Realistas)
// ----------------------------------------------------*/
const productsData = [
    {
        id: 1,
        name: "Auriculares Aurora ANC",
        price: 189.99,
        category: "Audio",
        desc: "Cancelación de ruido activa híbrida inteligente y sonido de alta fidelidad.",
        image: "audio"
    },
    {
        id: 2,
        name: "Smartwatch Cronos V2",
        price: 249.50,
        category: "Wearables",
        desc: "Pantalla AMOLED con monitoreo de rendimiento físico, oxímetro de pulso y GPS incorporado.",
        image: "wearable"
    },
    {
        id: 3,
        name: "Teclado Mecánico Apex 75%",
        price: 145.00,
        category: "Periféricos",
        desc: "Switches mecánicos lubricados y personalizables con retroiluminación RGB dinámica.",
        image: "keyboard"
    },
    {
        id: 4,
        name: "Ratón Ergonómico Nebula",
        price: 79.99,
        category: "Periféricos",
        desc: "Sensor óptico de alta precisión a 26K DPI con diseño ergonómico de agarre natural.",
        image: "mouse"
    },
    {
        id: 5,
        name: "Mochila Tech Aura Nomad",
        price: 110.00,
        category: "Accesorios",
        desc: "Estructura impermeable con compartimento blindado para portátiles de hasta 16\".",
        image: "backpack"
    },
    {
        id: 6,
        name: "Lámpara Minimalista Lumina",
        price: 65.00,
        category: "Accesorios",
        desc: "Carga inalámbrica Qi integrada con temperatura de color adaptable y táctil.",
        image: "lamp"
    }
];

// ----------------------------------------------------
// Estado del Carrito en Memoria
// ----------------------------------------------------
let cart = [];

// ----------------------------------------------------
// Inicialización y Variables del DOM
// ----------------------------------------------------
const productsGrid = document.getElementById('products-grid');
const cartDrawer = document.getElementById('cart-drawer');
const backdrop = document.getElementById('backdrop');
const cartBadge = document.getElementById('cart-badge');
const cartCountTitle = document.getElementById('cart-count-title');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartActiveList = document.getElementById('cart-active-list');
const cartSummaryFooter = document.getElementById('cart-summary-footer');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');

// Elementos móviles
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Al iniciar la carga de la página
window.addEventListener('DOMContentLoaded', () => {
    renderProducts(productsData);
    setupEventListeners();
    updateCartUI();
});

// ----------------------------------------------------
// Configuración de Eventos de Interfaz
// ----------------------------------------------------
function setupEventListeners() {
    // Controladores del Carrito Lateral
    document.getElementById('cart-toggle-btn').addEventListener('click', toggleCart);
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    backdrop.addEventListener('click', () => {
        closeCart();
        mobileMenu.classList.add('hidden');
    });

    // Control de Menú Móvil
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if(!mobileMenu.classList.contains('hidden')) {
            backdrop.classList.remove('hidden');
            backdrop.classList.add('block');
            backdrop.style.opacity = '1';
        } else {
            backdrop.style.opacity = '0';
            setTimeout(() => backdrop.classList.add('hidden'), 300);
        }
    });

    // Cerrar menú móvil en links clicleados
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            closeCart();
        });
    });

    // Escuchar scroll para cambiar el diseño del header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('shadow-md', 'h-16');
            header.classList.remove('h-20');
        } else {
            header.classList.remove('shadow-md', 'h-16');
            header.classList.add('h-20');
        }
    });
}

// ----------------------------------------------------
// Renderizado del Listado de Productos
// ----------------------------------------------------
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-500">
                No se encontraron productos en esta categoría.
            </div>
        `;
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = "group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-150 transition-all duration-300 flex flex-col justify-between";
        
        // Obtener el SVG de producto adecuado para simular imágenes profesionales sin URLs rotas
        const productSVG = getProductSVG(product.image);

        productCard.innerHTML = `
            <div class="relative bg-slate-50 aspect-[4/3] flex items-center justify-center p-6 group-hover:scale-[1.02] transition-transform duration-500">
                <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-100 text-xs font-bold text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider">${product.category}</span>
                <div class="w-36 h-36 flex items-center justify-center text-slate-700 select-none">
                    ${productSVG}
                </div>
            </div>
            <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div class="space-y-1">
                    <h3 class="font-extrabold text-slate-900 text-lg group-hover:text-primary transition-colors duration-200">${product.name}</h3>
                    <p class="text-sm text-slate-500 line-clamp-2">${product.desc}</p>
                </div>
                <div class="pt-2 flex items-center justify-between">
                    <span class="text-2xl font-black text-slate-900">${product.price.toFixed(2)}€</span>
                    <button onclick="addToCart(${product.id})" class="px-4 py-2.5 bg-slate-950 hover:bg-primary hover:shadow-lg hover:shadow-indigo-100 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-1.5 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Añadir
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Helper para inyectar vectores de simulación limpios según producto
function getProductSVG(type) {
    switch(type) {
        case 'audio':
            return `<svg class="w-full h-full text-indigo-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 2C6.48 2 2 6.48 2 12V18C2 19.1 2.9 20 4 20H7C8.1 20 9 19.1 9 18V13C9 11.9 8.1 11 7 11H4V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V11H17C15.9 11 15 11.9 15 13V18C15 19.1 15.9 20 17 20H20C21.1 20 22 19.1 22 18V12C22 6.48 17.52 2 12 2Z"/></svg>`;
        case 'wearable':
            return `<svg class="w-full h-full text-emerald-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 2v2m0 16v2M12 4h.01M12 20h.01"/></svg>`;
        case 'keyboard':
            return `<svg class="w-full h-full text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>`;
        case 'mouse':
            return `<svg class="w-full h-full text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 3v18M12 3a6 6 0 016 6v6a6 6 0 01-6 6M12 3a6 6 0 00-6 6v6a6 6 0 00-6 6"/></svg>`;
        case 'backpack':
            return `<svg class="w-full h-full text-blue-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V11l-8-4M4 7v10l8 4"/></svg>`;
        case 'lamp':
            return `<svg class="w-full h-full text-amber-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`;
        default:
            return `<svg class="w-full h-full text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V11l-8-4M4 7v10l8 4"/></svg>`;
    }
}

// ----------------------------------------------------
// Filtrado por Categorías
// ----------------------------------------------------
function filterCategory(categoryName) {
    // Actualizar diseño de botones pill
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.className = "filter-pill px-4 py-2 text-sm font-semibold rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200";
    });

    const activeBtn = document.getElementById(`filter-${categoryName}`);
    if (activeBtn) {
        activeBtn.className = "filter-pill px-4 py-2 text-sm font-semibold rounded-full bg-primary text-white transition-all duration-200";
    }

    // Filtrar y volver a pintar
    if (categoryName === 'all') {
        renderProducts(productsData);
    } else {
        const filtered = productsData.filter(p => p.category === categoryName);
        renderProducts(filtered);
    }
}

// ----------------------------------------------------
// Acciones y Lógica de Negocio del Carrito
// ----------------------------------------------------
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Revisar si ya está agregado en la cesta
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showToast(`"${product.name}" agregado al carrito.`);
    openCart(); // Ofrece una experiencia interactiva al autoabrir el drawer
}

function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity === 0) {
            removeFromCart(productId);
            return;
        }
    }
    updateCartUI();
}

function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    if (item) {
        showToast(`Se ha eliminado "${item.name}".`, 'info');
    }
}

// ----------------------------------------------------
// Renderizado del Carrito Lateral
// ----------------------------------------------------
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Actualizar badges
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('scale-0');
        cartBadge.classList.add('scale-100');
    } else {
        cartBadge.classList.remove('scale-100');
        cartBadge.classList.add('scale-0');
    }

    cartCountTitle.textContent = `${totalItems} artículo${totalItems !== 1 ? 's' : ''}`;

    // Control de vistas de vacio/activo
    if (cart.length === 0) {
        cartEmptyState.classList.remove('hidden');
        cartActiveList.classList.add('hidden');
        cartSummaryFooter.classList.add('hidden');
    } else {
        cartEmptyState.classList.add('hidden');
        cartActiveList.classList.remove('hidden');
        cartSummaryFooter.classList.remove('hidden');

        // Renderizar los items agregados
        cartActiveList.innerHTML = '';
        let totalCost = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalCost += itemTotal;

            const itemNode = document.createElement('div');
            itemNode.className = "flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 items-center justify-between";
            itemNode.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-14 h-14 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center p-2 text-slate-800">
                        ${getProductSVG(item.image)}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 text-sm line-clamp-1">${item.name}</h4>
                        <p class="text-xs text-slate-500">${item.price.toFixed(2)}€ x ${item.quantity}</p>
                        <span class="text-sm font-semibold text-accent">${itemTotal.toFixed(2)}€</span>
                    </div>
                </div>
                
                <div class="flex flex-col items-end gap-2">
                    <!-- Botón Eliminar -->
                    <button onclick="removeFromCart(${item.id})" class="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-white transition-colors" aria-label="Eliminar artículo">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                    <!-- Controles de Cantidad -->
                    <div class="flex items-center border border-slate-200 bg-white rounded-lg h-8">
                        <button onclick="updateQuantity(${item.id}, 'decrease')" class="px-2 text-slate-500 hover:text-slate-800 transition-colors">-</button>
                        <span class="px-2 text-xs font-bold text-slate-800">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 'increase')" class="px-2 text-slate-500 hover:text-slate-800 transition-colors">+</button>
                    </div>
                </div>
            `;
            cartActiveList.appendChild(itemNode);
        });

        cartSubtotal.textContent = `${totalCost.toFixed(2)}€`;
        cartTotal.textContent = `${totalCost.toFixed(2)}€`;
    }
}

// ----------------------------------------------------
// Apertura / Cierre del Drawer (UI)
// ----------------------------------------------------
function toggleCart() {
    if (cartDrawer.classList.contains('translate-x-full')) {
        openCart();
    } else {
        closeCart();
    }
}

function openCart() {
    cartDrawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    backdrop.classList.add('block');
    // Retardo de animación de opacidad
    setTimeout(() => backdrop.classList.add('opacity-100'), 10);
    mobileMenu.classList.add('hidden'); // Asegura cerrar menú móvil
}

function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    setTimeout(() => {
        if (cartDrawer.classList.contains('translate-x-full')) {
            backdrop.classList.add('hidden');
        }
    }, 300);
}

// ----------------------------------------------------
// Mensajes Toast Personalizados (Alternativo a alert)
// ----------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Configurar color según tipo
    const bgClass = type === 'success' ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-800 border-indigo-500/30';
    const iconColor = type === 'success' ? 'text-emerald-400' : 'text-indigo-400';
    const iconSvg = type === 'success' 
        ? `<svg class="w-5 h-5 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        : `<svg class="w-5 h-5 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

    toast.className = `flex items-center gap-3 px-4 py-3.5 rounded-xl text-white ${bgClass} border text-sm shadow-xl pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300 max-w-sm`;
    toast.innerHTML = `
        ${iconSvg}
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animaciones
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 50);

    // Auto-eliminar
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ----------------------------------------------------
// Gestión de Simulaciones Finales (Checkout & Newsletter)
// ----------------------------------------------------
function triggerCheckout() {
    if (cart.length === 0) return;
    closeCart();

    // Rellenar total en modal
    const finalTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.getElementById('modal-total-amount').textContent = `${finalTotal.toFixed(2)}€`;

    // Mostrar modal con retraso elegante
    const modal = document.getElementById('checkout-modal');
    const modalBox = document.getElementById('modal-box');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalBox.classList.remove('scale-95', 'opacity-0');
        modalBox.classList.add('scale-100', 'opacity-100');
    }, 50);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const modalBox = document.getElementById('modal-box');
    
    modalBox.classList.remove('scale-100', 'opacity-100');
    modalBox.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        // Vaciar carrito tras simulación
        cart = [];
        updateCartUI();
    }, 300);
}

function handleNewsletter(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    showToast(`¡Gracias! Se ha registrado: ${input.value}`);
    input.value = '';
}
