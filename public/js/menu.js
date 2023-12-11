document.addEventListener("DOMContentLoaded", function () {
    fetchMenuData();
});

async function fetchMenuData() {
    try {
        const response = await fetch('/getMenus'); // Modify to the actual API endpoint for fetching menu data
        const menuData = await response.json();
        displayMenuData(menuData);
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

function displayMenuData(menuData) {
    const menuListDiv = document.getElementById('menu-list');
    const menuDetailsDiv = document.getElementById('menu-details');
    let selectedMenus = [];

    menuData.forEach(menu => {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-card';
        menuDiv.innerHTML = `
            <h2>${menu.MenuName}</h2>
            <p>가격: ${menu.MenuPrice}</p>
            <img src="${menu.MenuImg}" alt="${menu.MenuName}">
        
        `;

        menuDiv.addEventListener('click', () => {
            // Toggle selection state
            const index = selectedMenus.findIndex(selectedMenu => selectedMenu.MenuName === menu.MenuName);

            if (index === -1) {
                // If the menu is not in the selectedMenus array, add it with quantity 1
                menu.quantity = 1;
                selectedMenus.push(menu);
            } else {
                // If the menu is already in the selectedMenus array, increment its quantity
                selectedMenus[index].quantity = (selectedMenus[index].quantity || 1) + 1;
            }

            // Update menu details and total price
            updateSelectedMenus(selectedMenus, menuDetailsDiv);
        });

        menuListDiv.appendChild(menuDiv);
    });
}

function updateSelectedMenus(selectedMenus, menuDetailsDiv) {
    let totalPrice = 0;

    // Update the menu details
    menuDetailsDiv.innerHTML = '<h2>주문서</h2>';

    selectedMenus.forEach(menu => {
        const menuPrice = parseInt(menu.MenuPrice, 10); // Convert menu price to integer
        const subtotal = menuPrice * menu.quantity;

        menuDetailsDiv.innerHTML += `
            <p>${menu.MenuName} - ${menuPrice}원 x ${menu.quantity} = ${subtotal}원</p>
        `;
        totalPrice += subtotal;
    });

    // Display the total price
    menuDetailsDiv.innerHTML += `
        <p><strong>총 가격: ${totalPrice}원</strong></p>
    `;
}


