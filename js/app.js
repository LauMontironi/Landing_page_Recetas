const featuredGrid = document.querySelector('#featured-grid')
const allGrid = document.querySelector('#all-grid')

const featuredSection = document.querySelector('#featured-section')
const allSection = document.querySelector('#all-section')

const filterForm = document.querySelector('#filter-form')

/*<div class="card" data-id="1">
    <div class="card-image-container">
        <img src="https://placehold.co/400x250/FFA07A/ffffff?text=Calabaza" alt="Sopa de Calabaza y Jengibre">

        <span class="card-badge">Destacado</span>
    </div>

    <div class="card-content">
        <span class="card-category">Entrantes</span>
        <h3 class="card-title">Sopa de Calabaza y Jengibre</h3>
        <p class="card-details">
            <i class="fa-solid fa-clock"></i> 30 min | 
            <i class="fa-solid fa-fire"></i> Fácil | 
            Chef Isabella Rossi
        </p>

        <p class="card-price">5.50 €</p>

        <button 
            id="btn-add-to-cart" 
            data-product-id="1"
            data-product-nombre="Sopa de Calabaza y Jengibre"
            data-product-precio="5.50"

            <i class="fa-solid fa-cart-plus"></i> Añadir al Carrito
        </button>
    </div>
</div>*/


function createdinamicCards(array, domhtml) {
    
array.forEach(recetario => {
    
const divCard = document.createElement('div')
divCard.classList.add('card')
    // divCard.dataset = `data-set${recetario.id}`
divCard.dataset.id = recetario.id


const cardImageContainer = document.createElement('div')
cardImageContainer.classList.add('card-image-container')

const img = document.createElement('img')
img.src = recetario.imagen
img.alt = recetario.nombre

cardImageContainer.appendChild(img)

const CardContent = document.createElement('div')
CardContent.classList.add('card-content')

const cardCategory = document.createElement('span')
cardCategory.classList.add('card-category')
cardCategory.textContent = recetario.categoria
    
const CardTitle = document.createElement('h3')
CardTitle.classList.add('card-title')
CardTitle.textContent = recetario.nombre

const cardDetails = document.createElement('p')
cardDetails.classList.add('card-details')
cardDetails.innerHTML= `<i class="fa-solid fa-clock"></i> ${recetario.tiempoPreparacion} | 
                        <i class="fa-solid fa-fire"></i> ${recetario.dificultad}  | 
                        ${recetario.chef} `

const cardPrice = document.createElement('p')
cardPrice.classList.add('card-price')
cardPrice.textContent= `${recetario.precio} €`

const boton = document.createElement('button')
boton.classList.add('btn-add-to-cart');
boton.dataset.productId = recetario.id;
boton.dataset.productNombre = recetario.nombre;
boton.dataset.productPrecio = recetario.precio;
boton.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Añadir al Carrito`

 if (recetario.esDestacado === true){
const cardbadge = document.createElement('span')
cardbadge.classList.add('card-badge')
cardbadge.innerHTML = `<em>Destacado</em>`
    
cardImageContainer.appendChild(cardbadge)
 }
 

divCard.appendChild(cardImageContainer)

CardContent.append(cardCategory, CardTitle, cardDetails , cardPrice,boton, )

divCard.appendChild(CardContent)

domhtml.appendChild(divCard)
    })
}

createdinamicCards(recetas, allGrid)
createdinamicCards(recetas.filter(destacado => destacado.esDestacado === true ), featuredGrid)


//******************************PASO 2- FILTRAR POR FORMULARIO ****************************//



function CreateSectionBuscados(domContainer) {
 const sectionSearch = document.createElement('section')
 sectionSearch.id = 'search-section'
 sectionSearch.classList.add('service-section')// misma clase que seccion servicios para que mantenga el layout 
 sectionSearch.style.display='none' // cuando inyecte las cards de la busqueda le cambio el display a block 
 const sectionSearchh2 = document.createElement('h2')
 sectionSearchh2.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Resultados de la Busqueda`
 const searchGrid = document.createElement('div')
 searchGrid.id = 'search-grid'
 searchGrid.classList.add('grid-container');

 sectionSearch.append(sectionSearchh2, searchGrid);
 domContainer.appendChild(sectionSearch)


return { sectionSearch, searchGrid };// retornar referencias para manipular luego

 }

// para poder usar esta fncion y que me cree la seccion cuando aplico el filtro, tengo que capturar <main class="content-area"> que es donde van las secciones :

const mainContent = document.querySelector('.content-area');
const { sectionSearch, searchGrid } = CreateSectionBuscados(mainContent);




function objectsfiltered(event) {
 event.preventDefault();

 featuredGrid.innerHTML= ""
 allGrid.innerHTML = ''
 searchGrid.innerHTML=''

 const recipeName = event.target["recipe-name"].value.trim().toLowerCase();
 const priceMinInput = event.target['price-min'].value
 const priceMaxInput = event.target['price-max'].value
 const priceMin = priceMinInput === '' ? NaN : Number(priceMinInput);
 const priceMax = priceMaxInput === '' ? NaN : Number(priceMaxInput);

 const categorySelect = event.target['category-select'].value

 const filtradosOk = recetas.filter(receta => {
  const recipe = recipeName === '' || receta.nombre.toLowerCase().includes(recipeName);
  const matchMin  = isNaN(priceMin) || receta.precio >= priceMin;
  const matchMax  = isNaN(priceMax) || receta.precio <= priceMax;
  const matchCat  = (categorySelect === 'todas') || (receta.categoria === categorySelect)

  return recipe &&  matchMin && matchMax && matchCat  
 })

 sectionSearch.style.display = 'block';

 if (filtradosOk.length > 0) {
  createdinamicCards(filtradosOk, searchGrid)
 } else {
  const noResults = document.createElement('p')
  noResults.textContent = 'No hay resultados'
  noResults.style.color = `var(--color-alerta)`
  noResults.style.padding = '12px';
  noResults.style.border = '1px dashed var(--color-borde)';
  noResults.style.borderRadius = '8px';

  searchGrid.appendChild(noResults)
 }


}

filterForm.addEventListener('submit', objectsfiltered)


//////////////// PASO 3 AÑADIR AL CARRITO LOS ELEMENTOS /////////////////////

// Estado del carrito (array de productos + contador)
let cart = [];
let totalItems = 0;

// Referencias del DOM (según tu HTML)
const cartCountEl   = document.querySelector('#cart-count');      // el numerito rojo
const cartItemsList = document.querySelector('#cart-items-list'); // el contenedor de los
//items
const cartIcon = document.querySelector('#cart-icon')
const cartDropdown = document.querySelector('#cart-dropdown')

// Delegación de eventos: escucha clicks en cualquier parte del documento
document.addEventListener('click', (event) => {
  // Buscamos si el click vino de un botón "Añadir al carrito"
  const btn = event.target.closest('.btn-add-to-cart');
  if (!btn) return; // si no clicó un botón de ese tipo, no hacemos nada

  // 1️⃣ Obtener info del producto desde los data-attributes
  const id     = Number(btn.dataset.productId);
  const nombre = btn.dataset.productNombre;
  const precio = Number(btn.dataset.productPrecio);

  // 2️⃣ Ver si ya existe ese producto en el carrito
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, nombre, precio, qty: 1 });
  }

  // 3️⃣ Actualizar contador global
  totalItems++;
  cartCountEl.textContent = totalItems;

  // 4️⃣ Renderizar nuevamente el carrito (popover)
  renderCartItems();
});


