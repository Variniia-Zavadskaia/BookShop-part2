'use strict'

const STORAGE_KEY = 'bookDB'

var gBooks;
_createBooks();

function getBooks(options = {}) {
    console.log(options);
    const filterBy = options.filterBy;
    const sortBy = options.sortBy;
    const page = options.page;

    var books = gBooks;

    books = _filterBooks(filterBy);

    if (sortBy.title) {
        books = books.toSorted((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.title);
    }
    if (sortBy.minRating) {
        books = books.toSorted((b1, b2) => (b1.rating - b2.rating) * sortBy.minRating);
    }
    if (sortBy.price) {
        books = books.toSorted((b1, b2) => (b1.price - b2.price) * sortBy.price)
    }

    const idx = page.idx * page.size
    books = books.slice(idx, idx + page.size)

    return books

}

// function getStats() {
//     return gBooks.reduce((acc, book) => {

//         if(book.price <= 50) acc.cheap++
//         else if(book.price <= 70) acc.moderate++
//         else acc.expensive++

//         return acc
//     }, { expensive: 0, moderate: 0, cheap: 0 })
// }

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId);
    return book;
}

function getExpensiveBookCount() {
    return gBooks.filter(book => book.price > 200).length;
}

function getAverageBookCount() {
    return gBooks.filter(book => book.price <= 200 && book.price > 80).length
}

function getCheapBookCount() {
    return gBooks.filter(book => book.price <= 80).length
}

function getPageCount(options) {
    const filterBy = options.filterBy
    const page = options.page

    const bookCount = _filterBooks(filterBy).length
    return Math.ceil(bookCount / page.size)
}

function _filterBooks(filterBy) {
    var books = gBooks;

    if (filterBy.title) books = books.filter(book => book.title.toLowerCase().includes(filterBy.title.toLowerCase()))
    if (filterBy.minRating) books = books.filter(book => book.rating >= filterBy.minRating)
    if (filterBy.minPrice) books = books.filter(book => book.price >= filterBy.minPrice)
    return books
}

function removeBook(bookId) {

    const idx = gBooks.findIndex(book => book.id === bookId);
    gBooks.splice(idx, 1);

    _saveBooksToStorage();
}

function updatePrice(bookId, newPrice) {

    const idx = gBooks.findIndex(book => book.id === bookId);
    gBooks[idx].price = newPrice;

    _saveBooksToStorage();
}

function updateBook(bookId, newTitle, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.title = newTitle
    book.price = newPrice

    _saveBooksToStorage()
    return book
}

function addBook(newTitle, newPrice) {
    var book = _createBook(newTitle, newPrice);
    gBooks.push(book);

    _saveBooksToStorage();
    return book
}

function successMsg(actStr) {
    console.log(actStr);
    onShowSuccessMsg(actStr)
    setTimeout(onHideSuccessMsg, 2000);
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY);

    if (gBooks && gBooks.length !== 0) return;

    gBooks = [
        _createBook('Lord of the Rings'),
        _createBook('Lord of the Earings'),
        _createBook('Lord of the Chains'),
        _createBook('Martin Eden'),
        _createBook('John Eden'),
        _createBook('Martin Lumen'),
        _createBook('The Shining'),
        _createBook('The Darkness'),
        _createBook('Twilight'),
        _createBook('Mumu'),
        _createBook('Muma'),
        _createBook('Mumami'),
        _createBook('Java Script'),
        _createBook('Java'),
        _createBook('C++'),
    ]
    _saveBooksToStorage()
}

function _createBook(title, price = getRandomInt(50, 300), rating = getRandomInt(1, 6)) {
    return {
        id: makeId(),
        title: title,
        price: price,
        rating: rating,
        // imgUrl: 'lori-ipsi.jpg'
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks);
}