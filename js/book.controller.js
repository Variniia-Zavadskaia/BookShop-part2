'use strict'

const gQueryOptions = {
    filterBy: { title: '', minRating: 0 },
    sortBy: {},
    // page: { idx: 0, size: 3 }
}

function onInit() {
    renderBooks();
}

function renderBooks() {
    const elBooksList = document.querySelector('.book-list');
    const elNoResults = document.querySelector('.no-matches')
    
    const books = getBooks(gQueryOptions);

    if(books.length === 0) {
        elNoResults.classList.remove('hidden')
    } else {
        elNoResults.classList.add('hidden')
    }

    const strHtmls = books.map(book =>
        `<tr>
            <td class="title">${book.title}</td>
            <td class="price">${book.price}</td>
            <td class="rating">${book.rating}</td>
            <td class="active">
                <button class="read" onclick="onShowDetails('${book.id}')">Read</button>
                <button class="update" onclick="onUpdateBook('${book.id}', ${book.price})">Update</button>
                <button class="delete" onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
            </td>
        </tr>`)
    elBooksList.innerHTML = strHtmls.join('');

    renderStats();
}

// function renderStats() {
//     const stats = getStats()
//     console.log(stats)
// }

function renderStats() {
    const elFooter = document.querySelector('footer')

    const elExpensiveCount = elFooter.querySelector('.expensive')
    const elAverageCount = elFooter.querySelector('.average')
    const elCheapCount = elFooter.querySelector('.cheap')

    elExpensiveCount.innerText = getExpensiveBookCount()
    elAverageCount.innerText = getAverageBookCount()
    elCheapCount.innerText = getCheapBookCount()
}

function onSetFilterBy(filterBy) {
    if(filterBy.title !== undefined) {
        gQueryOptions.filterBy.title = filterBy.title
    }
    if(filterBy.minRating !== undefined) {
        gQueryOptions.filterBy.minRating = filterBy.minRating
    }

    console.log(gQueryOptions);
    // gQueryOptions.page.idx = 0
    // setQueryParams()
    renderBooks()


    // gFilterBy = elInput.value
    // renderBooks()
}

function onSetSortBy() {
    const elSortField = document.querySelector('.sort-by select')
    const elSortDir = document.querySelector('.sort-by input')

    const sortField = elSortField.value
    const sortDir = elSortDir.checked ? -1 : 1

    gQueryOptions.sortBy = {}

    if(sortField === 'title') gQueryOptions.sortBy = { title: sortDir }
    if(sortField === 'minRating') gQueryOptions.sortBy = { minRating: sortDir }

    // gQueryOptions.page.idx = 0
    // setQueryParams()
    renderBooks()
}

function onClearSearch() {
    // ev.preventDefault();
    const elTitleInput= document.querySelector('.filter-by input');
    elTitleInput.value = '';
    gQueryOptions.filterBy.title = '';

    const elRatingSelect = document.querySelector('.filter-by select');
    elRatingSelect.value = '';
    gQueryOptions.filterBy.minRating = 0;

    const elSortField = document.querySelector('.sort-by select');
    elSortField.value = '';
    const elSortDir = document.querySelector('.sort-by input');
    elSortDir.checked = false;
    // elSsection.value = '';
    // gFilterBy = '';

    renderBooks()
}

function onRemoveBook(bookId) {

    removeBook(bookId);

    renderBooks();
    showUserMsg(`Book ${bookId} deleted...`);
}

function onUpdateBook(bookId) {

    var newPrice = +prompt('New price:');
    if(!newPrice) return

    updatePrice(bookId, newPrice);

    renderBooks();
    showUserMsg(`Book ${bookId} updated`);
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
    showUserMsg(`Book ${bookId} added`);
}

function onShowDetails(bookId) {
    const elModal = document.querySelector('.modal');
    const elData = elModal.querySelector('pre');

    const book = getBookById(bookId);

    elData.innerText = JSON.stringify(book, null, 2);
    elModal.showModal();
}

function showUserMsg(txt) {
    const elMsg = document.querySelector('.user-msg')
    const elMsgTxt = document.querySelector('.user-msg p')

    elMsgTxt.innerText = txt
    elMsg.classList.add('shown')
    setTimeout(() => elMsg.classList.remove('shown'), 2000)
}
