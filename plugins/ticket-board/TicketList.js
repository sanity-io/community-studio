import React, {useState, useEffect} from 'react'
import MaterialTable, {TablePagination} from 'material-table'
import client from 'part:@sanity/base/client'
import {IntentLink} from 'part:@sanity/base/router'
import formatDistanceToNow from 'date-fns/esm/formatDistanceToNow'
import Emoji from 'react-emoji-render'
import TicketCategoryField from './TicketCategoryField'
import icons from './icons'
import ticketStatuses from '../../schemas/support/statuses'
import styles from './TicketList.css'

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const ticketStatusLookup = ticketStatuses.reduce((acc, element) => {
  const {value, title} = element
  acc[value] = title
  return acc
}, {})

const TicketTable = ({data}) => {
  const formattedData = data.map(d =>
    Object.assign({}, d, {
      timeAgo: formatDistanceToNow(new Date(d._createdAt)),
      //we're assuming everything is from a Slack channel atm.
      source: `#${d.channelName}`
    })
  )

  const columns = [
    {
      title: 'Status',
      field: 'status',
      render: ticket => (
        <IntentLink
          intent="edit"
          className={styles.link}
          params={{id: ticket._id, type: ticket._type}}
        >
          {ticketStatusLookup[ticket.status]}
        </IntentLink>
      ),
      lookup: ticketStatusLookup,
      defaultFilter: ['open']
    },
    {title: 'Author', field: 'authorName', filtering: false},
    {
      title: 'Channel',
      field: 'source',
      filtering: false,
      render: ticket => (
        <a href={ticket.permalink} className={styles.link} target="ticket">
          <Emoji text={ticket.source} />
        </a>
      )
    },
    {
      title: 'Category',
      field: 'category',
      filtering: false,
      render: ticket => <TicketCategoryField ticket={ticket} />
    },
    {title: 'Summary', field: 'summary', filtering: false},
    {
      title: 'Message',
      field: 'message',
      filtering: false,
      render: ticket => <Emoji text={ticket.message.substring(0, 100)} />
    },
    {
      title: 'Age',
      field: 'timeAgo',
      filtering: false,
      customSort: (a, b) => a._createdAt > b._createdAt
    }
  ]

  return (
    <MaterialTable
      title="🎫 Community Support Tickets"
      columns={columns}
      data={formattedData}
      icons={icons}
      options={{
        sorting: true,
        padding: 'dense',
        headerStyle: {
          backgroundColor: '#01579b',
          color: 'white',
          fontSize: '1.5em'
        },
        filtering: true,
        paging: false
      }}
    />
  )
}

const query = "*[_type == 'ticket'] | order(_createdAt asc)"

const TicketList = () => {
  const [tickets, setTickets] = useState([])
  let subscription

  useEffect(() => {
    const fetchData = async () => {
      await sleep(1500) // chances are the data isn't query-able yet
      await client.fetch(query).then(setTickets)
    }

    const listen = () => {
      subscription = client.listen(query, {visibility: 'query'}).subscribe(() => fetchData())
    }

    fetchData().then(listen)

    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])
  return <TicketTable data={tickets} className={styles.container} />
}

export default TicketList
