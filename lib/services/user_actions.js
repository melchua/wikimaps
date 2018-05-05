const delay = (() => {
  return new Promise(res => {setTimeout(res,2000);});
});


// (userId:Number) => Promise<User>
function getUser(id) {
  return delay()
          .then( () => {
            const foundUser = users.find((user) => {
              return user.id === id;
            });
            return foundUser;
          });
}




/*------------- Test data --------------------*/
const users = [
  {
    id: 1,
    email: "dom@fastnfurious.com",
    name: "Dom",
    password: "fat"
  },
  {
    id: 2,
    email: "han@fastnfurious.com",
    name: "Han",
    password: "furious"
  }
];


getUser(2).then((user) => {
  console.log(user);
}).catch("oh shit");
