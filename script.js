// Sample products data
  
const items = [
    //{ name: 'Aata Ashirwaad (5kg)', price: 250, category:'Atta Rice & Daal', image: 'images/ashirwaad.png', rating: 4.5, badge: 'Best Seller' },
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
    { name: 'Eggs(4Pc)', price: 30,category:'Arra Rice & Daal', image: 'images/egg.png' },
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
    { name: 'Indane Gas(14kg)', price: 999,category:'Gass', image: 'images/indanegas.png' },


    { name: 'Almond(100gm)', price: 120,category:'Dry Fruits', image: 'images/almond.png' },
    { name: 'Kaaju Badam(100gm)', price: 120,category:'Dry Fruits', image: 'images/kajuBadam.png' },
    { name: 'Taalmisri(100gm)', price: 35,category:'Dry Fruits', image: 'images/talmisri.png' },
    { name: 'Kismis(80gm)', price: 60,category:'Dry Fruits', image: 'images/kismis.png' },
    { name: 'Khejur(400gm)', price: 230, category:'Dry Fruits',image: 'images/khejur.png' },

     { name: 'Huggies(S size)', price: 55,category:'Baby Care', image: 'images/huggies.png' },
    { name: 'Huggies(M size)', price: 65,category:'Baby Care', image: 'images/huggies.png' },
    { name: 'Huggies(L size)', price: 75,category:'Baby Care', image: 'images/huggies.png' },


    { name: 'Maxo(1pkt)', price: 29,category:'Maxo Killer & candle', image: 'images/maxo.jpg' },
    { name: 'zig Zag Brush(1P)', price: 25,category:'Daily Need', image: 'images/zigzag.png' },
    { name: 'Candle(1pkt)', price: 75,category:'Maxo Killer & candle', image: 'images/candle.jpg' },

    { name: 'Eveready Battery(1p)', price: 18,category:'Daily Need', image: 'images/evereadyBattery.png' },
    { name: 'Panasonic Battery(1P)', price: 12, category:'Daily Need',image: 'images/panasonicBattery.png' },
    { name: 'Agar Batti Man Mandir(1pkt)', price: 10,category:'Maxo Killer & candle', image: 'images/AgarBattiManMandir.png' },
    { name: 'Agar Batti Amena(1pkt)', price: 10,category:'Maxo Killer & candle', image: 'images/amenaAgarbatti.jpg' },
    { name: 'Colgate(38gm)', price: 20,category:'Daily Need', image: 'images/colgate.png' },
    { name: 'Colgate(16gm)', price: 10,category:'Daily Need', image: 'images/colgate.png' },
    { name: 'Fevi kwik(1Pc)', price: 10,category:'Daily Need', image: 'images/feviKwik.png' },
    { name: 'Aladin killer(1pkt)', price: 20,category:'Maxo Killer & candle', image: 'images/aladinkiller.jpg' },

    

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
    
    { name: 'Glow and Lovely(1pkt)', price: 10,category:'Personal Care', image: 'images/glow.jpg' },
    { name: 'Heroine Saboon(1p)', price: 10,category:'Personal Care', image: 'images/heroine.jpg' },
    { name: 'Jasmine Oil(50ml)', price: 20,category:'Personal Care', image: 'images/jasmineOil.png' },
    { name: 'Nirma Sabaan(1p)', price: 10,category:'Personal Care', image: 'images/nirmaSoap.jpg' },
    { name: 'Lifeboy Sabaan(1p)', price: 10,category:'Personal Care', image: 'images/LifeBoy.png' },
    { name: 'Coconut Oil(45mL)', price: 20,category:'Personal Care', image: 'images/coconutoilParachute.jpg' },
    { name: 'Nihar Oil(40mL)', price: 10,category:'Personal Care', image: 'images/NiharOil.png' },
    { name: 'Brahmol oil(45mL)', price: 20,category:'Personal Care', image: 'images/brahmolOil.png' },
    { name: 'Pears Saboon(1p)', price: 25,category:'Personal Care', image: 'images/pearsSoap.png' },
    { name: 'Lux Saboon(1p)', price: 40,category:'Personal Care', image: 'images/lux.png' },,
    { name: 'Detol Saboon(1p)', price: 10,category:'Personal Care', image: 'images/detolSoap.png' },
    { name: 'Dabur Colgate(1p)', price: 10,category:'Personal Care', image: 'images/dabur.png' },
    { name: 'Almond Drops Oil(190mL)', price: 142,category:'Personal Care', image: 'images/almondOil.png' },
    { name: 'Shampoo(Clinic plus)(1pkt)', price: 1,category:'Personal Care', image: 'images/clinicPlusEgg.png' },
    { name: 'Shampoo(Dove)(1pkt)', price: 2,category:'Personal Care', image: 'images/dove.png' },
    { name: 'Himalaya Face Wash(15mL)', price: 20,category:'Personal Care', image: 'images/HimalayaFacewash.png' },
    { name: 'Indica Hair color(1pkt)', price: 30,category:'Personal Care', image: 'images/indicaHairColor.png' },
    { name: 'Navaratna Oil(1pkt)', price: 1,category:'Personal Care', image: 'images/navaratnaOil.png' },
    { name: 'Gillette Guard(1P)', price: 25,category:'Personal Care', image: 'images/gilletteGuard.png' },
    { name: 'Gillete Guard Blade(10)', price: 30,category:'Personal Care', image: 'images/blade.jpg' },

    
    { name: 'Harpic(200ml)', price: 46,category:'Cleaning Care', image: 'images/harpic.png' },
    { name: 'Surf Excel(500gm)', price: 68,category:'Cleaning Care', image: 'images/surfExcel.png' },
    { name: 'Nirma Blue(500gm)', price: 55,category:'Cleaning Care', image: 'images/nirmaBlue.png' },
    { name: 'Surf Excel Saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/surfExcelSoap.png' },
    { name: 'Ayna Dish wash(1p)', price: 10,category:'Cleaning Care', image: 'images/aynasoap.png' },
    { name: 'JK White saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/JK.png' },
    { name: 'Comfort Morning fresh(210mL)', price: 58,category:'Cleaning Care', image: 'images/comfort.png' },
    { name: 'Detol(125mL)', price: 80,category:'Cleaning Care', image: 'images/detol125mL.png' },
    { name: 'Ujala(50mL)', price: 10,category:'Cleaning Care', image: 'images/ujala.png' },
    { name: 'Phenyle Black(1btl)', price: 85, category:'Cleaning Care',image: 'images/phenyleBlack.jpg' },
    { name: 'Phenyle White(1btl)', price: 85,category:'Cleaning Care', image: 'images/phenyleWhite.jpg' },
    { name: 'Snuball Saboon(1p)', price: 45,category:'Cleaning Care', image: 'images/idashaban.jpg' },
    { name: 'Surf Excel(75g)', price: 10,category:'Cleaning Care', image: 'images/surfExcel.png' },
    { name: 'Jhama(1Pc)', price: 10,category:'Cleaning Care', image: 'images/jhama.jpg' },
    
    
    { name: 'Sweat Toast(Big)', price: 49,category:'Bakery & Biscuits', image: 'images/sweatToast.jpg' },
    { name: 'Sweat Toast(Small)', price: 30,category:'Bakery & Biscuits', image: 'images/sweatToast.jpg' },
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

const getLocationBtn = document.getElementById('getLocationBtn');
const locationDisplay = document.getElementById('locationDisplay');
const customerAddressInput = document.getElementById('customerAddress');
const userLatInput = document.getElementById('userLat');
const userLngInput = document.getElementById('userLng');

// *** FIXED DUKAN LOCATION ***
const storeLocation = {
  lat: 26.6468571, // Yahan apni dukan ki latitude daalein
  lng: 92.0754806  // Yahan apni dukan ki longitude daalein
};

// Convert degrees to radians helper
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Calculate distance (in km) between two lat/lng points using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

    div.innerHTML = `
      <div class="item-image-container">
        ${badgeHTML}
        <img src="${item.image}" alt="${item.name}" class="item-img">
      </div>
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
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

    div.querySelector('.qty-minus').addEventListener('click', () => updateQuantity(div, -1));
    div.querySelector('.qty-plus').addEventListener('click', () => updateQuantity(div, 1));
    div.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(div));

    storeDiv.appendChild(div);
  });
}

// Update quantity
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

// Remove from cart
function removeFromCart(index) {
  const removed = cart.splice(index,1)[0];
  updateCartUI();
  showNotification(`${removed.name} removed from cart`);
}

// Notification
function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Cart toggle
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
cartOverlay.addEventListener('click', closeCart);
cartElement.addEventListener('click', e => e.stopPropagation());

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

// Make customerAddressInput readonly to prevent manual input
customerAddressInput.setAttribute('readonly', true);

// Disable order button initially till location valid
const orderBtn = document.getElementById('orderBtn');
orderBtn.disabled = true;

// Place order with WhatsApp (with location link)
orderBtn.addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const address = customerAddressInput.value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const lat = userLatInput.value.trim();
  const lng = userLngInput.value.trim();

  if(!name || !address || !phone || cart.length === 0) {
    showNotification("Please fill all details and add items to cart");
    return;
  }

  if(!/^\d{10}$/.test(phone)) {
    showNotification("Please enter a valid 10-digit phone number");
    return;
  }

  let message = `*New Order from QuickKart!*%0A%0A`;
  message += `*Customer Details:*%0AName: ${name}%0AAddress: ${address}%0APhone: ${phone}%0A`;

  if(lat && lng) {
    message += `Location: https://www.google.com/maps?q=${lat},${lng}%0A`;
  }

  message += `%0A*Order Items:*%0A`;
  cart.forEach(item => {
    message += `- ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}%0A`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `%0A*Total: ₹${total}*%0A%0APlease confirm this order and provide delivery time. Thank you!`;

  const whatsappNumber = "919716940448"; // Change to your WhatsApp number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, '_blank');
});

