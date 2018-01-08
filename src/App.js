import React from 'react'
import BookShelf from './BookShelf'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books:{
      currentlyReading: [],
      wantToRead: [],
      read: [],
    },
    showSearchPage: false
  }

  componentDidMount(){
    BooksAPI.getAll()
    .then(data => {
      for(let book of data){
        let chosenShelf;

        for(let shelf in this.state.books){
          // 假如state有匹配的shelf
          if(shelf === book.shelf){
            chosenShelf = shelf;
          }
        }
        // 假如state没有匹配的shelf
        if(!chosenShelf){
          this.setState(prevState => {books: prevState.books[book.shelf] = []} )

          chosenShelf = book.shelf;
        }

        this.setState(prevState => {books: prevState.books[chosenShelf].push(book)} )
      }
      console.log(this.state.books);
    });
  }
  changeShelf = (book, newShelf) => {
    let oldShelf = this.state.books[book.shelf];
    // console.log('oldShelf',book.title);
    let index = oldShelf.indexOf(book);

    this.setState(prevState => {books: prevState.books[oldShelf].splice(index,1)} )
    this.setState(prevState => {books: prevState.books[newShelf].push(book)} )
  }

  render() {
    return (
      <div className="app">
        {/* + ============== */}
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
        {/* ============== + */}
        {/* header ============== */}
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        {/* ============== header */}

        {/* BookShelfs ============== */}
        <div className="list-books-content">
            <BookShelf
              title="Currently Reading" 
              books={this.state.books.currentlyReading}
              handler={this.changeShelf}
            />
            <BookShelf
              title="Want to Read"
              books={this.state.books.wantToRead}
              handler={this.changeShelf}
            />
            <BookShelf
              title="Read"
              books={this.state.books.read}
              handler={this.changeShelf}
            />
        </div>
        {/* BookShelfs ============== */}

        {/* + ============== */}
        <div className="open-search">
          <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
        </div>
        {/* ============== + */}
      </div>
        )}
      </div>
    )
  }
}

export default BooksApp
