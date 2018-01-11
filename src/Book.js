import React from 'react'
// import BookShelfChanger from './BookShelfChanger'
// import * as BooksAPI from './BooksAPI'

class Book extends React.Component {

  changeShelf = (newShelf) => {
    this.setState({sort: newShelf});
    this.props.handler(this.props.book, newShelf);
  }

  render() {
    // 有的书数据不全，这里设置了默认数据：封面-mockingBird
    // authors默认为空集, shelf默认为'';
    let imageUrl = 'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api',
        authors = [],
        shelf = 'none';
    if(this.props.book.imageLinks){
      imageUrl = this.props.book.imageLinks.thumbnail
    }
    if(this.props.book.authors){
      authors = this.props.book.authors;
    }
    if(this.props.book.shelf){
      shelf = this.props.book.shelf;
    }

    return (
      <div>
        <div className="book">
          <div className="book-top">
            <div className="book-cover"
              style={{
                width: 128,
                height: 188,
                backgroundImage: `url(${imageUrl})` }} 
            />
            <div className="book-shelf-changer">
              <select
                onChange={event => {this.changeShelf(event.target.value)}}
                value={shelf}
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
            {authors.map(author => 
              <span key={author}>{author}</span>
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Book
