// Sample products data
  
const items = [
    { name: 'Aata Ashirwaad (5kg)', price: 250, category:'Atta Rice & Daal', image: 'images/ashirwaad.png', rating: 4.5, badge: 'Best Seller' },
    { name: 'Daal (1kg)', price: 99,category:'Atta Rice & Daal', image: 'images/daal.png', rating: 4.0, badge: 'Popular' },
    { name: 'Sugar (1kg)', price: 49,category:'Atta Rice & Daal', image: 'https://imgs.search.brave.com/_3uakTkU_af6b0KhyeXE4Xlnv1-Pca02WwE2UtZ5snA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9waWxl/LXN1Z2FyLTEzNDE5/MDQ4LmpwZw', rating: 3.8 },
    { name: 'Soozi(500gm)', price: 30,category:'Atta Rice & Daal', image: 'images/soozi.png' },
    { name: 'Soozi(250gm)', price: 15,category:'Atta Rice & Daal', image: 'images/soozi.png' },
    { name: 'Shamai(100gm)', price: 10,category:'Atta Rice & Daal', image: 'images/shamai.png' },
    { name: 'Soyabean(250gm)', price: 30,category:'Atta Rice & Daal', image: 'images/soyabean.png' },
    { name: 'Matar Kalai(500gm)', price: 40,category:'Atta Rice & Daal', image: 'images/whitematar.png' },
    { name: 'Mashoor Dal(500gm)', price: 55,category:'Atta Rice & Daal', image: 'images/daal.png' },
    { name: 'Boot Kalai(500gm)', price: 25,category:'Atta Rice & Daal', image: 'images/bootkalai.png' },
    { name: 'Chira(500gm)', price: 25,category:'Atta Rice & Daal', image: 'images/chira.png' },
    { name: 'Muta Rice(1kg)', price: 35,category:'Atta Rice & Daal', image: 'images/mutarice.png' },
    { name: 'Basmati Rice(1kg)', price: 45,category:'Atta Rice & Daal', image: 'images/pulaorice.png' },
    { name: 'Assam king Pulao Rice(1kg)', price: 45,category:'Atta Rice & Daal', image: 'images/chawal.png' },
    { name: 'Milk (160ml)', price: 10,category:'Dairy', image: 'images/milk.png', rating: 4.4 },

    { name: 'Hydrous(500 ml)', price: 10, category:'Cold Drinks & Juices', image: 'images/hydrous.png' },
    { name: 'ORSL(200 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/ORSL.png' },
    { name: 'Maza(200 ml)', price: 10,category:'Cold Drinks & Juices', image: 'images/maza.jpg' },
    { name: 'Sting(250 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/sting.png' },
    { name: 'Sprite(200 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/sprite.png' },
    { name: 'Puro Mango Drink(1L)', price: 70,category:'Cold Drinks & Juices', image: 'images/PuroMango.png' },
    { name: 'Mango Drink(2L)', price: 110,category:'Cold Drinks & Juices', image: 'images/mango2L.png' },
    { name: 'Drupe Lemon Flavour(160ml)', price: 10,category:'Cold Drinks & Juices', image: 'images/drupe.jpg' },
    { name: 'Fanta(750ml)', price: 40,category:'Cold Drinks & Juices', image: 'images/fanta.png' },
    { name: 'Amul kool(150ml)', price: 25,category:'Cold Drinks & Juices', image: 'images/amulKool.png' },
    { name: 'Indane Gas(14kg)', price: 999,category:'Beverages', image: 'images/indanegas.png' },
    { name: 'Almond(100gm)', price: 120,category:'Beverages', image: 'images/almond.png' },
    { name: 'Kaaju Badam(100gm)', price: 120,category:'Beverages', image: 'images/kajuBadam.png' },
    { name: 'Taalmisri(100gm)', price: 35,category:'Beverages', image: 'images/talmisri.png' },
    { name: 'Kismis(80gm)', price: 60,category:'Beverages', image: 'images/kismis.png' },
    { name: 'Candle(1pkt)', price: 75,category:'Beverages', image: 'images/candle.jpg' },
    { name: 'Khejur(400gm)', price: 230, category:'Beverages',image: 'images/khejur.png' },
    { name: 'Maxo(1pkt)', price: 29,category:'Beverages', image: 'images/maxo.jpg' },
    { name: 'Sweat Toast(Big)', price: 49,category:'Beverages', image: 'images/sweatToast.jpg' },
    { name: 'Sweat Toast(Small)', price: 30,category:'Beverages', image: 'images/sweatToast.jpg' },
    { name: 'zig Zag Brush(1P)', price: 25,category:'Beverages', image: 'images/zigzag.png' },
    { name: 'Huggies(S size)', price: 55,category:'Beverages', image: 'images/huggies.png' },
    { name: 'Huggies(M size)', price: 65,category:'Beverages', image: 'images/huggies.png' },
    { name: 'Huggies(L size)', price: 75,category:'Beverages', image: 'images/huggies.png' },
    { name: 'Eveready Battery(1p)', price: 18,category:'Beverages', image: 'images/evereadyBattery.png' },
    { name: 'Panasonic Battery(1P)', price: 12, category:'Beverages',image: 'images/panasonicBattery.png' },
    { name: 'Eggs(4Pc)', price: 30,category:'Beverages', image: 'images/egg.png' },
    { name: 'Agar Batti Man Mandir(1pkt)', price: 10,category:'Beverages', image: 'images/AgarBattiManMandir.png' },
    { name: 'Agar Batti Amena(1pkt)', price: 10,category:'Beverages', image: 'images/amenaAgarbatti.jpg' },
    { name: 'Colgate(38gm)', price: 20,category:'Beverages', image: 'images/colgate.png' },
    { name: 'Colgate(16gm)', price: 10,category:'Beverages', image: 'images/colgate.png' },
    { name: 'Fevi kwik(1Pc)', price: 10,category:'Beverages', image: 'images/feviKwik.png' },
    { name: 'Jhama(1Pc)', price: 10,category:'Beverages', image: 'images/jhama.jpg' },
    { name: 'Glow and Lovely(1pkt)', price: 10,category:'Beverages', image: 'images/glow.jpg' },
    { name: 'Aladin killer(1pkt)', price: 20,category:'Beverages', image: 'images/aladinkiller.jpg' },
    { name: 'Gold Flake Premium(1Pkt)', price: 99,category:'Pan Corner', image: 'images/goldFlakePremium.png' },
    { name: 'Flake Excel(1Pkt)', price: 80,category:'Pan Corner', image: 'images/flakewills.png' },
    { name: 'Mint(1Pkt)', price: 99,category:'Pan Corner', image: 'images/mint.jpg' },
    { name: 'Mustard Oil Hansh(1L)', price: 180,category:'Masala & Oil', image: 'images/hansh1L.jpg' },
    { name: 'Mustard Oil Hansh(500ml)', price: 90,category:'Masala & Oil', image: 'images/hansh500mL.jpg' },
    { name: 'Mustard Oil Hansh(250ml)', price: 50,category:'Masala & Oil', image: 'images/hansh250mL.jpg' },
    { name: 'Anupam Mustard Oil(500mL)', price: 95,category:'Masala & Oil', image: 'images/' },
    { name: 'Refined Oil(1L)', price: 160,category:'Masala & Oil', image: 'images/refinedOil.png' },
    { name: 'Refined oil(500ml)', price: 80,category:'Masala & Oil', image: 'images/refinedOil.png' },
    { name: 'Refined Oil(250ml)', price: 40,category:'Masala & Oil', image: 'images/refinedOil.png' },
    { name: 'Achaar(250gm)', price: 80,category:'Masala & Oil', image: 'images/achaar.jpg' },
    { name: 'Achaar(50gm)', price: 20,category:'Masala & Oil', image: 'images/achaar.jpg' },
    { name: 'Garam Masala guta(50gm)', price: 75,category:'Masala & Oil', image: 'images/garamMasalaGuta.jpg' },
    { name: 'Garam Masala guta(10gm)', price: 10,category:'Masala & Oil', image: 'images/garamMasalaGutaSmall.jpg' },
    { name: 'Papad(70gm)', price: 35,category:'Masala & Oil', image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/319576911/RY/HX/HT/191477818/medium-udad-appalam-papad-250x250.png' },
    { name: 'EveryDay Meat Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/meatMasala.jpg' },
    { name: 'EveryDay Garam Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/garamMasala.jpg' },
    { name: 'EveryDay Chicken Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/chickenMasala.jpg' },
    { name: 'Jeera(50gm)', price: 25,category:'Masala & Oil', image: 'images/jeera.jpg' },
    { name: 'Kala Jeera(50gm)', price: 20,category:'Masala & Oil', image: 'images/kalaJeera.jpg' },
    { name: 'Meetha Jeera(50gm)', price: 20,category:'Masala & Oil', image: 'images/meethajeera.jpg' },
    { name: 'White cook salt(1kg)', price: 20,category:'Masala & Oil', image: 'images/salt.jpg' },
    { name: 'Borsola ChayPatti(250gm)', price: 120,category:'Masala & Oil', image: 'images/borsola.png' },
    { name: 'Nameri ChayPatti(25gm)', price: 10,category:'Masala & Oil', image: 'images/nameri.jpg' },
    { name: 'Harpic(200ml)', price: 46,category:'Cleaning Care', image: 'images/harpic.png' },
    { name: 'Surf Excel(500gm)', price: 68,category:'Cleaning Care', image: 'images/surfExcel.png' },
    { name: 'Nirma Blue(500gm)', price: 55,category:'Cleaning Care', image: 'images/nirmaBlue.png' },
    { name: 'Surf Excel Saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/surfExcelSoap.png' },
    { name: 'Ayna Dish wash(1p)', price: 10,category:'Cleaning Care', image: 'images/aynasoap.png' },
    { name: 'Heroine Saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/heroine.jpg' },
    { name: 'JK White saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/JK.png' },
    { name: 'Jasmine Oil(50ml)', price: 20,category:'Cleaning Care', image: 'images/jasmineOil.png' },
    { name: 'Detol(125mL)', price: 80,category:'Cleaning Care', image: 'images/detol125mL.png' },
    { name: 'Nirma Sabaan(1p)', price: 10,category:'Cleaning Care', image: 'images/nirmaSoap.jpg' },
    { name: 'Lifeboy Sabaan(1p)', price: 10,category:'Cleaning Care', image: 'images/LifeBoy.png' },
    { name: 'Coconut Oil(45mL)', price: 20,category:'Cleaning Care', image: 'images/coconutoilParachute.jpg' },
    { name: 'Nihar Oil(40mL)', price: 10,category:'Cleaning Care', image: 'images/NiharOil.png' },
    { name: 'Brahmol oil(45mL)', price: 20,category:'Cleaning Care', image: 'images/brahmolOil.png' },
    { name: 'Pears Saboon(1p)', price: 25,category:'Cleaning Care', image: 'images/pearsSoap.png' },
    { name: 'Lux Saboon(1p)', price: 40,category:'Cleaning Care', image: 'images/lux.png' },
    { name: 'Snuball Saboon(1p)', price: 45,category:'Cleaning Care', image: 'images/idashaban.jpg' },
    { name: 'Surf Excel(75g)', price: 10,category:'Cleaning Care', image: 'images/surfExcel.png' },
    { name: 'Detol Saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/detolSoap.png' },
    { name: 'Dabur Colgate(1p)', price: 10,category:'Cleaning Care', image: 'images/dabur.png' },
    { name: 'Comfort Morning fresh(210mL)', price: 58,category:'Cleaning Care', image: 'images/comfort.png' },
    { name: 'Almond Drops Oil(190mL)', price: 142,category:'Cleaning Care', image: 'images/almondOil.png' },
    { name: 'Ujala(50mL)', price: 10,category:'Cleaning Care', image: 'images/ujala.png' },
    { name: 'Shampoo(Clinic plus)(1pkt)', price: 1,category:'Cleaning Care', image: 'images/clinicPlusEgg.png' },
    { name: 'Shampoo(Dove)(1pkt)', price: 2,category:'Cleaning Care', image: 'images/dove.png' },
    { name: 'Phenyle Black(1btl)', price: 85, category:'Cleaning Care',image: 'images/phenyleBlack.jpg' },
    { name: 'Phenyle White(1btl)', price: 85,category:'Cleaning Care', image: 'images/phenyleWhite.jpg' },
    { name: 'Himalaya Face Wash(15mL)', price: 20,category:'Cleaning Care', image: 'images/HimalayaFacewash.png' },
    { name: 'Indica Hair color(1pkt)', price: 30,category:'Cleaning Care', image: 'images/indicaHairColor.png' },
    { name: 'Navaratna Oil(1pkt)', price: 1,category:'Cleaning Care', image: 'images/navaratnaOil.png' },
    { name: 'Gillette Guard(1P)', price: 25,category:'Cleaning Care', image: 'images/gilletteGuard.png' },
    { name: 'Gillete Guard Blade(10)', price: 30,category:'Cleaning Care', image: 'images/blade.jpg' },
    { name: 'Britania Marie(Big)', price: 40,category:'Bakery & Biscuits', image: 'images/britaniaBig.png' },
    { name: 'Britania Marie(Small)', price: 10,category:'Bakery & Biscuits', image: 'images/britaniaSmall.png' },
    { name: 'Marie Light(Big)', price: 40,category:'Bakery & Biscuits', image: 'images/marieLight.png' },
    { name: '20-20 Biscuit', price: 20,category:'Bakery & Biscuits', image: 'images/2020biscuit.png' },
    { name: 'Tiger Biscuit(1pc)', price: 5,category:'Bakery & Biscuits', image: 'https://imgs.search.brave.com/tk-BeOJOPlRfkiDKaDJYmaSeo2zzhLcnSKuHUb0yLoE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/OTcxL3N3ZWV0LWNy/aXNweS1hbmQtZGVs/aWNpb3VzLXNlbWkt/c29mdC10aWdlci1n/bHVjb3NlLWJpc2N1/aXRzLTM2NS5qcGc' },
    { name: 'Nutri Choice(1pkt)', price: 65,category:'Bakery & Biscuits', image: 'images/nutriChoice.png' },
    { name: 'Eat-Fit Digestive(175gm)', price: 40,category:'Bakery & Biscuits', image: 'images/eatFitDigestive.png' },
    { name: 'Maggie(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/maggie.png' },
    { name: 'Bikaji Kuch Kuch(200gm)', price: 65,category:'Bakery & Biscuits', image: 'images/bikajiKuchKuch.png' },
    { name: 'Kolkata Chana chur(200gm)', price: 62,category:'Bakery & Biscuits', image: 'images/kolkataChanaChur.png' },
    { name: 'Bikaji Bhujia(200gm)', price: 65,category:'Bakery & Biscuits', image: 'images/BikajiBhujia.png' },
    { name: 'Parle G(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/parleG.jpg' },
    { name: 'Rusk(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/rusk.jpg' },
];



// Cart data
const cart = [];

// DOM Elements
const storeDiv = document.getElementById('storeItems');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const itemTotal = document.getElementById('itemTotal');
const cartToggle = document.getElementById('cartToggle');
const closeCartBtn = document.getElementById('closeCart');
const notification = document.getElementById('notification');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartElement = document.getElementById('cart');
const cartEmpty = document.getElementById('cartEmpty');
const cartFull = document.getElementById('cartFull');
const continueShoppingBtn = document.getElementById('continueShopping');
const cartOverlay = document.getElementById('cartOverlay');

// Initialize Store
function initStore(filterCategory = 'all', searchTerm = '') {
  storeDiv.innerHTML = '';

  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'all' || 
                         item.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if(filteredItems.length === 0) {
    storeDiv.innerHTML = '<p style="padding:20px; text-align:center;">No items found.</p>';
    return;
  }

  filteredItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';

    let badgeHTML = item.badge ? `<span class="item-badge">${item.badge}</span>` : '';

    // Rating stars
    let stars = '';
    if(item.rating) {
      for(let i = 1; i <= 5; i++) {
        if(i <= Math.floor(item.rating)) stars += '<i class="fas fa-star"></i>';
        else if(i === Math.ceil(item.rating) && !Number.isInteger(item.rating)) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
      }
      stars = `<div class="item-rating">${stars} (${item.rating})</div>`;
    }

    div.innerHTML = `
      <div class="item-image-container">
        ${badgeHTML}
        <img src="${item.image}" alt="${item.name}" class="item-img">
      </div>
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
        ${stars}
        <div class="item-price">₹${item.price}</div>
        <div class="item-actions">
          <div class="quantity-control">
            <button class="qty-minus">-</button>
            <span>1</span>
            <button class="qty-plus">+</button>
          </div>
          <button class="add-to-cart-btn">Add</button>
        </div>
      </div>
    `;

    // Add event listeners to the buttons
    div.querySelector('.qty-minus').addEventListener('click', () => updateQuantity(div, -1));
    div.querySelector('.qty-plus').addEventListener('click', () => updateQuantity(div, 1));
    div.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(div));

    storeDiv.appendChild(div);
  });
}

