# Blog Avanzatech Frontend

This is an Angular application where the user can create, view and edit posts based on his permissions. This application consumes the [Blog Avanzatech](https://github.com/julianDGS/avanzatech-blog-backend) Rest API.

## Setup

### Setup using docker

Clone the repository https://github.com/julianDGS/avanzatech_blog from git hub.

1. Install docker, docker-compose.

2. In the root of the project (where the file docker-compose.yaml is) using a command shell execute:

    - `sudo docker-compose build`
    - `sudo docker-compose up`

    First command will install all required dependencies and services, and second one run the web server in http://localhost:4200/

3. Follow the instructions given in [Blog Avanzatech Rest API](https://github.com/julianDGS/avanzatech-blog-backend) to run the backend server.

### Setup without docker

Clone the repository https://github.com/julianDGS/avanzatech_blog from git hub.

1. Install Angular 17.3.7 if does not exist. You should have a compatible version of node.js (20.13.1), and npm (10.5.2).

2. Run `npm install` command to install all necessary dependencies.

3. Run `ng serve` command will up the web server in http://localhost:4200/

4. Follow the instructions given in [Blog Avanzatech Rest API](https://github.com/julianDGS/avanzatech-blog-backend) to run the backend server.
