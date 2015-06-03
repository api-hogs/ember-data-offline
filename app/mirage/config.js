export default function() {
  this.get('/users', function(db){
    return {users: db.users};
  });
}
