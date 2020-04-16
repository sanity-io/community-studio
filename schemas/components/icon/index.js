import React from 'react'
import PropTypes from 'prop-types'

const Icon = ({emoji}) =>
  typeof emoji === 'string' ? (
    <span style={{fontSize: '1.5rem'}}>{emoji}</span>
  ) : (
    <span style={{fontSize: '1.5rem'}}></span>
  )

Icon.propTypes = {
  emoji: PropTypes.string.isRequired
}

export default Icon
