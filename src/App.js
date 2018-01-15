import React from 'react'
import BookShelf from './BookShelf'
import Book from './Book'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {Route} from 'react-router-dom'
import {Link} from 'react-router-dom'


class BooksApp extends React.Component {
  state = {
    books:{
      currentlyReading: [],
      wantToRead: [],
      read: [],
    },
    query: '',
    searchedItems: []
  }

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
  /**
   * 根据关键词发出request，搜索书籍
   * 获得response后，为了同一本书在搜索和书架中状态一致
   * 将response中已经存在于书架的书籍对象替换为它在书架中的映射
   * @param  {string} query 在input搜索栏输入的关键词
   */
  searchBooks(query){
    if(query){
      BooksAPI.search(query)
      .then(books => {
        // 载入数据，更新dom
        if(Array.isArray(books)){
          // 遍历books，若其中的书已存在于书架中，则将books中的该书对象替换为书架中的对象（为了取得一致的状态）
          for(let [index, book] of books.entries()){
            let existedInShelf = false,
                shelfs = this.state.books ;
            // 如果已存在于书架中
            for(let shelfName in shelfs){
              for(let bookInShelf of shelfs[shelfName]){
                if(bookInShelf.id == book.id){
                  // 替换
                  books[index] = bookInShelf;
                }
              }
            }
          }
          this.setState({searchedItems: books})
        }else{
          alert('抱歉，未找到您搜索的书籍');
        }
      });
    }
  }
  /**
   * 对书架中的select操作（换书架或删除该书）进行处理
   * @param  {object} book     要调整的那本书
   * @param  {string} newShelf 两种情况：1.换书架 2.删除书: none
   */
  changeShelf = (book, newShelf) => {
    // 通知服务器
    BooksAPI.update(book, newShelf);
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
      // 用户在select中选择了none 先把book.shelf设为undefined 再从数组中删除
      this.setState(prevState => {books: prevState.books[oldShelfName][index].shelf = undefined} );
      this.setState(prevState => {books: prevState.books[oldShelfName].splice(index,1)} );
    }
  }
  /**
   * 对搜索中的select操作进行处理
   * @param  {object} book     两种情况：
   *   1.对已存在于书架中的书换书架或删除，等同于changeShelf
   *   2.向书架添加未添加的书(主要情况)
   * @param  {string} newShelf option
   */
  addBook = (book, newShelf) => {
    // 对已存在于书架中的书换书架或删除，此时addBook等同于changeShelf
    if(typeof book.shelf === 'string'){
      this.changeShelf(book, newShelf);
    }
    // 向书架添加未添加的书(主要情况)
    else if(newShelf != 'none'){
      book.shelf = newShelf;
      this.setState(prevState => {books: prevState.books[newShelf].push(book)} );
      BooksAPI.update(book, newShelf);
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
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    onPaste={event => {
                      this.searchBooks(event.target.value);
                    }}
                    onKeyPress={event => {
                      if(event.key == 'Enter'){
                          this.searchBooks(event.target.value);
                      }
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
