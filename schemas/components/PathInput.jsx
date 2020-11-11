import React from 'react';
import speakingurl from 'speakingurl';
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
      // Removing special characters, spaces, slashes, etc.
      finalSlug = speakingurl(finalSlug, {symbols: true});
    }

    // Finally, save this final slug to the document
    this.updateValue(finalSlug);
  };

  render() {
    const {value, type} = this.props;
    // This field is usable both for strings as well as for slugs, we need to account for these different data structures
    const strValue = type.name === 'slug' ? value?.current : value;
    return (
      <DefaultFormField
        label={type.title || type.name}
        description={type.description}
        level={this.props.level}
        // Necessary for validation warnings to show up contextually
        markers={this.props.markers}
        // Necessary for presence indication
        presence={this.props.presence}
      >
        <div className={styles.wrapper}>
          {this.state.basePath && (
            <div className={styles.url}>
              {/* Only end with trailing slash if it does not end with a =, which we use in taxonomy paths */}
              {this.state.basePath + (this.state.basePath.endsWith('=') ? '' : '/')}
            </div>
          )}
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
