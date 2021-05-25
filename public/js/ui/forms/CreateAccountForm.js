"use strict";
/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  constructor(element) {
    super (element);
  };
  
   onSubmit(data) {
      const formData = new FormData();
      formData.append('name', this.element.querySelector('[name="name"]').value);
      Account.create(formData, callback => {
        App.getModal('createAccount').close();
        App.update();
        this.element.reset();
    });
  };
};

