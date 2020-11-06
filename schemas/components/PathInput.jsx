import React from 'react';
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event';
import DefaultTextInput from 'part:@sanity/components/textinputs/default';
import DefaultFormField from 'part:@sanity/components/formfields/default';

import styles from './PathInput.module.css';

const createPatchFrom = (value) => PatchEvent.from(value === '' ? unset() : set(value));

// @TODO: generate button (?); proper validation highlighting
export default class PathInput extends React.Component {
  inputRef;
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {basePath: props.type.options?.basePath || ''};
  }

  focus = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  updateValue = (strValue) => {
    const isSlug = this.props.type.name === 'slug';
    const patchValue = isSlug ? {_type: 'slug', current: strValue} : strValue;
    this.props.onChange(createPatchFrom(patchValue));
  };

  /**
   * Avoids trailing slashes, double slashes, spaces, special characters and uppercase letters
   */
  formatSlug = () => {
    const curSlug =
      typeof this.props.value === 'string' ? this.props.value : this.props.value?.current;
    let finalSlug = curSlug || '';

    const formatSlugOnBlur = this.props.type.options?.formatSlug !== false;
    if (formatSlugOnBlur) {
      // Removing special characters and other slug needs
      // we split slashes to avoid them being replaced with dashes
      // @TODO: get a slugify function and plug it in the line below
      // finalSlug = slugify(finalSlug)

      finalSlug = finalSlug.toLowerCase().replace(/\s/gim, ''); // placeholder for slugify
    }

    // Finally, save this final slug to the document
    this.updateValue(finalSlug);
  };

  render() {
    const {value, onChange, type} = this.props;
    // This field is usable both for strings as well as for slugs, we need to account for these different data structures
    const strValue = type.name === 'slug' ? value?.current : value;
    return (
      <DefaultFormField label={type.title || type.name} description={type.description}>
        <div className={styles.wrapper}>
          {this.state.basePath && <div className={styles.url}>{this.state.basePath + '/'}</div>}
          <DefaultTextInput
            value={strValue || ''}
            type="text"
            onChange={(event) => this.updateValue(event.target.value)}
            onBlur={this.formatSlug}
          />
        </div>
      </DefaultFormField>
    );
  }
}
