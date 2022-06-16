1. create stytch project and get project id and secret.
2. use those credentialas in every fetch request inside App.js
   Authorization:
   "Basic " +
   btoa(
   <Project-id>:<project-secret>
   )
