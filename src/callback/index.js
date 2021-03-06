function adicion(num, num2) {
    return num + num2;
}

function calc(num, num2, callback) {
    return callback(num, num2);
}

console.log(calc(2, 4, adicion))

// date

function date (callback) {
    /* console.log(new Date); se imprime inmediatamente */
    setTimeout(function () {
        let date = new Date;
        callback(date);
    }, 3000)
}

function printDate(dateNow) {
    console.log(dateNow);
}

date(printDate); // se imprime luego de 3s