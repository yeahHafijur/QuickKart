// ======================
// Firebase Initialization
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyBieX9ymlSZH_nGc17YukhmrIvNOpBzF_M",
  authDomain: "quickkart-shop-status.firebaseapp.com",
  databaseURL: "https://quickkart-shop-status-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quickkart-shop-status",
  storageBucket: "quickkart-shop-status.appspot.com",
  messagingSenderId: "603872368115",
  appId: "1:603872368115:web:3ed732f3c7afe934ee2e86"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const shopStatusRef = db.ref('shopStatus');

// ======================
// Store Configuration
// ======================
// Sample products data (your existing products array)
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
    { name: 'Johnsonis baby oil(50mL) ', price:75 ,category:'Baby Care', image: 'images/babyOil.png' },
    { name: 'Johnsonis baby soap(25gm)', price:20 ,category:'Baby Care', image: 'images/babySoap.png' },
    { name: 'Himalaya Baby Powder(30gm)', price:30 ,category:'Baby Care', image: 'images/babyPowder.png' },
    


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

    { name: 'C to C type cable(1m) samsung', price: 150,category:'Electronics', image: 'images/' },
    { name: 'iPhone Data Cable(1m)', price: 150,category:'Electronics', image: 'images/' },
    { name: 'Samsung 25W type C addopter', price:520 ,category:'Electronics', image: 'images/' },
    { name: '3 in 1 Black Kat Data cable', price:210 ,category:'Electronics', image: 'images/' },
    { name: '120W B type Data Cable', price:150 ,category:'Electronics', image: 'images/' },
    { name: '120W C type Data Cable', price:150 ,category:'Electronics', image: 'images/' },
    { name: 'Black Kat C type Data Cable', price:60 ,category:'Electronics', image: 'images/' },
    { name: 'Black Kat B type Data Cable', price:60 ,category:'Electronics', image: 'images/' },
    { name: 'Fast Charging Cable C type', price: 170,category:'Electronics', image: 'images/' },
    { name: 'Fast Charging Cable B type', price:170 ,category:'Electronics', image: 'images/' },
    { name: 'Car Charger', price:280 ,category:'Electronics', image: 'images/' },
    { name: 'Black Kat wireless blutooth Speaker', price:399 ,category:'Electronics', image: 'images/' },
    { name: 'realme Buds Wireless 3 Neo', price:520 ,category:'Electronics', image: 'images/' },
    { name: 'Boat Rockerz 255 blutooth earphone', price:520 ,category:'Electronics', image: 'images/' },



    { name: 'Graph Book(Pages 10)', price:20 ,category:'Stationary', image: 'images/' },
    { name: 'Plain Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
    { name: 'Plain Notebook(Page 100)', price:50 ,category:'Stationary', image: 'images/' },
    { name: 'Role Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
    { name: 'Role Notebook(Page 100)', price:50 ,category:'Stationary', image: 'images/' },
    { name: 'English Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
    { name: 'Flair Writo-meter Ball Pen(Black)', price: 20,category:'Stationary', image: 'images/' },
    { name: 'Flair Writo-meter Ball Pen(blue)', price: 20,category:'Stationary', image: 'images/' },
    { name: 'Apsara Pencil(1 box)', price: 49,category:'Stationary', image: 'images/' },
    { name: 'Apsara Eraser(2 pc)', price: 10,category:'Stationary', image: 'images/' },
    { name: 'Apsara Sharpner(2 pc)', price: 10,category:'Stationary', image: 'images/' },
    { name: 'Permanent Marker Pen ', price: 15,category:'Stationary', image: 'images/' },
    { name: 'Fevicol MR (20gm)', price: 10,category:'Stationary', image: 'images/' },
    { name: 'Elkos Pen(Pack of 5)', price: 30,category:'Stationary', image: 'images/' },
];

const cart = [];
const storeLocation = { lat: 26.6468571, lng: 92.0754806 };
let isShopOpen = true;

// ======================
// DOM Elements
// ======================
const elements = {
    storeDiv: document.getElementById('storeItems'),
    cartList: document.getElementById('cartList'),
    cartCount: document.getElementById('cartCount'),
    cartTotal: document.getElementById('cartTotal'),
    itemTotal: document.getElementById('itemTotal'),
    cartToggle: document.getElementById('cartToggle'),
    closeCartBtn: document.getElementById('closeCart'),
    notification: document.getElementById('notification'),
    searchInput: document.getElementById('searchInput'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    cartElement: document.getElementById('cart'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartFull: document.getElementById('cartFull'),
    continueShoppingBtn: document.getElementById('continueShopping'),
    cartOverlay: document.getElementById('cartOverlay'),
    getLocationBtn: document.getElementById('getLocationBtn'),
    locationDisplay: document.getElementById('locationDisplay'),
    customerAddressInput: document.getElementById('customerAddress'),
    userLatInput: document.getElementById('userLat'),
    userLngInput: document.getElementById('userLng'),
    orderBtn: document.getElementById('orderBtn'),
    phoneInput: document.getElementById("customerPhone"),
    shopStatusToggle: document.getElementById('shopStatusToggle'),
    shopStatusText: document.getElementById('shopStatusText'),
    customerNameInput: document.getElementById('customerName')
};

// ======================
// Firebase Shop Status
// ======================
function setupShopStatus() {
    shopStatusRef.on('value', (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
            isShopOpen = statusData.isOpen;
            elements.shopStatusToggle.checked = isShopOpen;
            updateShopStatus(isShopOpen);
        }
    });

    elements.shopStatusToggle.addEventListener('change', async function() {
        const password = prompt("Owner Access Required\nEnter password:");
        
        if (password === "bismillah") {
            try {
                const newStatus = this.checked;
                await shopStatusRef.set({
                    isOpen: newStatus,
                    lastUpdated: firebase.database.ServerValue.TIMESTAMP
                });
                showNotification(`Shop is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
            } catch (error) {
                console.error("Status update failed:", error);
                this.checked = !this.checked;
                showNotification("Failed to update status", 'error');
            }
        } else {
            this.checked = !this.checked;
            if (password !== null) {
                showNotification("Wrong password!", 'error');
            }
        }
    });
}

function updateShopStatus(isOpen) {
    if (isOpen) {
        document.body.classList.remove('shop-closed');
        elements.shopStatusText.textContent = "Open";
        elements.shopStatusText.style.color = "var(--primary)";
    } else {
        document.body.classList.add('shop-closed');
        elements.shopStatusText.textContent = "Closed";
        elements.shopStatusText.style.color = "#ff4444";
        closeCart();
    }
    localStorage.setItem('quickKartShopStatus', isOpen ? 'open' : 'closed');
}

// ======================
// Store Functions
// ======================
function initStore(filterCategory = 'all', searchTerm = '') {
    elements.storeDiv.innerHTML = '';

    const filteredItems = items.filter(item => {
        const matchesCategory = filterCategory === 'all' || 
                             item.category.toLowerCase() === filterCategory.toLowerCase();
        const matchesSearch = searchTerm === '' || 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if(filteredItems.length === 0) {
        elements.storeDiv.innerHTML = '<p style="padding:20px; text-align:center;">No items found.</p>';
        return;
    }

    filteredItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        let badgeHTML = item.badge ? `<span class="item-badge">${item.badge}</span>` : '';
        const imageHTML = item.image ? 
            `<img src="${item.image}" alt="${item.name}" class="item-img">` :
            '<div class="item-img-placeholder"><i class="fas fa-box-open"></i></div>';

        div.innerHTML = `
            <div class="item-image-container">
                ${badgeHTML}
                ${imageHTML}
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

        elements.storeDiv.appendChild(div);
    });
}

// ======================
// Cart Functions
// ======================
function addToCart(itemElement) {
    if (!isShopOpen) {
        showNotification("Shop is currently closed. Orders not accepted.", 'error');
        return;
    }

    const name = itemElement.querySelector('.item-name').textContent;
    const price = parseInt(itemElement.querySelector('.item-price').textContent.replace('₹', ''));
    const quantity = parseInt(itemElement.querySelector('.quantity-control span').textContent);

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    updateCartUI();
    showNotification(`${quantity} ${name} added to cart`);
    itemElement.querySelector('.quantity-control span').textContent = '1';
    openCart();
}

function updateCartUI() {
    elements.cartList.innerHTML = '';

    if (cart.length === 0) {
        elements.cartEmpty.style.display = 'block';
        elements.cartFull.style.display = 'none';
    } else {
        elements.cartEmpty.style.display = 'none';
        elements.cartFull.style.display = 'block';

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
            elements.cartList.appendChild(li);
        });

        // Update item total (without delivery)
        elements.itemTotal.textContent = `₹${total}`;
        
        // Check if delivery fee is already calculated
        const deliveryFeeText = document.getElementById('deliveryFee').textContent;
        if (deliveryFeeText && deliveryFeeText !== 'FREE' && !deliveryFeeText.includes('Not Available')) {
            const deliveryFee = parseInt(deliveryFeeText.replace('₹', ''));
            elements.cartTotal.textContent = `₹${total + deliveryFee}`;
        } else {
            elements.cartTotal.textContent = `₹${total}`;
        }
    }

    elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('quickKartCart', JSON.stringify(cart));
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartUI();
    showNotification(`${removedItem.name} removed from cart`);
}

// ======================
// Location & Delivery
// ======================
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

elements.getLocationBtn.addEventListener('click', () => {
    elements.locationDisplay.textContent = 'Fetching location...';
    elements.orderBtn.disabled = true;

    if (!navigator.geolocation) {
        elements.locationDisplay.textContent = 'Geolocation not supported by your browser';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

            // Update delivery fee based on distance
            if (distance > 5) {
                elements.locationDisplay.textContent = `Sorry, delivery not available beyond 5 km (You are ${distance.toFixed(2)} km away)`;
                document.getElementById('deliveryFee').textContent = 'Not Available';
                elements.customerAddressInput.value = '';
                elements.userLatInput.value = '';
                elements.userLngInput.value = '';
                elements.orderBtn.disabled = true;
            } else {
                const deliveryFee = Math.round(distance * 5); // ₹5 per km
                document.getElementById('deliveryFee').textContent = `₹${deliveryFee}`;
                
                // Update total with delivery fee
                const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                elements.cartTotal.textContent = `₹${cartTotal + deliveryFee}`;
                
                elements.userLatInput.value = lat;
                elements.userLngInput.value = lng;

                fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data?.address) {
                            const addr = data.address;
                            const parts = [
                                addr.house_number, addr.road, addr.suburb,
                                addr.city || addr.town || addr.village,
                                addr.state, addr.postcode, addr.country
                            ].filter(Boolean);
                            elements.customerAddressInput.value = parts.join(', ');
                            elements.locationDisplay.textContent = 'Location fetched! Delivery fee calculated.';
                            elements.orderBtn.disabled = false;
                        } else {
                            elements.locationDisplay.textContent = 'Could not determine address';
                        }
                    })
                    .catch(() => {
                        elements.locationDisplay.textContent = 'Failed to fetch address details';
                    });
            }
        },
        error => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    elements.locationDisplay.textContent = 'Permission denied. Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    elements.locationDisplay.textContent = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    elements.locationDisplay.textContent = 'The request to get location timed out.';
                    break;
                default:
                    elements.locationDisplay.textContent = 'An unknown error occurred.';
            }
            elements.orderBtn.disabled = true;
        }
    );
});