// Get user location and check distance from store
getLocationBtn.addEventListener('click', () => {
  locationDisplay.textContent = 'Fetching location...';
  orderBtn.disabled = true; // Disable order till location confirmed

  if (!navigator.geolocation) {
    locationDisplay.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Calculate distance from store
      const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

      if(distance > 5) {
        locationDisplay.textContent = `Sorry, you are ${distance.toFixed(2)} km away. Delivery available only within 5 km radius.`;
        customerAddressInput.value = '';
        userLatInput.value = '';
        userLngInput.value = '';
        orderBtn.disabled = true; // Disable order button
        return;
      }

      // Store coordinates in hidden inputs
      userLatInput.value = lat;
      userLngInput.value = lng;

      // Reverse geocode using OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if(data && data.address) {
            const addr = data.address;
            const parts = [
              addr.house_number || '',
              addr.road || '',
              addr.suburb || '',
              addr.city || addr.town || addr.village || '',
              addr.state || '',
              addr.postcode || '',
              addr.country || ''
            ].filter(Boolean);
            const fullAddress = parts.join(', ');

            customerAddressInput.value = fullAddress;
            locationDisplay.textContent = 'Location fetched and address filled!';
            orderBtn.disabled = false; // Enable order button now
          } else {
            locationDisplay.textContent = 'Could not determine address.';
            orderBtn.disabled = true;
          }
        })
        .catch(() => {
          locationDisplay.textContent = 'Failed to fetch address.';
          orderBtn.disabled = true;
        });
    },
    error => {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          locationDisplay.textContent = 'Permission denied. Please allow location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          locationDisplay.textContent = 'Location unavailable.';
          break;
        case error.TIMEOUT:
          locationDisplay.textContent = 'Location request timed out.';
          break;
        default:
          locationDisplay.textContent = 'An unknown error occurred.';
      }
      orderBtn.disabled = true;
    }
  );
});

// Load cart from localStorage and initialize store
document.addEventListener('DOMContentLoaded', () => {
  const savedCart = JSON.parse(localStorage.getItem('quickKartCart'));
  if(savedCart && Array.isArray(savedCart)) {
    cart.push(...savedCart);
    updateCartUI();
  }
  initStore();
});

const phoneInput = document.getElementById("customerPhone");

phoneInput.addEventListener("input", function () {
  // Only allow digits, remove everything else
  this.value = this.value.replace(/\D/g, "");

  // Limit to max 10 digits (for safety)
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
  }
});
