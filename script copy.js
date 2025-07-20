// // Wait for DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   // DOM Elements
//   const storeDiv = document.getElementById('storeItems');
//   const popularItemsDiv = document.getElementById('popularItems');
  
//   // Check if elements exist
//   if (!storeDiv || !popularItemsDiv) {
//     console.error("Store containers not found!");
//     return;
//   }

//   // Products array
//   // Sample products data (your existing products array)
//  const items = [
//     //{ name: 'Aata Ashirwaad (5kg)', price: 250, category:'Atta Rice & Daal', image: 'images/ashirwaad.png', rating: 4.5, badge: 'Best Seller' },
//     { name: 'Daal (1kg)', price: 99,category:'Atta Rice & Daal', image: 'images/daal.png', rating: 4.0, badge: 'Popular' },
//     { name: 'Sugar (1kg)', price: 49,category:'Atta Rice & Daal', image: 'https://imgs.search.brave.com/_3uakTkU_af6b0KhyeXE4Xlnv1-Pca02WwE2UtZ5snA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9waWxl/LXN1Z2FyLTEzNDE5/MDQ4LmpwZw', rating: 3.8 },
//     { name: 'Soozi(500gm)', price: 30,category:'Atta Rice & Daal', image: 'images/soozi.png' },
//     { name: 'Soozi(250gm)', price: 15,category:'Atta Rice & Daal', image: 'images/soozi.png' },
//     { name: 'Shamai(100gm)', price: 10,category:'Atta Rice & Daal', image: 'images/shamai.png' },
//     { name: 'Soyabean(250gm)', price: 30,category:'Atta Rice & Daal', image: 'images/soyabean.png' },
//     { name: 'Matar Kalai(500gm)', price: 40,category:'Atta Rice & Daal', image: 'images/whitematar.png' },
//     { name: 'Mashoor Dal(500gm)', price: 55,category:'Atta Rice & Daal', image: 'images/daal.png' },
//     { name: 'Boot Kalai(500gm)', price: 25,category:'Atta Rice & Daal', image: 'images/bootkalai.png' },
//     { name: 'Chira(500gm)', price: 25,category:'Atta Rice & Daal', image: 'images/chira.png' },
//     { name: 'Muta Rice(1kg)', price: 35,category:'Atta Rice & Daal', image: 'images/mutarice.png' },
//     { name: 'Basmati Rice(1kg)', price: 45,category:'Atta Rice & Daal', image: 'images/pulaorice.png' },
//     { name: 'Assam king Pulao Rice(1kg)', price: 45,category:'Atta Rice & Daal', image: 'images/chawal.png' },
//     { name: 'Eggs(4Pc)', price: 30,category:'Arra Rice & Daal', image: 'images/egg.png' },
//     { name: 'Milk (160ml)', price: 10,category:'Dairy', image: 'images/milk.png', rating: 4.4 },

//     { name: 'Hydrous(500 ml)', price: 10, category:'Cold Drinks & Juices', image: 'images/hydrous.png' },
//     { name: 'ORSL(200 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/ORSL.png' },
//     { name: 'Maza(200 ml)', price: 10,category:'Cold Drinks & Juices', image: 'images/maza.jpg' },
//     { name: 'Sting(250 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/sting.png' },
//     { name: 'Sprite(200 ml)', price: 20,category:'Cold Drinks & Juices', image: 'images/sprite.png' },
//     { name: 'Puro Mango Drink(1L)', price: 70,category:'Cold Drinks & Juices', image: 'images/PuroMango.png' },
//     { name: 'Mango Drink(2L)', price: 110,category:'Cold Drinks & Juices', image: 'images/mango2L.png' },
//     { name: 'Drupe Lemon Flavour(160ml)', price: 10,category:'Cold Drinks & Juices', image: 'images/drupe.jpg' },
//     { name: 'Fanta(750ml)', price: 40,category:'Cold Drinks & Juices', image: 'images/fanta.png' },
//     { name: 'Amul kool(150ml)', price: 25,category:'Cold Drinks & Juices', image: 'images/amulKool.png' },
//     { name: 'Indane Gas(14kg)', price: 999,category:'Gass', image: 'images/indanegas.png' },


