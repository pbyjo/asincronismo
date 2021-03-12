# Asincronismo con JS

### M1 - INTRODUCCIÓN

### Introducción al asincronismo.

 >Clase 2

**API**
Interfaz de programación de aplicaciones (Application Programming Interface). Es un conjunto de rutinas que provee acceso a funciones de un determinado software.

**Concurrencia**
Cuando dos o más tareas progresan simultáneamente.

**Paralelismo**
Cuando dos o más tareas se ejecutan, literalmente, a la vez, en el mismo instante de tiempo.

**Bloqueante**
Una llamada u operación bloqueante no devuelve el control a nuestra aplicación hasta que se ha completado. Por tanto el thread queda bloqueado en estado de espera.

**Síncrono**
Es frecuente emplear ‘bloqueante’ y ‘síncrono’ como sinónimos, dando a entender que toda la
operación de entrada/salida se ejecuta de forma secuencial y, por tanto, debemos esperar a que se complete para procesar el resultado.

**Asíncrono**
La finalización de la operación I/O se señaliza más tarde, mediante un mecanismo específico
como por ejemplo un callback, una promesa o un evento, lo que hace posible que la respuesta
sea procesada en diferido.

**Call Stack**
La pila de llamadas, se encarga de albergar las instrucciones que deben ejecutarse. Nos indica en que punto del programa estamos, por donde vamos.

**Heap**
Región de memoria libre, normalmente de gran tamaño, dedicada al alojamiento dinámico de
objetos. Es compartida por todo el programa y controlada por un recolector de basura que se
encarga de liberar aquello que no se necesita.

**Cola o Queue**
Cada vez que nuestro programa recibe una notificación del exterior o de otro contexto distinto al de la aplicación, el mensaje se inserta en una cola de mensajes pendientes y se registra su callback correspondiente.

**Eventloop o Loop de eventos**
Cuando la pila de llamadas (call stack) se vacía, es decir, no hay nada más que ejecutar, se procesan los mensajes de la cola. Con cada ‘tick’ del bucle de eventos, se procesa un nuevo mensaje.

**Hoisting**
Sugiere que las declaraciones de variables y funciones son físicamente movidas al comienzo del código en tiempo de compilación.

**DOM**
DOM permite acceder y manipular las páginas XHTML como si fueran documentos XML. De
hecho, DOM se diseñó originalmente para manipular de forma sencilla los documentos XML.

**XML**
Lenguaje de marcado creado para la transferencia de información, legible tanto para seres
humanos como para aplicaciones informáticas, y basado en una sencillez extrema y una rígida
sintaxis. Así como el HTML estaba basado y era un subconjunto de SGML, la reformulación del
primero bajo la sintaxis de XML dio lugar al XHTML; XHTML es, por tanto, un subconjunto de XML.

**Events**
Comportamientos del usuario que interactúa con una página que pueden detectarse para lanzar
una acción, como por ejemplo que el usuario haga click en un elemento (onclick), que elija una opción de un desplegable (onselect), que pase el ratón sobre un objeto (onmouseover), etc.

**Compilar**
Compilar es generar código ejecutable por una máquina, que puede ser física o abstracta como la máquina virtual de Java.

**Transpilar**
Transpilar es generar a partir de código en un lenguaje código en otro lenguaje. Es decir, un programa produce otro programa en otro lenguaje cuyo comportamiento es el mismo que el
original.

#### Presentación del reto

 >Clase 3

Estructuras de asincronismo:

**Callbacks, promises y async/await**

Api a utilizar
`rickandmortyapi.com`

- Consumir la API y conocer el total de personajes de la serie.
- Conocer el nombre del primer personaje que nos regrese.
- Conocer la dimension a la que pertenecen en un tercer llamado.

Lista de Apis que se pueden usar
`https://github.com/public-apis/public-apis`

### M2 - DESARROLLAR SOLUCIONES UTILIZANDO ASINCRONISMO.

#### Definición estructura callback

 >Clase 4

Callback: es una función que al crearla le pasamos como parametro una segunda f().

Esta es la forma como js ha implementado el asincronismo en su lenguaje 

Podemos crear un script en nuestro json para crear un comando en terminal que nos ejecute el callback

#### Peticiones a APIS usando Callbacks

 >Clase 5

Los estados de un request de acuerdo a la documentacion:
    0: request not initialized
    1: server connection established
    2: request received
    3: processing request
    4: request finished and response is ready

Instalamos dependencias_ 

`npm install xmlhttprequest --save`


``` js
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function fetchData(url_api, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', url_api, true);
    xhttp.onreadystatechange = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                callback(null, JSON.parse(xhttp.responseText))
            } else {
                const error = new Error('Error ' + url_api);
                return callback(error, null)
            }
        }
    }

    xhttp.send();
}
```

#### Múltiples peticiones a un API con callbacks

 >Clase 6

