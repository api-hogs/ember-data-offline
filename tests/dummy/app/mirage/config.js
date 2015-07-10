import Mirage from 'ember-cli-mirage';

var genId = function() {
  var arr = new Uint8Array(8);
  window.crypto.getRandomValues(arr);
  return [].map.call(arr, function(n) { return n.toString(16); }).join("");
};

export default function() {
  this.get('/users', function(db, req){
    if (req.queryParams.bar) {
      let users = db.users.map((user, index) => {
        user._id = index + 100;
        return user;
      });
      return {users: users};
    }
    return {users: db.users.map(user => {
      user._id = user.id;
      delete user.id;
      return user;
    })};
  });
  this.get('/users/:id', function(db, req){
    let user = db.users[0];
    user.id = req.params.id;
    return {user: user};
  });
  this.post('/users', function(db, request) {
    var attrs = JSON.parse(request.requestBody)['user'];
    attrs._id = genId();
    // return new Mirage.Response(408, null, null); // Need this for testing
    return {user: attrs};
  });
  this.get('/companies', function(db, req){
    return {companies: db.companies}; 
  });
}
