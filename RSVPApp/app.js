// In RSVP app, data will not be sent to a remote server, and won't be leaving current page.

// Example of defensive programming: Using DOMContentLoaded event allows script tag to be placed elsewhere in index.html. Browser loads JS code, but waits until DOM Content is parsed and loaded before running JS code against it.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("registrar");
  const input = form.querySelector("[type=text]");
  const mainDiv = document.querySelector("[class=main]");
  const ul = document.getElementById("invitedList");

  // add div, label, and input elements into HTML.
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckbox = document.createElement('input');

  filterLabel.textContent = "Hide those who haven't responded";
  filterCheckbox.type = 'checkbox';
  filterLabel.appendChild(filterCheckbox);
  div.appendChild(filterLabel);
  mainDiv.insertBefore(div, ul);

  // filter confirmed invitee using event handler using "change" event type
  filterCheckbox.addEventListener("change", (e) => {
    const filterCheckbox = e.target;
    const checked = filterCheckbox.checked;
    const listItems = ul.children;
    if (checked) {
      for (i = 0; i < listItems.length; i++) {
        let listItem = listItems[i];
        if (listItem.className !== 'responded') {
          listItem.style.display = 'none'; // makes listItem invisible
        }
      }
    } else {
      for (i = 0; i < listItems.length; i++) {
        let listItem = listItems[i];
        listItem.style.display = '';
      }
    }
  })

  // const items = JSON.parse(localStorage.getItem('items')) || [];
  // create list element, refactored
  function createLi(invitee) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }

    function appendToLi(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement('li');
    const span = appendToLi('span', 'textContent', invitee);
    appendToLi('p', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkbox'));
    const editButton = appendToLi('button', 'textContent', 'edit');
    const removeButton = appendToLi('button', 'textContent', 'remove');

    const texts = {
      text: span.textContent
    }

    // items.push(texts);
    // console.log(items);
    // localStorage.setItem('items', JSON.stringify(items));
    return li;
  }


  // In general, a `submit` event type is fired only on the <form> element, when user either clicks Submit or hits Enter.
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent brower's default behavior of sending into to URL and loading that URL when HTML form is submitted.
    if (input.value.length > 0 && input.value.match(/[a-z]/i)) {
      const invitee = input.value;
      input.value = '';
      const li = createLi(invitee);
      ul.appendChild(li);
    }
  });

  // Instead of adding an event handler to each checkbox created, add a single delegated event handler to just one element, <ul>. Due to event bubbling, an event that occurs on one element (i.e. checkboxInput) bubbles up to its parent (i.e. <label>) or other ancestors (i.e. <ul>). Due to event delegation, the action of changing className is delegated down to its children, specifically a <li>.

  // "change" event type fires when <input>, <select>, or <textarea> value has changed.
  ul.addEventListener("change", (e) => {
    const checkboxInput = e.target; // references to element that received the event, which is an input element
    const checked = checkboxInput.checked; // returns a boolean
    const li = checkboxInput.parentNode.parentNode; // DOM traversal to <label> then to <li>
    if (checked) {
      li.className = "responded";
    } else {
      li.className = '';
    }
  })

  // use a single delegated handler on the parent element <ul>, to receive the button click event because user may add, edit, and remove lots of names to list.
  ul.addEventListener("click", (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target; // reference button element that received event
      const li = button.parentNode;
      const ul = li.parentNode;

      const removeLi = function() {
        ul.removeChild(li);
      }

      const editName = function() {
        // move list item to editing state
        const span = li.firstElementChild;
        const editNameInput = document.createElement('input');
        editNameInput.type = 'text';
        editNameInput.value = span.textContent;
        li.replaceChild(editNameInput, span);
          // alternative to li.replaceChild():
          // li.insertBefore(editNameInput,span);
          // li.removeChild(span);
        button.textContent = 'save';
      }

      const saveName = function() {
        // move list item to saved state
        const editNameInput = li.firstElementChild;
        const span = document.createElement('span');
        span.textContent = editNameInput.value;
        li.replaceChild(span, editNameInput);
        button.textContent = 'edit';
      }

      const nameActions = {
        remove: removeLi,
        edit: editName,
        save: saveName
      }

      nameActions[button.textContent]();
    }
  });

  createLi(input.value)
});
