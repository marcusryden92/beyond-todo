# CHANGES 2024-03-21

1.  Made modifications in the Session config:

    - Set maxAge of cookie to 1 day (the math equates to nr of ms in a day.)

2.  Refactored the LocalStrategy setup to make it easier to understand.

3.  Changed variable "user_name" to "username", because according to tutorial,
    Passport looks for the "username" variable in our HTTP request when doing
    authentication stuff. Also changed this in the Client-side createUser function
    and in the register function, although it probably doesn't matter.

    Have not touched the database.

4.  Generate a random userId:

    - Installed package "uuid" (npm install uuid).
    - Required the package with "const { v4: uuidv4 } = require("uuid");"
    - Added "const user_id = uuidv4();" to the registration function.

5.  Added session logging function.

# TODO

- Potentially add

  { failureRedirect: '/login-failure', successRedirect: '/login-success'}

  to the

  app.post('/login')
