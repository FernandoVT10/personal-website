## Personal Website
This website is created with NodeJS, ExpressJS, Apollo Server, NextJS and, React JS.

On this website you can manage and explain in detail your projects with a markdown text editor.

You can see it in action [here](https://fvtblog.com).

### Installation
1. Clone the repository.
2. Run `$ npm install` to install all the neccessary packages.
4. Rename the `.env-example` file to `.env`, you can go to the [enviroment variables section](#enviroment-variables) to see more details.
3. Run MongoDB, the application will try to connect to `mognodb://localhost:27017` if you want to set a custom URI you can go to the [enviroment variables section](#enviroment-variables).
4. Run `$ npm run dev` to start the server, then go to [http://localhost:3000](http://localhost:3000).

### Enviroment variables<a name="enviroment-variables"></a>
```sh
# This is used to save the images links in the database
# For example if you want to run it in a server
# and you have a domain "example.com"
# you will need to change it to "https://example.com"
WEBSITE_URL= # default: http://localhost:3000

# This is the mongodb uri that mongoose is going to use
# to connect to the database
MONGODB_URI=

# The url to the graphql server
NEXT_PUBLIC_GRAPHQL_URI= # default: http://localhost:3000/graphql

# Mail service configuration
MAIL_PORT=465
MAIL_HOST=smtp.gmail.com
MAIL_USER=
MAIL_PASS=

# The username that you need to use to access to the admin page
DASHBOARD_USERNAME= # default: admin

# The password to access to the admin page
# The password must be encrypted with bcrypt
# because i'm stupid and i couldn't do it better
# but i promise that i'm going to change it in a future
DASHBOARD_PASSWORD= # default unencrypted: secret

# The secret key that jsonwebtoken is going to use
JWT_SECRET_KEY=
```
