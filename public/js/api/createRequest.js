"use strict";
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
    const baseUrl = 'http://localhost:8000';     
    const xhr = new XMLHttpRequest;
    try {
        if (options.method === 'GET') {
            let login = '?' + Object.entries(options.data).map(([ key, value ]) => `${ key }=${ value }`).join( '&' );
            //let login = `?mail=${options.data.email}&password=${options.data.password}`
            xhr.open(options.method, baseUrl + options.URL + login);
            xhr.send();
        }
        else {
            xhr.open(options.method, baseUrl + options.URL);
            xhr.send(options.data);
        }
        xhr.onload = function() {
           options.callback(null, JSON.parse(xhr.response));
        };
    }
    catch (e) {
        xhr.onerror = function() {
            console.error("Произошла ошибка: ", e);
        };
    }
};