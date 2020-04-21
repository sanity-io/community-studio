import React from 'react'
import client from 'part:@sanity/base/client'
import actions from '../../schemas/inputs/actions'

const actionsLookup = actions.reduce((acc, element) => {
  const {value, title} = element
  acc[value] = title
  return acc
}, {})

class TicketActionField extends React.Component {
  focus() {
    this._inputElement.focus()
  }

  handleChange = event => {
    const {ticket} = this.props
    const newValue = event.target.value

    if (newValue) {
      client
        .patch(ticket._id)
        .set({action: newValue})
        .commit()
    } else {
      client
        .patch(ticket._id)
        .unset(['action'])
        .commit()
    }
  }

  render() {
    const {ticket} = this.props

    return (
      <div>
        <select value={ticket.action} onChange={this.handleChange}>
          <option key="empty" value={undefined}>
            {''}
          </option>
          {actions.map(action => {
            const {value} = action
            return (
              <option key={value} value={value}>
                {actionsLookup[value]}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

export default TicketActionField
