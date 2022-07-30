(function() {
  //create title app
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // create and return form for TODO
  function createToDoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute("disabled", "disabled");
    button.textContent = 'Добавить дело'

    input.addEventListener('input',function () {
      input.value ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'disabled')
    } )

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper)

    return { form, input, button };
  }

  //create and recieve ul
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done=false) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div')
    let doneButton = document.createElement('button')
    let deleteButton = document.createElement('button')


    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';

    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    done ? item.classList.add('list-group-item-success') : {}
    return {
      item, doneButton, deleteButton,
    }
  }

  function createTodoApp(container, title='Список дел', key=false) {

    window.keyUser = key;

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createToDoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    let allActive = new Map(JSON.parse(localStorage.getItem(keyUser)));

    for (let active of allActive) {
      let tempItem = createTodoItem(active[0], active[1])
      clicListenerkItem(tempItem);
      todoList.append(tempItem.item);
    }

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();
      allActivities = document.querySelectorAll('.list-group-item')

      if (!todoItemForm.input.value) {
        return;
      }

      /* Проверяем уникальность имени */

      let rezActive = getAllActiveFromHtml()

      if (rezActive.has(todoItemForm.input.value)) {
        alert('Задание c такми именем уже создано :-)')
        return;
       }


      let todoItem = createTodoItem(todoItemForm.input.value);
      clicListenerkItem(todoItem)


      todoList.append(todoItem.item);
      rezActive.set(todoItemForm.input.value, false)
      localStorage.setItem(keyUser, JSON.stringify(Array.from(rezActive)));

      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', 'disabled');
    })
  }

  function clicListenerkItem(el) {
    el.doneButton.addEventListener('click', function() {
      el.item.classList.toggle('list-group-item-success')
      tempRezActive = getAllActiveFromHtml()
      tempRezActive.set(el.item.textContent.slice(0, -13), el.item.classList.contains('list-group-item-success'))
      localStorage.setItem(keyUser, JSON.stringify(Array.from(tempRezActive)));
    }.bind(el))

    el.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          tempRezActive = getAllActiveFromHtml()
          tempRezActive.delete(el.item.textContent.slice(0, -13))
          localStorage.setItem(keyUser, JSON.stringify(Array.from(tempRezActive)));
          el.item.remove();
        }
    })
  }

  function getAllActiveFromHtml() {
    let rezultActiv = new Map()
    document.querySelectorAll('.list-group-item').forEach(function (e) {
    rezultActiv.set(e.textContent.slice(0, -13), e.classList.contains('list-group-item-success'))
  })
  return rezultActiv
}

  window.createTodoApp = createTodoApp;
})();
