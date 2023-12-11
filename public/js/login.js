const form= document.querySelector("form");
const email=document.querySelector("input[type=email]")
const password=document.querySelector("input[type=password]")



form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const emailValue=email.value;
    const passwordValue=password.value;
    console.log(emailValue,passwordValue);
    const resp =await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            email:emailValue,
            password:passwordValue
        }),
        
    });
    const logindata= await resp.json();
    const logdata=JSON.stringify(logindata);
    const logObjData=JSON.parse(logdata);

    if(logObjData.loginSuccess==false){
        const errorMessage=document.querySelector(".errormessage");
        errorMessage.innerHTML=logObjData.message;
    }
    if(logObjData.loginSuccess==true){
        const errorSuccess=document.querySelector(".errorsuccess");
        errorSuccess.innerHTML=logObjData.message;
        window.location.href="index.html";
    }

    
    // const data=await resp.json();
    // console.log("check!",data);
});