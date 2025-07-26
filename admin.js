// admin.js (REPLACE THIS ENTIRE FILE)

import { db, auth, storage } from './firebase-config.js';

// ---- GLOBAL VARIABLES ----
let allProducts = []; // To store all products once fetched

// ---- DOM ELEMENTS ----
const addProductForm = document.getElementById('addProductForm');
const productListDiv = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const imageInputGroup = document.getElementById('imageInputGroup');
const productImageInput = document.getElementById('productImage');
const categoryList = document.getElementById('categoryList');
const adminSearchInput = document.getElementById('adminSearchInput');

// ---- SECURITY CHECK ----
document.body.style.display = 'none';
auth.onAuthStateChanged(user => {
    if (user) {
        document.body.style.display = 'block';
        fetchAndRenderProducts(); 
    } else {
        window.location.href = 'index.html';
    }
});
// ---- END SECURITY CHECK ----

// ---- FUNCTIONS ----
function resetForm() {
    addProductForm.reset();
    editingIdInput.value = '';
    formTitle.textContent = 'Add New Product';
    addProductBtn.textContent = 'Add Product';
    cancelEditBtn.style.display = 'none';
    imageInputGroup.style.display = 'block';
    productImageInput.required = true;
}

// NEW: Function to populate the category dropdown
function populateCategoryDropdown() {
    const categories = new Set(allProducts.map(p => p.category));
    categoryList.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        categoryList.appendChild(option);
    });
}

// NEW: Renders products to the DOM based on the allProducts array
function renderProducts(searchTerm = '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    // Filter the allProducts array
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    productListDiv.innerHTML = '';
    if (filteredProducts.length === 0) {
        productListDiv.innerHTML = '<p>No products found.</p>';
        return;
    }

    Object.entries(filteredProducts).forEach(([_, product]) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-list-item';
        // Use the product's actual key from Firebase
        const productKey = Object.keys(allProducts).find(key => allProducts[key] === product);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-list-img">
            <div class="product-list-details">
                <p class="product-list-name">${product.name}</p>
                <p class="product-list-price">₹${product.price}</p>
                <p class="product-list-category">Category: ${product.category}</p>
            </div>
            <div class="product-list-actions">
                <button class="admin-btn-edit" data-id="${product.key}">Edit</button>
                <button class="admin-btn-delete" data-id="${product.key}">Delete</button>
            </div>
        `;
        productListDiv.appendChild(productCard);
    });
}

// NEW: Fetches all products from Firebase and then renders them
async function fetchAndRenderProducts() {
    productListDiv.innerHTML = '<p>Loading products...</p>';
    try {
        const snapshot = await db.ref('products').once('value');
        const productsObject = snapshot.val();
        
        // Convert object to array and store the key inside each product object
        allProducts = productsObject ? Object.entries(productsObject).map(([key, value]) => ({...value, key})) : [];
        
        renderProducts();
        populateCategoryDropdown();
    } catch (error) {
        console.error("Error loading products:", error);
        productListDiv.innerHTML = '<p>Could not load products.</p>';
    }
}


// ---- EVENT LISTENERS ----
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = Number(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const imageFile = productImageInput.files[0];
    const editingId = editingIdInput.value;

    if (!name || !price || !category) { alert('Please fill all text fields.'); return; }

    addProductBtn.textContent = 'Saving...'; addProductBtn.disabled = true;

    try {
        if (editingId) {
            const updates = { name, price, category };
            await db.ref(`products/${editingId}`).update(updates);
            alert('Product updated successfully!');
        } else {
            if (!imageFile) { alert('Please select an image for the new product.'); addProductBtn.disabled = false; return; }
            const imageRef = storage.ref(`product_images/${Date.now()}_${imageFile.name}`);
            const snapshot = await imageRef.put(imageFile);
            const imageUrl = await snapshot.ref.getDownloadURL();
            await db.ref('products').push({ name, price, category, image: imageUrl });
            alert('Product added successfully!');
        }
        resetForm();
    } catch (error) {
        console.error("Error saving product:", error); alert('Failed to save product.');
    } finally {
        addProductBtn.disabled = false;
        fetchAndRenderProducts(); // Refresh data from Firebase
    }
});

cancelEditBtn.addEventListener('click', () => resetForm());

productListDiv.addEventListener('click', async (e) => {
    const target = e.target;
    const productId = target.getAttribute('data-id');
    if (!productId) return;

    if (target.classList.contains('admin-btn-delete')) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await db.ref(`products/${productId}`).remove();
                alert('Product deleted successfully.');
                fetchAndRenderProducts();
            } catch (error) {
                console.error('Error deleting product:', error); alert('Failed to delete product.');
            }
        }
    }

    if (target.classList.contains('admin-btn-edit')) {
        const productToEdit = allProducts.find(p => p.key === productId);
        if (productToEdit) {
            document.getElementById('productName').value = productToEdit.name;
            document.getElementById('productPrice').value = productToEdit.price;
            document.getElementById('productCategory').value = productToEdit.category;
            editingIdInput.value = productId;
            formTitle.textContent = 'Edit Product';
            addProductBtn.textContent = 'Update Product';
            cancelEditBtn.style.display = 'inline-block';
            imageInputGroup.style.display = 'none';
            productImageInput.required = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

adminSearchInput.addEventListener('input', (e) => {
    renderProducts(e.target.value);
});