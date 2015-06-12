export default function() {
  this.get('/users', function(db, req){
    if (req.queryParams.bar) {
      let users = db.users.map((user, index) => {
        user.id = index + 100;
        return user;
      });
      return {users: users};
    }
    return {users: db.users};
  });
  this.get('/users/:id', function(db, req){
    let user = db.users[0];
    user.id = req.params.id;
    return {user: user};
  });
  this.post('/users', function(db, request) {
    var attrs = JSON.parse(request.requestBody);
    attrs.id = db.users.length + 1;
    return {user: attrs};
  });
}