// ======================
// Order Processing
// ======================
elements.orderBtn.addEventListener('click', () => {
    if (!isShopOpen) {
        showNotification("Cannot place orders when shop is closed", 'error');
        return;
    }

    const name = elements.customerNameInput.value.trim();
    const address = elements.customerAddressInput.value.trim();
    const phone = elements.phoneInput.value.trim();
    const lat = elements.userLatInput.value.trim();
    const lng = elements.userLngInput.value.trim();

    if (!name || !address || !phone || cart.length === 0) {
        showNotification("Please fill all details and add items to cart", 'error');
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        showNotification("Please enter a valid 10-digit phone number", 'error');
        return;
    }

    // Check if delivery is available
    const deliveryFeeText = document.getElementById('deliveryFee').textContent;
    if (deliveryFeeText.includes('Not Available')) {
        showNotification("Delivery not available for your location", 'error');
        return;
    }

    // Calculate delivery fee (₹5 per km)
    let deliveryFee = 0;
    if (deliveryFeeText !== 'FREE') {
        deliveryFee = parseInt(deliveryFeeText.replace('₹', '')) || 0;
    }

    let message = `*New Order from QuickKart!*%0A%0A`;
    message += `*Customer Details:*%0AName: ${name}%0AAddress: ${address}%0APhone: ${phone}%0A`;
    
    if (lat && lng) {
        message += `Location: https://www.google.com/maps?q=${lat},${lng}%0A`;
    }

    message += `%0A*Order Items:*%0A`;
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}%0A`;
    });
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0A*Subtotal: ₹${subtotal}*%0A`;
    message += `*Delivery Fee: ₹${deliveryFee}*%0A`;
    message += `*Total: ₹${subtotal + deliveryFee}*%0A%0APlease confirm this order. Thank you!`;

    const whatsappNumber = "919716940448"; // Replace with your number
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    // Optional: Clear cart after order
    cart.length = 0;
    updateCartUI();
    closeCart();
});

