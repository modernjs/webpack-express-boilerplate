/**
 * That is just an example.
 * Please write your business logic here.
 *
 * That is a main file or 'init' file.
 *
 */

require('./css/style');

module.exports = hello;

function hello() {
    console.log('HELLO WORLD!');
}

global.hello = hello;

hello();