//     { name: 'Almond(100gm)', price: 120,category:'Dry Fruits', image: 'images/almond.png' },
//     { name: 'Kaaju Badam(100gm)', price: 120,category:'Dry Fruits', image: 'images/kajuBadam.png' },
//     { name: 'Taalmisri(100gm)', price: 35,category:'Dry Fruits', image: 'images/talmisri.png' },
//     { name: 'Kismis(80gm)', price: 60,category:'Dry Fruits', image: 'images/kismis.png' },
//     { name: 'Khejur(400gm)', price: 230, category:'Dry Fruits',image: 'images/khejur.png' },

//      { name: 'Huggies(S size)', price: 55,category:'Baby Care', image: 'images/huggies.png' },
//     { name: 'Huggies(M size)', price: 65,category:'Baby Care', image: 'images/huggies.png' },
//     { name: 'Huggies(L size)', price: 75,category:'Baby Care', image: 'images/huggies.png' },


//     { name: 'Maxo(1pkt)', price: 29,category:'Maxo Killer & candle', image: 'images/maxo.jpg' },
//     { name: 'zig Zag Brush(1P)', price: 25,category:'Daily Need', image: 'images/zigzag.png' },
//     { name: 'Candle(1pkt)', price: 75,category:'Maxo Killer & candle', image: 'images/candle.jpg' },

//     { name: 'Eveready Battery(1p)', price: 18,category:'Daily Need', image: 'images/evereadyBattery.png' },
//     { name: 'Panasonic Battery(1P)', price: 12, category:'Daily Need',image: 'images/panasonicBattery.png' },
//     { name: 'Agar Batti Man Mandir(1pkt)', price: 10,category:'Maxo Killer & candle', image: 'images/AgarBattiManMandir.png' },
//     { name: 'Agar Batti Amena(1pkt)', price: 10,category:'Maxo Killer & candle', image: 'images/amenaAgarbatti.jpg' },
//     { name: 'Colgate(38gm)', price: 20,category:'Daily Need', image: 'images/colgate.png' },
//     { name: 'Colgate(16gm)', price: 10,category:'Daily Need', image: 'images/colgate.png' },
//     { name: 'Fevi kwik(1Pc)', price: 10,category:'Daily Need', image: 'images/feviKwik.png' },
//     { name: 'Aladin killer(1pkt)', price: 20,category:'Maxo Killer & candle', image: 'images/aladinkiller.jpg' },

    

//     { name: 'Gold Flake Premium(1Pkt)', price: 99,category:'Pan Corner', image: 'images/goldFlakePremium.png' },
//     { name: 'Flake Excel(1Pkt)', price: 80,category:'Pan Corner', image: 'images/flakewills.png' },
//     { name: 'Mint(1Pkt)', price: 99,category:'Pan Corner', image: 'images/mint.jpg' },


//     { name: 'Mustard Oil Hansh(1L)', price: 180,category:'Masala & Oil', image: 'images/hansh1L.jpg' },
//     { name: 'Mustard Oil Hansh(500ml)', price: 90,category:'Masala & Oil', image: 'images/hansh500mL.jpg' },
//     { name: 'Mustard Oil Hansh(250ml)', price: 50,category:'Masala & Oil', image: 'images/hansh250mL.jpg' },
//     { name: 'Anupam Mustard Oil(500mL)', price: 95,category:'Masala & Oil', image: 'images/' },
//     { name: 'Refined Oil(1L)', price: 160,category:'Masala & Oil', image: 'images/refinedOil.png' },
//     { name: 'Refined oil(500ml)', price: 80,category:'Masala & Oil', image: 'images/refinedOil.png' },
//     { name: 'Refined Oil(250ml)', price: 40,category:'Masala & Oil', image: 'images/refinedOil.png' },
//     { name: 'Achaar(250gm)', price: 80,category:'Masala & Oil', image: 'images/achaar.jpg' },
//     { name: 'Achaar(50gm)', price: 20,category:'Masala & Oil', image: 'images/achaar.jpg' },
//     { name: 'Garam Masala guta(50gm)', price: 75,category:'Masala & Oil', image: 'images/garamMasalaGuta.jpg' },
//     { name: 'Garam Masala guta(10gm)', price: 10,category:'Masala & Oil', image: 'images/garamMasalaGutaSmall.jpg' },
//     { name: 'Papad(70gm)', price: 35,category:'Masala & Oil', image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/319576911/RY/HX/HT/191477818/medium-udad-appalam-papad-250x250.png' },
//     { name: 'EveryDay Meat Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/meatMasala.jpg' },
//     { name: 'EveryDay Garam Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/garamMasala.jpg' },
//     { name: 'EveryDay Chicken Masala(1pkt)', price: 10,category:'Masala & Oil', image: 'images/chickenMasala.jpg' },
//     { name: 'Jeera(50gm)', price: 25,category:'Masala & Oil', image: 'images/jeera.jpg' },
//     { name: 'Kala Jeera(50gm)', price: 20,category:'Masala & Oil', image: 'images/kalaJeera.jpg' },
//     { name: 'Meetha Jeera(50gm)', price: 20,category:'Masala & Oil', image: 'images/meethajeera.jpg' },
//     { name: 'White cook salt(1kg)', price: 20,category:'Masala & Oil', image: 'images/salt.jpg' },
//     { name: 'Borsola ChayPatti(250gm)', price: 120,category:'Masala & Oil', image: 'images/borsola.png' },
//     { name: 'Nameri ChayPatti(25gm)', price: 10,category:'Masala & Oil', image: 'images/nameri.jpg' },
    
