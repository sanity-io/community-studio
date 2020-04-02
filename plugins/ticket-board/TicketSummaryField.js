import React from 'react'
import client from 'part:@sanity/base/client'
import categories from '../../schemas/categories'

class TicketSummaryField extends React.Component {
  state = {
    isEditing: false,
    value: null
  }

  focus() {
    this._inputElement.focus()
  }

  handleSubmit = event => {
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

  handleChange = event => {
    this.setState({value: event.target.value})
  }

  handleToggleEdit = () => {
    const {isEditing} = this.state
    this.setState({isEditing: !isEditing})
  }

  render() {
    const {ticket} = this.props
    const summary = this.state.value
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Sup?
            <input type="text" value={ticket.summary} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default TicketSummaryField
