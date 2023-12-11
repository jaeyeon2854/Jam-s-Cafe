document.addEventListener("DOMContentLoaded", function () {
    // 쿠키 확인
    const hasCookie = checkCookie();

    // 버튼을 보여주거나 숨김
    showAuthButtons(hasCookie);
});

// 쿠키 확인 함수
function checkCookie() {
    const cookies = document.cookie.split('=');
    console.log(cookies)

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // 여기에서 원하는 쿠키의 이름을 지정하세요 (예: 'USER')
        if (cookie.startsWith('USER')) {
            return true; // 쿠키가 존재하면 true 반환
        }
    }

    return false; // 쿠키가 없으면 false 반환
}

// 버튼을 보여주거나 숨기는 함수
function showAuthButtons(hasCookie) {
    const authButtonsDiv = document.getElementById('auth-buttons');
    if (hasCookie) {
        // 쿠키가 있을 경우: 로그아웃 버튼 보이기
        authButtonsDiv.innerHTML = `<a href="/logout">로그아웃 &nbsp </a>
                                    <a href="menu.html">주문하기 &nbsp </a>
                                    `;
        
    } else {
        // 쿠키가 없을 경우: 로그인 및 회원가입 버튼 보이기
        authButtonsDiv.innerHTML = `
            <a href="login.html">로그인</a>
            <a href="signup.html">회원가입</a>
        `;
    }
}
