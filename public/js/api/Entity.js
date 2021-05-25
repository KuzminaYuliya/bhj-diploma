"use strict";
/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static url = '';
   /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
      createRequest({ 
        URL: this.URL,
        method: 'GET',
        responseType: 'json',
        data: data,
        callback: (e, response) => {
          if (response) callback(response);
        }
      });
  };
    /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    createRequest({ 
      URL: this.URL,
      method: 'PUT',
      responseType: 'json',
      data: data,
      callback: callback()
    });
    callback();
  };
  
   /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    createRequest({ 
      URL: this.URL,
      method: 'DELETE',
      responseType: 'json',
      data: data,
      callback: (e, response) => {
        if (response) callback(response);
      }
    });
    //callback();
  }
};