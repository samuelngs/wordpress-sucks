# wordpress-sucks
A suck ass wordpress setup

## Get Started

#### Installation
```
$ git clone https://github.com/samuelngs/wordpress-sucks.git
$ cd wordpress-sucks
$ mkdir -p theme
$ touch theme/index.php theme/theme.resource
$ # ready to go!
```

#### Project structure
```
wordpress-sucks [root]
├── plugins *[all plugins should be installed here]
└── theme *[theme development files]
    └── theme.resource	*[theme resource configuration]
    └── [your_code]
```

#### Resource configuration
```
index.php
[custom-page-filename-etc].php
```

#### Run development
```
$ make up # or docker-compose up -d
```

#### Stop server
```
$ make stop # or docker-compose stop
```

#### Remove everything
```
$ make rm # or docker-compose rm -f
```

## License

This project is distributed under the WTFPL license found in the [LICENSE](./LICENSE) file.

```
          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2017 Sam <sam@infinitely.io>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
```

