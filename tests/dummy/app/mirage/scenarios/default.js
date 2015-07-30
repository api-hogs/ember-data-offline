export default function(server) {
  server.createList('user', 50);
  server.createList('car', 100);
  server.createList('company', 3);
  server.createList('office', 3);
  server.createList('city', 100);

  //for stress testing
  // server.createList('user', 500);
  // server.createList('car', 1000);
  // server.createList('company', 300);
  // server.createList('office', 300);
  // server.createList('city', 500);
}
