'use strict'

var gBooks;
_createBooks();

function getBooks(filterBy) {
    // if(!filterBy) return gBooks;
    return gBooks.filter(book => {
        const titleLower = book.title.toLowerCase()
        // console.log(titleLower);
        filterBy = filterBy.toLowerCase()
        // console.log(filterBy);
        return titleLower.includes(filterBy);
    })

    // const regex = new RegExp(filterBy, 'i')
    // return gBooks.filter(book => regex.test(book.title))
     // return gBooks.filter(book => book.title.toLowerCase().includes(filterBy.toLowerCase()))
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

function removeBook(bookId) {

    const idx = gBooks.findIndex(book => book.id === bookId);
    gBooks.splice(idx, 1);

    _saveBooks();
}

function updatePrice(bookId, newPrice) {

    const idx = gBooks.findIndex(book => book.id === bookId);
    gBooks[idx].price = newPrice;

    _saveBooks();
}

function addBook(newTitle, newPrice) {
    var newBook = _createBook(newTitle, newPrice);

    gBooks.push(newBook);

    _saveBooks();
}

function successMsg(actStr) {
    console.log(actStr);
    onShowSuccessMsg(actStr)
    setTimeout(onHideSuccessMsg, 2000);
}

function _createBooks() {
    gBooks = loadFromStorage('books');

    if (gBooks && gBooks.length !== 0) return;

    gBooks = [
        _createBook('Lord of the Rings', 220),
        _createBook('Martin Eden', 150),
        _createBook('The Shining', 75)
    ]
    _saveBooks()
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title: title,
        price: price,
        rating: getRandomInt(1, 6),
        // imgUrl: 'lori-ipsi.jpg'
    }
}

function _saveBooks() {
    saveToStorage('books', gBooks);
}