import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import { FormBuilderInput, withDocument } from 'part:@sanity/form-builder'
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event'
import labels from '../support/labels'

// The patch function that sets data on the document
const createPatchFrom = value => PatchEvent.from(value === '' ? unset() : set(value))

// The custom input component
class LabelPicker extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.shape({
        condition: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    focusPath: PropTypes.array,
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }

  _inputElement = React.createRef()

  focus() {
    if (this._inputElement.current) {
      this._inputElement.current.focus()
    }
  }

  render() {
    const {
      document,
      value,
      focusPath,
      onFocus,
      onBlur,
      onChange
    } = this.props

    const { inputComponent, ...type } = this.props.type

    return (
      <>
        <FormBuilderInput
          ref={this._inputElement}
          type={type}
          value={value}
          onChange={onChange}
          path={[]}
          focusPath={focusPath}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <FormField>
          <Downshift
            onChange={selection => onChange(createPatchFrom(selection.value))}
            itemToString={item => (item ? item.value : '')}
            initialSelectedItem={{value}}
          >{({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem
            }) => (
              <div>
                <label {...getLabelProps()}>Add label: </label>
                <input {...getInputProps()} />
                <ul {...getMenuProps()}>
                  {isOpen
                    ? labels
                      .filter(item => !inputValue || item.value.includes(inputValue))
                      .map((item, index) => (
                        <li
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                              backgroundColor:
                              highlightedIndex === index ? 'lightgray' : 'white',
                              fontWeight: selectedItem === item ? 'bold' : 'normal'
                            }
                          })}
                        >
                          <span>{item.value}</span>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            )}
            </Downshift>
            {value && <span>Selected label: {value}</span>}
        </FormField>
      </>
    )
  }
}

export default withDocument(LabelPicker)
