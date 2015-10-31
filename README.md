# MPS2015-proiect-1

## Getting started
```
sudo apt-get install nodejs npm
npm install
sudo npm install -g grunt-cli
grunt build
```

## Running things
- the client

```
grunt http-server
```

Then open localhost:8000 in your browser

- the server

```
grunt nodemon
```

- if things change in the code, simply

```
grunt build
```

##Code structure
<!-- language:console -->

    client/
        src/*
        dist/
            carousel.js
    package.json
    Gruntfile.js
    index.html