// 🧮 Función para renderizar los items dentro del popover
function renderCartItems() {
  cartItemsList.innerHTML = ''; // limpiar antes de volver a dibujar

  if (cart.length === 0) {
   cartItemsList.innerHTML = '<p class="empty-state" style="border:none;">Carrito vacío</p>';
   document.querySelector('#subtotal').textContent = '0.00 €';
   document.querySelector('#iva').textContent = '0.00 €';
   document.querySelector('#total').textContent = '0.00 €';
    return;
  }

  cart.forEach(({ id, nombre, precio, qty }) => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <span>${nombre} x ${qty}</span>
      <span>${(precio * qty).toFixed(2)} €</span>
    `;
    cartItemsList.appendChild(row);
  });

  // ✅ Calcular subtotal, IVA (10%) y total
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.qty, 0);
  const iva = subtotal * 0.10;
  const total = subtotal + iva;

  // ✅ Mostrar los valores en el DOM
  document.querySelector('#subtotal').textContent = subtotal.toFixed(2) + ' €';
  document.querySelector('#iva').textContent = iva.toFixed(2) + ' €';
  document.querySelector('#total').textContent = total.toFixed(2) + ' €';
}



// mostrar
cartIcon.addEventListener('mouseenter', () => {
  cartDropdown.style.visibility = 'visible';
  cartDropdown.style.opacity = '1';
  cartDropdown.style.transform = 'translateY(0)';
});

// ocultar
cartIcon.addEventListener('mouseleave', () => {
  cartDropdown.style.visibility = 'hidden';
  cartDropdown.style.opacity = '0';
  cartDropdown.style.transform = 'translateY(-10px)';
});


const btnEmtyCart = document.querySelector('#btn-empty-cart')

btnEmtyCart.addEventListener('click', function () {
 cartItemsList.innerHTML = '<p class="empty-state" style="border:none;">Carrito vacío</p>';
   document.querySelector('#subtotal').textContent = '0.00 €';
   document.querySelector('#iva').textContent = '0.00 €';
  document.querySelector('#total').textContent = '0.00 €';
  cart = [];
  totalItems = 0;
  cartCountEl.textContent= '0'
})

/////////////////paso 4- modo dia y noche y aleatorio //////////////


btnNightMode = document.querySelector('#btn-night-mode')
btnDayMode = document.querySelector('#btn-day-mode')
btnRandomColor = document.querySelector('#btn-random-color')


function ChangeLight(e) {
 document.body.classList.toggle('dark-mode')
}

btnNightMode.addEventListener('click',ChangeLight)
btnDayMode.addEventListener('click', ChangeLight)

function randomColor(e) {
 const randomHex = Math.floor(Math.random() * 16777215).toString(16);
 const color = `#${randomHex}`;
 document.documentElement.style.setProperty('--color-principal', color);
}

btnRandomColor.addEventListener('click', randomColor)