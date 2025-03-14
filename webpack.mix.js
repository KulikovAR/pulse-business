const mix = require("laravel-mix");

mix.js('resources/js/app.js', 'public/js')
    .vue() // Compile Vue files
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('autoprefixer'),
    ])
    .postCss('resources/css/variables.css', 'public/css'); // Add this line