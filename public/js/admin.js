const adminForm = document.querySelector("#admin-form");

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value;
  const price = document.querySelector("#price").value;
  const imageInput = document.querySelector("#image");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("image", imageInput.files[0]);

  try {
    const resp = await fetch("/admin", {
      method: "POST",
      body: formData,
    });

    if (resp.status !== 200) {
      const errorElem = document.querySelector(".error");
      errorElem.innerHTML = "잘못된 형식을 입력했습니다.";
      throw new Error("잘못된 형식을 입력했습니다.");
    }

    const data = await resp.json();
    console.log("result", data);
  } catch (error) {
    console.log(error);
  }
});

// "취소" 버튼 클릭 시 폼 초기화
const cancelBtn = document.querySelector("#cancel-btn");
cancelBtn.addEventListener("click", () => {
  adminForm.reset();
});
