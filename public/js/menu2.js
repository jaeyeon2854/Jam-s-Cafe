document.addEventListener("DOMContentLoaded", function () {
    // 서버로부터 메뉴 데이터를 가져와서 화면에 표시
    fetchMenuData();
});

async function fetchMenuData() {
    try {
        const response = await fetch('/getMenus'); // 서버에서 메뉴 데이터를 가져오는 API 엔드포인트로 수정
        const menuData = await response.json();
        
        // 가져온 메뉴 데이터를 가지고 화면에 표시
        displayMenuData(menuData);
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

function displayMenuData(menuData) {
    const menuListDiv = document.getElementById('menu-list');
    
    // 메뉴 데이터를 사용하여 화면에 동적으로 HTML을 생성
    menuData.forEach(menu => {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-card';
        menuDiv.innerHTML = `
            <h2>${menu.MenuName}</h2>
            <p>가격: ${menu.MenuPrice}</p>
            <img src="${menu.MenuImg}" alt="${menu.MenuName}">
            <button onclick="showEditForm('${menu.MenuName}', ${menu.MenuPrice})">메뉴 수정하기</button>
            <button onclick="deleteMenu('${menu.MenuName}')">메뉴 삭제하기</button>
        `;
        menuListDiv.appendChild(menuDiv);
    });
}

function showEditForm(menuName, menuPrice) {
    document.getElementById('editMenuName').value = menuName;
    document.getElementById('currentMenuName').value = menuName;
    document.getElementById('editMenuPrice').value = menuPrice;
    document.getElementById('edit-form').style.display = 'block';
}
async function editMenu(menuName) {
    const currentMenuName = document.getElementById('currentMenuName').value;
    const newName = document.getElementById('editMenuName').value;
    const newPrice = document.getElementById('editMenuPrice').value;

    try {
        const response = await fetch(`/updateMenu/${menuName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentMenuName,
                newName,
                newPrice,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            console.log(data.message);
            // 수정이 성공하면 폼을 닫아 화면을 갱신합니다.
            cancelEdit();
            location.reload(); // 새로고침
        } else {
            console.error(data.message);
            // 수정이 실패하면 적절한 처리를 수행합니다.
        }
    } catch (error) {
        console.error('Error updating menu:', error);
        // 에러 발생 시 적절한 처리를 수행합니다.
    }
}

async function deleteMenu(menuName) {
    try {
        const response = await fetch(`/deleteMenu/${menuName}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
            // 삭제 성공 시 새로고침
            location.reload();
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('메뉴 삭제 중 에러 발생:', error);
    }
}
  

function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
}