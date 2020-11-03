import React from 'react'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'
import DefaultTextInput from 'part:@sanity/components/textinputs/default'
import DefaultFormField from 'part:@sanity/components/formfields/default'

import styles from './PathInput.module.css'

const createPatchFrom = (value) =>
  PatchEvent.from(value === '' ? unset() : set(value))


export default class PathInput extends React.Component {
  inputRef
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = { basePath: props.type.options?.basePath || '' }
  }

  focus = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  /**
   * Avoids trailing slashes, double slashes, spaces, special characters and uppercase letters
   */
  formatSlug = () => {
    let finalSlug = this.props.value || ''
    
    const formatSlugOnBlur = this.props.type.options?.formatSlug !== false
    if (formatSlugOnBlur) {
      // Removing special characters and other slug needs
      // we split slashes to avoid them being replaced with dashes
      // @TODO: get a slugify function and plug it in the line below
      // finalSlug = slugify(finalSlug)

      finalSlug = finalSlug.toLowerCase().replace(/\s/gmi, '') // placeholder for slugify
    }

    // Finally, save this final slug to the document
    this.props.onChange(createPatchFrom(finalSlug))
  }

  render() {
    const { value, onChange, type } = this.props
    return (
      <DefaultFormField
        label={type.title || type.name}
        description={type.description}
      >
        <div className={styles.wrapper}>
          {this.state.basePath && (
            <div className={styles.url}>
              {this.state.basePath + '/'}
            </div>
          )}
          <DefaultTextInput
            value={value || ''}
            type="text"
            onChange={(event) =>
              onChange(createPatchFrom(event.target.value))
            }
            onBlur={this.formatSlug}
          />
        </div>
      </DefaultFormField>
    )
  }
}
