import React from 'react'
import client from 'part:@sanity/base/client'
import categories from '../../schemas/support/categories'

const categoriesLookup = categories.reduce((acc, element) => {
  const {value, title} = element
  acc[value] = title
  return acc
}, {})

class TicketCategoryField extends React.Component {
  focus() {
    this._inputElement.focus()
  }

  handleChange = event => {
    const {ticket} = this.props
    const newValue = event.target.value

    if (newValue) {
      client
        .patch(ticket._id)
        .set({category: newValue})
        .commit()
    } else {
      client
        .patch(ticket._id)
        .unset(['category'])
        .commit()
    }
  }

  render() {
    const {ticket} = this.props

    return (
      <div>
        <select value={ticket.category} onChange={this.handleChange}>
          <option key="empty" value={undefined}>
            {''}
          </option>
          {categories.map(category => {
            const {value} = category
            return (
              <option key={value} value={value}>
                {categoriesLookup[value]}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

export default TicketCategoryField
