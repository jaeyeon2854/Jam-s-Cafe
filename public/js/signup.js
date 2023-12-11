
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const password2 = document.querySelector("#password2").value;

    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (password !== password2) {
      const errorElement = document.querySelector(".error");
      if (errorElement) {
        errorElement.innerHTML = "비밀번호가 일치하지 않습니다.";
      }
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorElement = document.querySelector(".error");
        if (errorElement) {
          errorElement.innerHTML = "회원가입에 실패했습니다.";
        }
        throw new Error("회원가입에 실패했습니다.");
      }

      const data = await response.json();
      console.log("회원가입 성공:", data);

      // 회원가입 성공 시 로그인 페이지로 이동
      window.location.href = "index.html";
      
    } catch (error) {
      console.error("회원 가입 에러 : ",error.message);
    }
  });

