document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Remove theme toggle related variables and event listeners

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/logout', {
                method: 'GET',
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during logout. Please try again.');
        }
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });
    }

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Remove theme toggle functions and related code

    const navLinks = document.querySelectorAll('nav a');
    const contentDivs = document.querySelectorAll('[id$="-content"]');
    const pageTitle = document.querySelector('h1.text-3xl');

    function showPage(pageId) {
        contentDivs.forEach(div => div.classList.add('hidden'));
        document.getElementById(`${pageId}-content`).classList.remove('hidden');
        
        // Update URL without reloading the page
        history.pushState(null, '', `/${pageId}`);

        // Update page title
        pageTitle.textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const pageId = window.location.pathname.substring(1) || 'dashboard';
        showPage(pageId);
    });

    // Initial page load
    const initialPage = window.location.pathname.substring(1) || 'dashboard';
    showPage(initialPage);


    //                          DIVIDERS                            //

    let inventoryData = [
        {
            item_id: 1,
            item_name: "Teh Botol Sosro 450",
            item_category: "Minuman",
            item_price: 7000,
            item_cost: 5000,
            item_margin: 0,
            item_stock: 2
        },
        {
            item_id: 2,
            item_name: "Nasi Goreng Kambing",
            item_category: "Makanan",
            item_price: 25000,
            item_cost: 12500,
            item_margin: 0,
            item_stock: 4
        }
    ];
    
    function updateInventoryTable() {
        const tableBody = document.getElementById('inventoryTableBody');
        tableBody.innerHTML = '';
    
        inventoryData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_id}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_name}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_category}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_price.toLocaleString()}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_cost.toLocaleString()}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${calculateMargin(item.item_price, item.item_cost)}%</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_stock}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    function calculateMargin(price, cost) {
        return ((price - cost) / price * 100).toFixed(2);
    }
    
    function showAddItemModal() {
        document.getElementById('addItemModal').classList.remove('hidden');
    }
    
    function hideAddItemModal() {
        document.getElementById('addItemModal').classList.add('hidden');
    }
    
    document.getElementById('addItemButton').addEventListener('click', showAddItemModal);
    
    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newItem = {
            item_id: inventoryData.length + 1,
            item_name: document.getElementById('itemName').value,
            item_category: document.getElementById('itemCategory').value,
            item_price: parseFloat(document.getElementById('itemPrice').value),
            item_cost: parseFloat(document.getElementById('itemCost').value),
            item_margin: 0,
            item_stock: parseInt(document.getElementById('itemStock').value)
        };
        inventoryData.push(newItem);
        updateInventoryTable();
        hideAddItemModal();
        this.reset();
    });
    
    // Call this function when the inventory page is loaded
    updateInventoryTable();
    
    //                          DIVIDERS                            //
    // Add this to your dashboard.js file or create a new sales.js file

    let currentTransaction = [];

    function updateAvailableItems() {
        const availableItemsBody = document.getElementById('availableItemsBody');
        availableItemsBody.innerHTML = '';
    
        inventoryData.forEach(item => {
            if (item.item_stock > 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_name}</td>
                    <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_price.toLocaleString()}</td>
                    <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.item_stock}</td>
                    <td class="px-4 py-2">
                        <button onclick="addToTransaction(${item.item_id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                            Add
                        </button>
                    </td>
                `;
                availableItemsBody.appendChild(row);
            }
        });
    }
    
    function updateCurrentTransaction() {
        const currentTransactionBody = document.getElementById('currentTransactionBody');
        currentTransactionBody.innerHTML = '';
        let total = 0;
    
        currentTransaction.forEach((item, index) => {
            const row = document.createElement('tr');
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            row.innerHTML = `
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.name}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.quantity}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${item.price.toLocaleString()}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${itemTotal.toLocaleString()}</td>
                <td class="px-4 py-2">
                    <button onclick="removeFromTransaction(${index})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                        Remove
                    </button>
                </td>
            `;
            currentTransactionBody.appendChild(row);
        });
    
        document.getElementById('transactionTotal').textContent = total.toLocaleString();
    }
    
    function addToTransaction(itemId) {
        const item = inventoryData.find(i => i.item_id === itemId);
        if (item && item.item_stock > 0) {
            const existingItem = currentTransaction.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                currentTransaction.push({
                    id: item.item_id,
                    name: item.item_name,
                    price: item.item_price,
                    quantity: 1
                });
            }
            item.item_stock--;
            updateAvailableItems();
            updateCurrentTransaction();
        }
    }
    
    function removeFromTransaction(index) {
        const removedItem = currentTransaction[index];
        const inventoryItem = inventoryData.find(i => i.item_id === removedItem.id);
        inventoryItem.item_stock += removedItem.quantity;
        currentTransaction.splice(index, 1);
        updateAvailableItems();
        updateCurrentTransaction();
    }
    
    function completeTransaction() {
        if (currentTransaction.length === 0) {
            alert('No items in the current transaction.');
            return;
        }
    
        currentTransaction.forEach(item => {
            const inventoryItem = inventoryData.find(i => i.item_id === item.id);
            if (inventoryItem) {
                // Update inventory
                inventoryItem.item_stock -= item.quantity;
                
                // Update reports
                updateReports(item);
            }
        });
    
        // Clear current transaction
        currentTransaction = [];
        updateAvailableItems();
        updateCurrentTransaction();
        updateInventoryTable();
        updateReportsDisplay();
    
        alert('Transaction completed successfully!');
    }
    
    document.getElementById('completeTransactionButton').addEventListener('click', completeTransaction);
    
    // Call these functions when the sales page is loaded
    function initSalesPage() {
        updateAvailableItems();
        updateCurrentTransaction();
    }

    const salesLink = document.querySelector('a[href="#sales"]');
    if (salesLink) {
        salesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('sales');
            initSalesPage();
        });
    }

//DIVIDERA


// Add this to your dashboard.js file or create a new reports.js file

let reportsData = [
    {
        item_id: 1,
        item_revenue: 7000,
        item_cost: 5000,
        item_profit: 2000,
        item_sold: 1,
        item_margin: 0,
        item_stock: 1
    },
    {
        item_id: 2,
        item_revenue: 100000,
        item_cost: 50000,
        item_profit: 50000,
        item_sold: 4,
        item_margin: 0,
        item_stock: 0
    }
];

function updateReports(soldItem) {
    const report = reportsData.find(r => r.item_id === soldItem.id);
    if (report) {
        report.item_revenue += soldItem.price * soldItem.quantity;
        report.item_cost += inventoryData.find(i => i.item_id === soldItem.id).item_cost * soldItem.quantity;
        report.item_profit = report.item_revenue - report.item_cost;
        report.item_sold += soldItem.quantity;
        report.item_margin = calculateMargin(report.item_revenue, report.item_cost);
        report.item_stock = inventoryData.find(i => i.item_id === soldItem.id).item_stock;
    } else {
        const inventoryItem = inventoryData.find(i => i.item_id === soldItem.id);
        reportsData.push({
            item_id: soldItem.id,
            item_revenue: soldItem.price * soldItem.quantity,
            item_cost: inventoryItem.item_cost * soldItem.quantity,
            item_profit: (soldItem.price - inventoryItem.item_cost) * soldItem.quantity,
            item_sold: soldItem.quantity,
            item_margin: calculateMargin(soldItem.price, inventoryItem.item_cost),
            item_stock: inventoryItem.item_stock
        });
    }
}

function updateReportsDisplay() {
    const itemReportsBody = document.getElementById('itemReportsBody');
    itemReportsBody.innerHTML = '';

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalSold = 0;

    reportsData.forEach(report => {
        const inventoryItem = inventoryData.find(i => i.item_id === report.item_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${inventoryItem.item_name}</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_revenue.toLocaleString()}</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_cost.toLocaleString()}</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_profit.toLocaleString()}</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_sold}</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_margin.toFixed(2)}%</td>
            <td class="px-4 py-2 text-gray-700 dark:text-gray-300">${report.item_stock}</td>
        `;
        itemReportsBody.appendChild(row);

        totalRevenue += report.item_revenue;
        totalCost += report.item_cost;
        totalProfit += report.item_profit;
        totalSold += report.item_sold;
    });

    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
    document.getElementById('totalCost').textContent = totalCost.toLocaleString();
    document.getElementById('totalProfit').textContent = totalProfit.toLocaleString();
    document.getElementById('totalSold').textContent = totalSold;
}

// Call this function when the reports page is loaded
updateReportsDisplay();

});