//     { name: 'Glow and Lovely(1pkt)', price: 10,category:'Personal Care', image: 'images/glow.jpg' },
//     { name: 'Heroine Saboon(1p)', price: 10,category:'Personal Care', image: 'images/heroine.jpg' },
//     { name: 'Jasmine Oil(50ml)', price: 20,category:'Personal Care', image: 'images/jasmineOil.png' },
//     { name: 'Nirma Sabaan(1p)', price: 10,category:'Personal Care', image: 'images/nirmaSoap.jpg' },
//     { name: 'Lifeboy Sabaan(1p)', price: 10,category:'Personal Care', image: 'images/LifeBoy.png' },
//     { name: 'Coconut Oil(45mL)', price: 20,category:'Personal Care', image: 'images/coconutoilParachute.jpg' },
//     { name: 'Nihar Oil(40mL)', price: 10,category:'Personal Care', image: 'images/NiharOil.png' },
//     { name: 'Brahmol oil(45mL)', price: 20,category:'Personal Care', image: 'images/brahmolOil.png' },
//     { name: 'Pears Saboon(1p)', price: 25,category:'Personal Care', image: 'images/pearsSoap.png' },
//     { name: 'Lux Saboon(1p)', price: 40,category:'Personal Care', image: 'images/lux.png' },,
//     { name: 'Detol Saboon(1p)', price: 10,category:'Personal Care', image: 'images/detolSoap.png' },
//     { name: 'Dabur Colgate(1p)', price: 10,category:'Personal Care', image: 'images/dabur.png' },
//     { name: 'Almond Drops Oil(190mL)', price: 142,category:'Personal Care', image: 'images/almondOil.png' },
//     { name: 'Shampoo(Clinic plus)(1pkt)', price: 1,category:'Personal Care', image: 'images/clinicPlusEgg.png' },
//     { name: 'Shampoo(Dove)(1pkt)', price: 2,category:'Personal Care', image: 'images/dove.png' },
//     { name: 'Himalaya Face Wash(15mL)', price: 20,category:'Personal Care', image: 'images/HimalayaFacewash.png' },
//     { name: 'Indica Hair color(1pkt)', price: 30,category:'Personal Care', image: 'images/indicaHairColor.png' },
//     { name: 'Navaratna Oil(1pkt)', price: 1,category:'Personal Care', image: 'images/navaratnaOil.png' },
//     { name: 'Gillette Guard(1P)', price: 25,category:'Personal Care', image: 'images/gilletteGuard.png' },
//     { name: 'Gillete Guard Blade(10)', price: 30,category:'Personal Care', image: 'images/blade.jpg' },

    
//     { name: 'Harpic(200ml)', price: 46,category:'Cleaning Care', image: 'images/harpic.png' },
//     { name: 'Surf Excel(500gm)', price: 68,category:'Cleaning Care', image: 'images/surfExcel.png' },
//     { name: 'Nirma Blue(500gm)', price: 55,category:'Cleaning Care', image: 'images/nirmaBlue.png' },
//     { name: 'Surf Excel Saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/surfExcelSoap.png' },
//     { name: 'Ayna Dish wash(1p)', price: 10,category:'Cleaning Care', image: 'images/aynasoap.png' },
//     { name: 'JK White saboon(1p)', price: 10,category:'Cleaning Care', image: 'images/JK.png' },
//     { name: 'Comfort Morning fresh(210mL)', price: 58,category:'Cleaning Care', image: 'images/comfort.png' },
//     { name: 'Detol(125mL)', price: 80,category:'Cleaning Care', image: 'images/detol125mL.png' },
//     { name: 'Ujala(50mL)', price: 10,category:'Cleaning Care', image: 'images/ujala.png' },
//     { name: 'Phenyle Black(1btl)', price: 85, category:'Cleaning Care',image: 'images/phenyleBlack.jpg' },
//     { name: 'Phenyle White(1btl)', price: 85,category:'Cleaning Care', image: 'images/phenyleWhite.jpg' },
//     { name: 'Snuball Saboon(1p)', price: 45,category:'Cleaning Care', image: 'images/idashaban.jpg' },
//     { name: 'Surf Excel(75g)', price: 10,category:'Cleaning Care', image: 'images/surfExcel.png' },
//     { name: 'Jhama(1Pc)', price: 10,category:'Cleaning Care', image: 'images/jhama.jpg' },
    
    
//     { name: 'Sweat Toast(Big)', price: 49,category:'Bakery & Biscuits', image: 'images/sweatToast.jpg' },
//     { name: 'Sweat Toast(Small)', price: 30,category:'Bakery & Biscuits', image: 'images/sweatToast.jpg' },
//     { name: 'Britania Marie(Big)', price: 40,category:'Bakery & Biscuits', image: 'images/britaniaBig.png' },
//     { name: 'Britania Marie(Small)', price: 10,category:'Bakery & Biscuits', image: 'images/britaniaSmall.png' },
//     { name: 'Marie Light(Big)', price: 40,category:'Bakery & Biscuits', image: 'images/marieLight.png' },
//     { name: '20-20 Biscuit', price: 20,category:'Bakery & Biscuits', image: 'images/2020biscuit.png' },
//     { name: 'Tiger Biscuit(1pc)', price: 5,category:'Bakery & Biscuits', image: 'https://imgs.search.brave.com/tk-BeOJOPlRfkiDKaDJYmaSeo2zzhLcnSKuHUb0yLoE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/OTcxL3N3ZWV0LWNy/aXNweS1hbmQtZGVs/aWNpb3VzLXNlbWkt/c29mdC10aWdlci1n/bHVjb3NlLWJpc2N1/aXRzLTM2NS5qcGc' },
//     { name: 'Nutri Choice(1pkt)', price: 65,category:'Bakery & Biscuits', image: 'images/nutriChoice.png' },
//     { name: 'Eat-Fit Digestive(175gm)', price: 40,category:'Bakery & Biscuits', image: 'images/eatFitDigestive.png' },
//     { name: 'Maggie(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/maggie.png' },
//     { name: 'Bikaji Kuch Kuch(200gm)', price: 65,category:'Bakery & Biscuits', image: 'images/bikajiKuchKuch.png' },
//     { name: 'Kolkata Chana chur(200gm)', price: 62,category:'Bakery & Biscuits', image: 'images/kolkataChanaChur.png' },
//     { name: 'Bikaji Bhujia(200gm)', price: 65,category:'Bakery & Biscuits', image: 'images/BikajiBhujia.png' },
//     { name: 'Parle G(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/parleG.jpg' },
//     { name: 'Rusk(1pkt)', price: 10,category:'Bakery & Biscuits', image: 'images/rusk.jpg' },

