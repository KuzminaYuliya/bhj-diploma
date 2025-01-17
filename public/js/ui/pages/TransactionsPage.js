"use strict";
/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) throw new Error('Передан пустой элемент');
    this.element = element;
    this.registerEvents();
  };

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update(options) {
    this.render(this.lastOptions ?  this.lastOptions : options);
  };

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener( 'click', e => this.removeAccount());
    this.element.addEventListener('click', e => this.removeTransaction(e.target.closest('.transaction__remove')));
  };

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const result = confirm( 'Вы действительно хотите удалить счёт?' );
      if (result) {
        const data = new FormData();
        data.append('id', this.lastOptions.account_id);
        Account.remove(data, () => App.update());
      }
    }
  };

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами.dataset.id
   * */
  removeTransaction(element) {
    if (element) {
      const result = confirm('Вы действительно хотите удалить эту транзакцию?');
      if (result) {
        const data = new FormData();
        data.append('id', element.dataset.id);
        Transaction.remove(data, () => App.update());
      }
    }
  };

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].id === this.lastOptions.account_id) this.renderTitle(response.data[i].name);
        };
      }); 
      Transaction.list(options, response => this.renderTransactions(response.data));
    };
  };

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  };

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  };

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const inputDate = new Date(date);
    const DMY = inputDate.toLocaleString('ru', {year: 'numeric', month: 'long', day: 'numeric'});
    const HM = inputDate.toLocaleString('ru', {hour: 'numeric', minute: 'numeric'});
    return `${DMY} в ${HM}`;
  };

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type.toLowerCase()} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum} <span class="currency">Р</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`
};

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';
    data.forEach( item => content.insertAdjacentHTML('afterbegin', this.getTransactionHTML(item)))
  };
};