// Update quantity for each product
function updateQuantity(itemElement, change) {
  const quantitySpan = itemElement.querySelector('.quantity-control span');
  let quantity = parseInt(quantitySpan.textContent);
  quantity += change;
  if(quantity < 1) quantity = 1;
  if(quantity > 10) quantity = 10;
  quantitySpan.textContent = quantity;
}

// Add product to cart
function addToCart(itemElement) {
  const name = itemElement.querySelector('.item-name').textContent;
  const price = parseInt(itemElement.querySelector('.item-price').textContent.replace('₹', ''));
  const quantity = parseInt(itemElement.querySelector('.quantity-control span').textContent);

  const existing = cart.find(c => c.name === name);
  if(existing) {
    existing.quantity += quantity;
  } else {
    cart.push({name, price, quantity});
  }

  updateCartUI();
  showNotification(`${quantity} ${name} added to cart`);
  itemElement.querySelector('.quantity-control span').textContent = '1';
  openCart();
}

// Update cart UI
function updateCartUI() {
  cartList.innerHTML = '';

  if(cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFull.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartFull.style.display = 'block';

    let total = 0;
    cart.forEach((item, index) => {
      const itemTotalPrice = item.price * item.quantity;
      total += itemTotalPrice;

      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name} × ${item.quantity}</div>
          <div class="cart-item-price">₹${itemTotalPrice}</div>
        </div>
        <button class="cart-item-remove">
          <i class="fas fa-trash"></i>
        </button>
      `;
      li.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(index));
      cartList.appendChild(li);
    });

    cartTotal.textContent = `₹${total}`;
    itemTotal.textContent = `₹${total}`;
  }

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('quickKartCart', JSON.stringify(cart));
}

// Remove item from cart by index
function removeFromCart(index) {
  const removed = cart.splice(index,1)[0];
  updateCartUI();
  showNotification(`${removed.name} removed from cart`);
}

// Show notification message
function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Cart toggle functions
function openCart() {
  document.body.classList.add('cart-open');
  cartElement.classList.add('open');
  cartOverlay.classList.add('show');
}

function closeCart() {
  document.body.classList.remove('cart-open');
  cartElement.classList.remove('open');
  cartOverlay.classList.remove('show');
}

// Event listeners
cartToggle.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
continueShoppingBtn.addEventListener('click', closeCart);

// Close cart when clicking outside
cartOverlay.addEventListener('click', closeCart);

// Prevent clicks inside cart from closing it
cartElement.addEventListener('click', function(e) {
  e.stopPropagation();
});

// Search filtering
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const activeBtn = document.querySelector('.category-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    initStore(category, searchTerm);
  }, 300);
});

// Category filtering
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.getAttribute('data-category');
    const searchTerm = searchInput.value.trim().toLowerCase();
    initStore(category, searchTerm);
  });
});

// Place order with WhatsApp
document.getElementById('orderBtn').addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();

  if(!name || !address || !phone || cart.length === 0) {
    showNotification("Please fill all details and add items to cart");
    return;
  }

  if(!/^\d{10}$/.test(phone)) {
    showNotification("Please enter a valid 10-digit phone number");
    return;
  }

  let message = `*New Order from QuickKart!*%0A%0A`;
  message += `*Customer Details:*%0AName: ${name}%0AAddress: ${address}%0APhone: ${phone}%0A%0A*Order Items:*%0A`;
  cart.forEach(item => {
    message += `- ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}%0A`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `%0A*Total: ₹${total}*%0A%0APlease confirm this order and provide delivery time. Thank you!`;

  const whatsappNumber = "918447122439"; // change to your WhatsApp number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, '_blank');
});

// Load cart from localStorage and initialize store on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedCart = JSON.parse(localStorage.getItem('quickKartCart'));
  if(savedCart && Array.isArray(savedCart)) {
    cart.push(...savedCart);
    updateCartUI();
  }
  initStore();
});