Esta es la forma en la que podemos encadenar llamadas de forma asincrona con callbacks
Los callbacks hell son una mala práctica aunque funcional.

 ``` js
// primero buscamos la lista de personajes
fetchData(API, function(error1, data1) {
    // si error, matamos retornando un error
    if(error1) return console.error(error1)
    // luego buscamos en la api el id de Rick
    fetchData(API + data1.results[0].id, function (error2, data2) {
        // si error, matamos retornando un error
        if(error2) return console.error(error2);
        // por ultimo la consulta a la api que contiene su dimension
        fetchData(data2.origin.url, function (error3, data3) {
            // si error, matamos retornando un error
            if (error3) return console.log.error(error3);

            // mostramos los resultados :) 
            console.log(data1.info.count);
            console.log(data2.name);
            console.log(data3.dimension);

            // rutas de las peticiones en orden
            /* console.log(api);
            console.log(api + data1.results[0].id); 
            console.log(data2.origin.url);  */
        });
    })
})
```

#### Implementando promesas

 >Clase 7

Estas utilizan el objeto `promise` para ser ejecutadas. Su concepto es 'algo va a suceder'

``` js 
    const somethingWillHappen = () => {
        return new Promise((resolve, reject) => {
            if(true) {
                resolve ('Hey!');
            } else {
                reject ('Ups!');
            };
        });
    };

    somethingWillHappen()
        .then(response => console.log(response))
        .catch(err => console.error(err));

/* ------------------------------------ *\
    // Sengunda implementación 
\* ------------------------------------ */

    const somethingWillHappen2 = () => {
        return new Promise ((resolve, reject) => {
            if (true) {
                setTimeout(() => {
                    resolve('True');
                }, 2000)
            } else {
                const error = new Error ('Whooooops!');
                reject(error);
            };
        });
    };

    somethingWillHappen2()
        .then(response => console.log(response))
        .catch(err => console.error(err));

/* ------------------------------------ *\
    // Promise.all -> nos permite ejecutar dos promesas 
    y retornar un arreglo con los resultados
\* ------------------------------------ */

    Promise.all([somethingWillHappen(), somethingWillHappen2()])
        .then(response => {
            console.log('Array of results', response);
        })
        .catch( err => {
            console.log(err);
        })
```

#### Resolver problema con promesas

 >Clase 8

``` js 
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


// funcion principal
const fetchData = (url_api) => {

    return new Promise ((resolve, reject) => {
        
    })

}
```

`src/promesas/challenge.js`

#### Conociendo Async/await

 >Clase 9

Async/await no es mas que Syntax Sugar. Es una manera de hacer lo mismo que estabamos haciendo con .then() La clave es recordar que si una función regresa un promesa, podemos usar el keyword await, que le indicia al navagador: “Espera a que la promesa se resuleva y almacena su resultado en esta variable”. Todo esto toma lugar dentro de una función asincrona, asi que usamos async para lograr esto.

``` js
const anotherFunction = async () => {
    try {
        const something = await doSomethingAsync();
        console.log(something);
    } catch (error) {
        console.error(error)
    }
}
```

`src/async/index.js`

#### Resolver problema con Async/Await

 >Clase 10

``` js
    const fetchData = require('../utilities/fetchData');
    const API = 'https://rickandmortyapi.com/api/character/';

    const anotherFunction = async (url_api) => {
    try {
        const data = await fetchData(url_api);
        const character = await fetchData(`${API}${data.results[0].id}`);
        const origin = await fetchData(character.origin.url);

        console.log(data.info.count);
        console.log(character.name);
        console.log(origin.dimension);

    }   catch (error) {
        console.error (error);
    }
    }

    console.log('Before');
    anotherFunction(API);
    console.log('After');
```

#### callbacks vs promise vs async/await

 >Clase 11

Conclusiones

Ventajas y Desventajas

Callbacks
V = Es simple una función que recibe otra función
V = Son universales
D = Composición tosca
D = Callbacks Hell
D = Flujo poco intuitivo
D = Debemos pensar que estamos haciendo código para humanos y debe ser facil de leer
D = if FecthData, if FecthData, if FecthData y se vuelve tedioso y no se maneja excepciones

Promise
V = Fácilmente enlazable then y return, then y return y asi
V = Es poderoso // es muy recomendado para desarrolladores
D = NO maneja excepciones si no maneja un catch al final y seremos propensos a errores
D = Requiere un polyfile para ser transpilados y ser interpretados en todos los navegadores //Babbel

Async Await
V = El tradicional try - catch y manejar las excepciones de manera mas fluida
V = Mas fáciles de leer que sucedera que va a suceder
D = Ese poder que podemos decir es decir si queremos algo debemos esperar que algo suceda
D = Requiere un polyfile para ser transpilados y ser interpretados en todos los navegadores //Babbel