//     { name: 'C to C type cable(1m) samsung', price: 150,category:'Electronics', image: 'images/' },
//     { name: 'iPhone Data Cable(1m)', price: 150,category:'Electronics', image: 'images/' },
//     { name: 'Samsung 25W type C addopter', price:520 ,category:'Electronics', image: 'images/' },
//     { name: '3 in 1 Black Kat Data cable', price:210 ,category:'Electronics', image: 'images/' },
//     { name: '120W B type Data Cable', price:150 ,category:'Electronics', image: 'images/' },
//     { name: '120W C type Data Cable', price:150 ,category:'Electronics', image: 'images/' },
//     { name: 'Black Kat C type Data Cable', price:60 ,category:'Electronics', image: 'images/' },
//     { name: 'Black Kat B type Data Cable', price:60 ,category:'Electronics', image: 'images/' },
//     { name: 'Fast Charging Cable C type', price: 170,category:'Electronics', image: 'images/' },
//     { name: 'Fast Charging Cable B type', price:170 ,category:'Electronics', image: 'images/' },
//     { name: 'Car Charger', price:280 ,category:'Electronics', image: 'images/' },
//     { name: 'Black Kat wireless blutooth Speaker', price:399 ,category:'Electronics', image: 'images/' },
//     { name: 'realme Buds Wireless 3 Neo', price:520 ,category:'Electronics', image: 'images/' },
//     { name: 'Boat Rockerz 255 blutooth earphone', price:520 ,category:'Electronics', image: 'images/' },



