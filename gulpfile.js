var elixir = require('laravel-elixir');

require('laravel-elixir-vueify');

config.assetsPath = 'assets';

elixir(function(mix) {
	mix.sass('app.scss').browserify('app.js');
});