// ======================
// UI Functions
// ======================
function showNotification(msg, type = 'success') {
    elements.notification.textContent = msg;
    elements.notification.className = `quickkart-notification show ${type}`;
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

function openCart() {
    document.body.classList.add('cart-open');
    elements.cartElement.classList.add('open');
    elements.cartOverlay.classList.add('show');
}

function closeCart() {
    document.body.classList.remove('cart-open');
    elements.cartElement.classList.remove('open');
    elements.cartOverlay.classList.remove('show');
}

function updateQuantity(itemElement, change) {
    const quantitySpan = itemElement.querySelector('.quantity-control span');
    let quantity = parseInt(quantitySpan.textContent);
    quantity += change;
    if (quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;
    quantitySpan.textContent = quantity;
}

// ======================
// Event Listeners
// ======================
function setupEventListeners() {
    elements.cartToggle.addEventListener('click', openCart);
    elements.closeCartBtn.addEventListener('click', closeCart);
    elements.continueShoppingBtn.addEventListener('click', closeCart);
    elements.cartOverlay.addEventListener('click', closeCart);
    elements.cartElement.addEventListener('click', e => e.stopPropagation());

    // Search with debouncing
    let searchTimer;
    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            const activeBtn = document.querySelector('.category-btn.active');
            const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
            initStore(category, searchTerm);
        }, 300);
    });

    // Category filtering
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            initStore(category, searchTerm);
        });
    });

    // Phone number validation
    elements.phoneInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "");
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // Make address input readonly
    elements.customerAddressInput.setAttribute('readonly', true);
}

// ======================
// Initialization
// ======================
function initializeApp() {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('quickKartCart'));
    if (savedCart && Array.isArray(savedCart)) {
        cart.push(...savedCart);
        updateCartUI();
    }

    // Load shop status from localStorage as fallback
    const localStatus = localStorage.getItem('quickKartShopStatus');
    if (localStatus) {
        isShopOpen = localStatus === 'open';
        elements.shopStatusToggle.checked = isShopOpen;
        updateShopStatus(isShopOpen);
    }

    // Initialize store
    initStore();

    // Setup Firebase shop status
    setupShopStatus();

    // Setup all event listeners
    setupEventListeners();

    // Disable order button initially
    elements.orderBtn.disabled = true;
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);