//     { name: 'Graph Book(Pages 10)', price:20 ,category:'Stationary', image: 'images/' },
//     { name: 'Plain Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
//     { name: 'Plain Notebook(Page 100)', price:50 ,category:'Stationary', image: 'images/' },
//     { name: 'Role Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
//     { name: 'Role Notebook(Page 100)', price:50 ,category:'Stationary', image: 'images/' },
//     { name: 'English Notebook(Page 50)', price:30 ,category:'Stationary', image: 'images/' },
//     { name: 'Flair Writo-meter Ball Pen(Black)', price: 20,category:'Stationary', image: 'images/' },
//     { name: 'Flair Writo-meter Ball Pen(blue)', price: 20,category:'Stationary', image: 'images/' },
//     { name: 'Apsara Pencil(1 box)', price: 49,category:'Stationary', image: 'images/' },
//     { name: 'Apsara Eraser(2 pc)', price: 10,category:'Stationary', image: 'images/' },
//     { name: 'Apsara Sharpner(2 pc)', price: 10,category:'Stationary', image: 'images/' },
//     { name: 'Permanent Marker Pen ', price: 15,category:'Stationary', image: 'images/' },
//     { name: 'Fevicol MR (20gm)', price: 10,category:'Stationary', image: 'images/' },
//     { name: 'Elkos Pen(Pack of 5)', price: 30,category:'Stationary', image: 'images/' },
// ];

//   // Cart data
//   const cart = [];

//   // Initialize store
//   initStore();

//   function initStore(filterCategory = 'all', searchTerm = '') {
//     console.log("Initializing store...");
//     storeDiv.innerHTML = '';
//     popularItemsDiv.innerHTML = '';

//     const filteredItems = items.filter(item => {
//       const matchesCategory = filterCategory === 'all' || 
//                            item.category.toLowerCase() === filterCategory.toLowerCase();
//       const matchesSearch = searchTerm === '' || 
//                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
//       return matchesCategory && matchesSearch;
//     });

//     if(filteredItems.length === 0) {
//       storeDiv.innerHTML = '<p style="padding:20px; text-align:center;">No items found.</p>';
//       return;
//     }

//     filteredItems.forEach(item => {
//       const div = document.createElement('div');
//       div.className = 'item';

//       let badgeHTML = item.badge ? `<span class="item-badge">${item.badge}</span>` : '';
      
//       // Safe image handling with fallback
//       const imageHTML = `
//         <div class="item-img-container">
//           ${badgeHTML}
//           <img src="${item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}" 
//                alt="${item.name}" 
//                class="item-img"
//                onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='">
//         </div>
//       `;

//       div.innerHTML = `
//         ${imageHTML}
//         <div class="item-details">
//           <h3 class="item-name">${item.name}</h3>
//           <div class="item-price">₹${item.price}</div>
//           <div class="item-actions">
//             <div class="quantity-control">
//               <button class="qty-minus">-</button>
//               <span>1</span>
//               <button class="qty-plus">+</button>
//             </div>
//             <button class="add-to-cart-btn">Add</button>
//           </div>
//         </div>
//       `;

//       // Safely add event listeners
//       const minusBtn = div.querySelector('.qty-minus');
//       const plusBtn = div.querySelector('.qty-plus');
//       const addBtn = div.querySelector('.add-to-cart-btn');

//       if (minusBtn) minusBtn.addEventListener('click', () => updateQuantity(div, -1));
//       if (plusBtn) plusBtn.addEventListener('click', () => updateQuantity(div, 1));
//       if (addBtn) addBtn.addEventListener('click', () => addToCart(div));

//       // Add to appropriate section
//       if (item.badge === 'Popular') {
//         popularItemsDiv.appendChild(div.cloneNode(true));
//       }
//       storeDiv.appendChild(div);
//     });
//   }

//   function updateQuantity(itemElement, change) {
//     const quantitySpan = itemElement.querySelector('.quantity-control span');
//     let quantity = parseInt(quantitySpan.textContent);
//     quantity += change;
//     if(quantity < 1) quantity = 1;
//     if(quantity > 10) quantity = 10;
//     quantitySpan.textContent = quantity;
//   }

