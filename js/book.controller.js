'use strict'

var gFilterBy = '';

function onInit() {
    renderBooks();
    onHideSuccessMsg();
}

function renderBooks() {
    const books = getBooks(gFilterBy);
    const elBooksList = document.querySelector('.book-list');

    const strHtmls = books.map(book =>
        `<tr>
            <td class="title">${book.title}</td>
        
            <td class="price">${book.price}</td>

            <td class="active">
                <button class="read" onclick="onShowDetails('${book.id}')">Read</button>
                <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete" onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
            </td>
        </tr>`)
    elBooksList.innerHTML = strHtmls.join('');

    renderStats();
}

function renderStats() {
    const elFooter = document.querySelector('footer')

    const elExpensiveCount = elFooter.querySelector('.expensive')
    const elAverageCount = elFooter.querySelector('.average')
    const elCheapCount = elFooter.querySelector('.cheap')

    elExpensiveCount.innerText = getExpensiveBookCount()
    elAverageCount.innerText = getAverageBookCount()
    elCheapCount.innerText = getCheapBookCount()
}

function onSearchBook(ev) {
    ev.preventDefault();

    const elInput = document.querySelector('input');
    const title = elInput.value;

    gFilterBy = title;
    renderBooks()
}

function onClearSearch(ev) {
    ev.preventDefault();

    const elInput = document.querySelector('input');
    elInput.value = '';
    gFilterBy = '';

    renderBooks()
}

function onRemoveBook(bookId) {

    removeBook(bookId);

    renderBooks();
    successMsg('Removed');
}

function onUpdateBook(bookId) {

    var newPrice = +prompt('New price:');
    updatePrice(bookId, newPrice);

    renderBooks();
    successMsg('Price Updated');
}

function onAddBook() {
    var newTitle = prompt('New title:');
    var newPrice = +prompt('New price:');

    if (newTitle === '' || newPrice === 0) {
        alert('Invalid value')
        return
    }

    console.log(newTitle, newPrice);

    addBook(newTitle, newPrice);

    renderBooks();
    successMsg('Added');
}

function onShowDetails(bookId) {
    const elModal = document.querySelector('.modal');
    const elData = elModal.querySelector('pre');

    const todo = getBookById(bookId);

    elData.innerText = JSON.stringify(todo, null, 2);
    elModal.showModal();
}

function onShowSuccessMsg(actStr) {
    console.log(actStr);
    var elModal = document.querySelector('.success-modal');
    elModal.style.display = 'block';
    console.log(elModal);
    var elModalSpan = document.querySelector('span');
    elModalSpan.innerText = 'Book ' + actStr + ' Successfuly'
    console.log(elModalSpan.innerText);
}

function onHideSuccessMsg() {
    var elModal = document.querySelector('.success-modal');
    elModal.style.display = 'none';
}
