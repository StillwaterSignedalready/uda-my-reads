import React from 'react'

// import * as BooksAPI from './BooksAPI'

class BookShelfChanger extends React.Component {

  state = {
    sort: this.props.sort
  }

  render() {
    return (
      <div className="book-shelf-changer">
        <select onChange={_ => {
          this.setState({sort: });
          this.props.handler();
        }}>
          <option value="none" disabled>Move to...</option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    )
  }
}

export default BookShelfChanger