//   function addToCart(itemElement) {
//     if (!document.getElementById('shopStatusToggle').checked) {
//       showNotification("Shop is currently closed. Orders not accepted.");
//       return;
//     }

//     const name = itemElement.querySelector('.item-name').textContent;
//     const price = parseInt(itemElement.querySelector('.item-price').textContent.replace('₹', ''));
//     const quantity = parseInt(itemElement.querySelector('.quantity-control span').textContent);

//     const existing = cart.find(c => c.name === name);
//     if(existing) {
//       existing.quantity += quantity;
//     } else {
//       cart.push({name, price, quantity});
//     }

//     updateCartUI();
//     showNotification(`${quantity} ${name} added to cart`);
//     itemElement.querySelector('.quantity-control span').textContent = '1';
//     openCart();
//   }

//   function updateCartUI() {
//     const cartList = document.getElementById('cartList');
//     const cartEmpty = document.getElementById('cartEmpty');
//     const cartFull = document.getElementById('cartFull');
//     const cartTotal = document.getElementById('cartTotal');
//     const itemTotal = document.getElementById('itemTotal');
//     const cartCount = document.getElementById('cartCount');

//     if (!cartList || !cartEmpty || !cartFull) return;

//     cartList.innerHTML = '';

//     if(cart.length === 0) {
//       cartEmpty.style.display = 'block';
//       cartFull.style.display = 'none';
//     } else {
//       cartEmpty.style.display = 'none';
//       cartFull.style.display = 'block';

//       let total = 0;
//       cart.forEach((item, index) => {
//         const itemTotalPrice = item.price * item.quantity;
//         total += itemTotalPrice;

//         const li = document.createElement('li');
//         li.className = 'cart-item';
//         li.innerHTML = `
//           <div class="cart-item-info">
//             <div class="cart-item-name">${item.name} × ${item.quantity}</div>
//             <div class="cart-item-price">₹${itemTotalPrice}</div>
//           </div>
//           <button class="cart-item-remove">
//             <i class="fas fa-trash"></i>
//           </button>
//         `;
//         const removeBtn = li.querySelector('.cart-item-remove');
//         if (removeBtn) {
//           removeBtn.addEventListener('click', () => removeFromCart(index));
//         }
//         cartList.appendChild(li);
//       });

//       if (cartTotal) cartTotal.textContent = `₹${total}`;
//       if (itemTotal) itemTotal.textContent = `₹${total}`;
//     }

//     if (cartCount) {
//       cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
//     }
//     localStorage.setItem('quickKartCart', JSON.stringify(cart));
//   }

//   function removeFromCart(index) {
//     const removed = cart.splice(index,1)[0];
//     updateCartUI();
//     showNotification(`${removed.name} removed from cart`);
//   }

//   function showNotification(msg) {
//     const notification = document.getElementById('notification');
//     if (!notification) return;
    
//     notification.textContent = msg;
//     notification.classList.add('show');
//     setTimeout(() => {
//       notification.classList.remove('show');
//     }, 3000);
//   }

//   function openCart() {
//     document.body.classList.add('cart-open');
//     const cartElement = document.getElementById('cart');
//     const cartOverlay = document.getElementById('cartOverlay');
    
//     if (cartElement) cartElement.classList.add('open');
//     if (cartOverlay) cartOverlay.classList.add('show');
//   }

//   function closeCart() {
//     document.body.classList.remove('cart-open');
//     const cartElement = document.getElementById('cart');
//     const cartOverlay = document.getElementById('cartOverlay');
    
//     if (cartElement) cartElement.classList.remove('open');
//     if (cartOverlay) cartOverlay.classList.remove('show');
//   }

//   // Initialize cart from localStorage
//   const savedCart = JSON.parse(localStorage.getItem('quickKartCart'));
//   if(savedCart && Array.isArray(savedCart)) {
//     cart.push(...savedCart);
//     updateCartUI();
//   }
//   const cartToggle = document.getElementById('cartToggle');
// if (cartToggle) {
//   cartToggle.addEventListener('click', openCart);
// }
// CATEGORY FILTERING FEATURE
// const categoryButtons = document.querySelectorAll('.category-btn');

// categoryButtons.forEach(btn => {
//   btn.addEventListener('click', function() {
//     const selectedCategory = this.getAttribute('data-category');
//     initStore(selectedCategory); // 'initStore' already filters by category
//   });
// });

// });