import loki from "lokijs";

export const db = new loki("./cafe.db", {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000,
});

function databaseInitialize() {
  const users = db.getCollection("users");
  if (users === null) {
    db.addCollection("users");
  }
  const menus = db.getCollection("menus");
  if(menus===null){
    db.addCollection("menus");
  }
  // kick off any program logic or start listening to external events
  runProgramLogic();
}

// example method with any bootstrap logic to run after database initialized
function runProgramLogic() {
  var userCount = db.getCollection("users").count();
  var menuCount = db.getCollection("menus").count();
  console.log("number of users in database : " + userCount);
  console.log("number of menus in database : " + menuCount);
}

export const insertUser=(email,password)=>{
    const users=db.getCollection("users");
    const result=users.insert({email,password});
    console.log("insert result:",result);
    console.log(result);
    return result;
};

export const findUserByEmail=(email) =>{
    const users=db.getCollection("users");
    const user=users.findOne({email});
    return user;
};

export const insertMenu=(MenuName,MenuImg,MenuPrice)=>{
  const menus=db.getCollection("menus");
  const MenuResult=menus.insert({MenuName,MenuImg,MenuPrice});
  console.log("insert Menu:",MenuResult);
  console.log(MenuResult);
  return MenuResult;
};
