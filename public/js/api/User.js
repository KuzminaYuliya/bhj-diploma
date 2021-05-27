"use strict";
/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    console.log(user)
    window.localStorage.user = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    window.localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let currentUser = window.localStorage.user;
    if (currentUser) {
      try {
        return JSON.parse(currentUser);
      } catch {
        return null;
      } 
    }
  }
  
  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({ 
      URL: this.URL + '/current',
      method: 'GET',
      responseType: 'json',
     // async,
      data: this.current(),
      callback: (err, response) => {
        if (response.success = true) {
            this.setCurrent(response.user);
        }    
        else  this.unsetCurrent();   
        callback(err, response);
      }   
    });
  }


  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      URL: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      //async,
      data: data,
      callback: (e, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
          callback();
        }
        else window.alert(response.error);
      }
    });
    //callback();
  };

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
        URL: this.URL + '/register',
        method: 'POST',
        responseType: 'json',
        //async,
        data: data,
        callback: (e, response) => {
          if (response && response.user) {
            this.setCurrent(response.user);
            callback();
          }
          else window.alert(response.error);
        }
    });
    //callback();
  };
  
  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(data, callback) {
    let currentUser = this.current();
    const formData = new FormData();
    formData.append('name', currentUser.name);
    formData.append('id', currentUser.id);
     
    createRequest({
        URL: this.URL + '/logout',
        method: 'POST',
        responseType: 'json',
        //async,
        data: formData,
        callback: (err, response) => {
          if (response) {
            this.unsetCurrent();
            callback();
          }
        }
    });
  }
};
