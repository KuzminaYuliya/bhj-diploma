"use strict";
/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback) {
      createRequest({ 
        URL: this.URL,
        method: 'GET',
        responseType: 'json',
        data: id,
        callback: (e, response) => {
            if (response) callback(response);
            }
      });
  };
};

