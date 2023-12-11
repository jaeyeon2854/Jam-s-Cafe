import express from 'express';
import path from 'path';
import { db,findUserByEmail, insertUser, insertMenu} from './database/db.js';
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import formidable from "formidable";
import { existsSync, mkdirSync } from "fs";

const app = express();
const uploadDir = "uploads";

if (!existsSync(uploadDir)) {
  console.log( `making upload directory ${uploadDir}…`);
  mkdirSync(uploadDir, { recursive: true });
}
// 정적 파일 제공 설정
app.use(express.static(path.resolve("public")));
app.use('/uploads', express.static(path.resolve(uploadDir)));

const USER_COOKIE_KEY="USER";
app.use(express.static(path.resolve("public"), {extensions: ["html"]}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const Euser=findUserByEmail(email);
  
  if(!Euser) {
    return res.send({
      loginSuccess : false,
      message :"존재하는 이메일이 아닙니다."
    });
  }
  else {
    const validPassword= await bcrypt.compare(password,Euser.password);
    // console.log(validPassword);
    if(!validPassword){ 
      return res.send({
        loginSuccess : false,
        message : "비밀번호가 틀립니다."
      })

    }
    else {
      res.cookie(USER_COOKIE_KEY,JSON.stringify(Euser));
      return res.send({
        loginSuccess : true,
        message : "로그인 성공!"
      });
      }; 
  }
  
});


app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('email', email, 'pass', password);
  const fuser = findUserByEmail(email);
  if (fuser){
    console.log("이미 존재하는 아이디 입니다.")
    return res.status(422).send(`${email}가 이미 존재하는 이메일 입니다.`)
  }
  
    console.log("회원 가입 가능 : " , req.body.password);
    const hash = await bcrypt.hash(password,10);
    const result = insertUser(email, hash);
    console.log('result insert:', result);
    // res.cookie(USER_COOKIE_KEY,JSON.stringify(result));
    res.json(result);
  
});

app.get('/getMenus', (req, res) => {
  // 여기서는 데이터베이스에서 메뉴 데이터를 읽어온다고 가정합니다.
  const menus = db.getCollection("menus").data;

  // 클라이언트에 메뉴 데이터를 JSON 형태로 응답
  res.json(menus);
});


app.post("/admin", async (req, res) => {
  try {
    const form = formidable({ uploadDir: uploadDir });
    const [fields, files] = await form.parse(req);

    // 데이터베이스에 추가하는 로직
    const MenuName = fields.name;
    const MenuPrice = fields.price;
    const imageFilename = files.image[0].newFilename;
    const MenuImg = imageFilename ? `uploads/${imageFilename}` : null;
    console.log(
      "files data",
      files.image[0].newFilename,
      files.image[0].originalFilename
    );
    // insertMenu 함수를 사용하여 데이터베이스에 추가
    const MenuResult = insertMenu(MenuName, MenuImg, MenuPrice);

    res.send({
      success: true,
      message: "메뉴가 성공적으로 추가되었습니다.",
      menu: MenuResult,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.put('/updateMenu/:menuName', async (req,res) =>{
  const {currentMenuName,newName, newPrice} = req.body;
  console.log(currentMenuName,newName, newPrice)
  const menus = db.getCollection("menus").data;
  const menusCollection = db.getCollection("menus");
  const menuToUpdate = menus.find(menu => menu.MenuName[0] === currentMenuName);
  console.log('ㅁㅁㅁ',menuToUpdate)

  if(menuToUpdate){
// 만약 MenuName이 배열이라면, 새 배열로 업데이트
    if (Array.isArray(menuToUpdate.MenuName)) {
      menuToUpdate.MenuName = [newName];  // 새 배열로 교체
    } else {
      menuToUpdate.MenuName = newName;  // 문자열일 경우 그대로 대체
    }
    // 만약 MenuName이 배열이라면, 새 배열로 업데이트
    if (Array.isArray(menuToUpdate.MenuPrice)) {
      menuToUpdate.MenuPrice = [newPrice];  // 새 배열로 교체
    } else {
      menuToUpdate.MenuPrice = newPrice;  // 문자열일 경우 그대로 대체
    }

    // LokiJS는 자동으로 변경 사항을 저장하지 않으므로 명시적으로 저장해야 합니다.
    menusCollection.update(menuToUpdate);
    console.log(menusCollection.data);
    res.json({ success: true, message: '메뉴가 성공적으로 수정되었습니다.' });
  } else {
    res.status(404).json({ success: false, message: '메뉴를 찾을 수 없습니다.' });
  }
})

app.delete('/deleteMenu/:menuName', async (req, res) => {
  const menuName = req.params.menuName;
  const menus = db.getCollection("menus").data;
  const menusCollection = db.getCollection("menus");
  console.log('menuName',menuName,'menus',menus)

  // 메뉴 찾기
  const menuToDelete = menus.find(menu => menu.MenuName[0] === menuName);
  console.log('ㅁㅁㅁ',menuToDelete)

  if (menuToDelete) {
    // 메뉴 삭제
    menusCollection.remove(menuToDelete);

    res.json({ success: true, message: '메뉴가 성공적으로 삭제되었습니다.' });
  } else {
    res.status(404).json({ success: false, message: '메뉴를 찾을 수 없습니다.' });
  }
});

app.get('/logout',(req,res)=>{
  res.clearCookie(USER_COOKIE_KEY).redirect('/');
});

app.listen(3000, () => {
  console.log('app server is running on port 3000');
});
