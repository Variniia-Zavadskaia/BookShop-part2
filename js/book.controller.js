'use strict'

const gQueryOptions = {
    filterBy: { title: '', minPrice: 0, minRating: 0 },
    sortBy: {},
    page: { idx: 0, size: 5 }
}

function onInit() {
    readQueryParams();
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

function renderTable(books){}

function renderGrid(books){}

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
    if(filterBy.minPrice !== undefined){
        gQueryOptions.filterBy.minPrice = filterBy.minPrice
    }

    console.log(gQueryOptions);
    gQueryOptions.page.idx = 0
    setQueryParams()
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
    if(sortField === 'rating') gQueryOptions.sortBy = { minRating: sortDir }
    if(sortField === 'price') gQueryOptions.sortBy = { price: sortDir }

    gQueryOptions.page.idx = 0
    setQueryParams()
    renderBooks()
}

function onNextPage() {
    const pageCount = getPageCount(gQueryOptions)

    console.log(pageCount, gQueryOptions.page.idx);

    if(gQueryOptions.page.idx === pageCount - 1) {
        gQueryOptions.page.idx = 0
    } else {
        gQueryOptions.page.idx++
    }
    setQueryParams()
    renderBooks()
}

function onPrevPage() {
    const pageCount = getPageCount(gQueryOptions)

    console.log(pageCount, gQueryOptions.page.idx);

    if(gQueryOptions.page.idx === 0) {
        gQueryOptions.page.idx = pageCount - 1
    } else {
        gQueryOptions.page.idx--
    }
    setQueryParams()
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

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        title: queryParams.get('title') || '',
        minRating: +queryParams.get('minRating') || 0
    }

    if(queryParams.get('sortBy')) {
        const prop = queryParams.get('sortBy')
        const dir = queryParams.get('sortDir')
        gQueryOptions.sortBy[prop] = dir
    }

    if(queryParams.get('pageIdx')) {
        gQueryOptions.page.idx = +queryParams.get('pageIdx')
        gQueryOptions.page.size = +queryParams.get('pageSize')
    }
    renderQueryParams()
}

function renderQueryParams() {
    
    document.querySelector('.filter-by input[type="text"]').value = gQueryOptions.filterBy.title
    document.querySelector('.filter-by select').value = gQueryOptions.filterBy.minRating
    
    const sortKeys = Object.keys(gQueryOptions.sortBy)
    const sortBy = sortKeys[0]
    const dir = gQueryOptions.sortBy[sortKeys[0]]

    document.querySelector('.sort-by select').value = sortBy || ''
    document.querySelector('.sort-desc').checked = (dir === -1) ? 'true' : 'false'
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('title', gQueryOptions.filterBy.title)
    queryParams.set('minRating', gQueryOptions.filterBy.minRating)

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if(sortKeys.length) {
        queryParams.set('sortBy', sortKeys[0])
        queryParams.set('sortDir', gQueryOptions.sortBy[sortKeys[0]])
    }

    if(gQueryOptions.page) {
        queryParams.set('pageIdx', gQueryOptions.page.idx)
        queryParams.set('pageSize', gQueryOptions.page.size)
    }

    const newUrl = 
        window.location.protocol + "//" + 
        window.location.host + 
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}
function showUserMsg(txt) {
    const elMsg = document.querySelector('.user-msg')
    const elMsgTxt = document.querySelector('.user-msg p')

    elMsgTxt.innerText = txt
    elMsg.classList.add('shown')
    setTimeout(() => elMsg.classList.remove('shown'), 2000)
}
