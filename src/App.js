import React from 'react'
import BookShelf from './BookShelf'
import Book from './Book'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {Route} from 'react-router-dom'
import {Link} from 'react-router-dom'


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
    query: '',
    searchedItems: []
  }
  // updateQuery(query){
  //   this.setState({query: query});
  //   BooksAPI
  // }
  clearQuery(query){
    this.setState({query: ''});
  }
  /**
   * 初始化，从服务器加载数据，并分类
   */
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
    });
  }
  searchBooks(query){
    // console.log('state.query',this.state.query);
    if(query){
      BooksAPI.search(query)
      .then(books => {
        if(books instanceof Array){
          this.setState({searchedItems: books})
        }
      });
    }
  }
  /**
   * 对select操作进行处理 - 有三种情况
   * @param  {object} book     要调整的那本书
   * @param  {string} newShelf option
   */
  changeShelf = (book, newShelf) => {
    // 用户更改了book的shelf
    let oldShelf = this.state.books[book.shelf],
        oldShelfName = book.shelf;
    let index = oldShelf.indexOf(book);
    if(newShelf != 'none'){
      // setState操作异步合并
      this.setState(prevState => {books: prevState.books[oldShelfName].splice(index,1)} );
      this.setState(prevState => {books: prevState.books[newShelf].push(book)} );
      book.shelf = newShelf;
    }else{
      // 用户在select中选择了none
      this.setState(prevState => {books: prevState.books[oldShelfName].splice(index,1)} );
    }
  }
  addBook = (book, newShelf) => {
    if(newShelf != 'none'){
      book.shelf = newShelf;
      this.setState(prevState => {books: prevState.books[newShelf].push(book)} );
    }
  }
  render() {

    return (
      <div className="app">
        {/* + ============== */}
        <Route
          path="/search"
          render={_ => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  {/*
                    NOTES: The search from BooksAPI is limited to a particular set of search terms.
                    You can find these search terms here:
                    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                    you don't find a specific author or title. Every search is limited by search terms.
                  */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    onPaste={event => {
                      this.searchBooks(event.target.value);
                    }}
                    onChange={event => {
                      this.searchBooks(event.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {this.state.searchedItems.map(book => 
                    <li key={book.id}>
                      <Book
                        handler={this.addBook}
                        book={book}
                      />
                    </li>
                  )}
                </ol>
              </div>
            </div>
          )}
        />
        {/* ============== + */}
        <Route
          path="/"
          exact
          render={_ => (
            <div className="list-books">
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
                <Link to="/search">
                  Add a book
                </Link>
              </div>
              {/* ============== + */}
            </div>
          )}
        />
      </div>
    )
  }
}

export default BooksApp
