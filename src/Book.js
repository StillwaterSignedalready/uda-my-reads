import React from 'react'
// import BookShelfChanger from './BookShelfChanger'
// import * as BooksAPI from './BooksAPI'

class Book extends React.Component {
  
  state = {
    sort: this.props.book.shelf
  }
  changeShelf = () => {
    let newShelf = event.target.value;
    let foo = this.props.handler;
    this.setState({sort: newShelf});
    foo(this.props.book, newShelf);
  }
  render() {

    return (
      <div>
        <div className="book">
          <div className="book-top">
            <div className="book-cover"
              style={{
                width: 128,
                height: 188,
                backgroundImage: `url(${this.props.book.imageLinks.thumbnail})` }} 
            />
            <div className="book-shelf-changer">
              <select
                onChange={_ => {this.changeShelf()}}
                value={this.state.sort}
              >
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title"> {this.props.book.title} </div>
          <div className="book-authors">
            {this.props.book.authors.map(author => 
              <span key={author}>{author}</span>
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Book
