//V3FIXME
import TrashIcon from 'part:@sanity/base/trash-icon';
import PublishIcon from 'part:@sanity/base/publish-icon';
import React, {Component} from 'react';
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event';
import ButtonGrid from 'part:@sanity/components/buttons/button-grid';
import DefaultFormField from 'part:@sanity/components/formfields/default';
import DefaultTextInput from 'part:@sanity/components/textinputs/default';
import Fieldset from 'part:@sanity/components/fieldsets/default';
import Button from 'part:@sanity/components/buttons/default';

import StaticTweet from './StaticTweet';

const isTweetValid = (url) =>
  typeof url === 'string' && url.startsWith('https://twitter.com/') && url.includes('status/');

const INITIAL_STATE = {
  status: 'idle',
  statusUrl: '',
  data: {},
  includes: {},
};

export default class TwitterEmbedInput extends Component {
  inputRef = React.createRef();

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      ...INITIAL_STATE,
      ...(this.props.value || {}),
    };
  }

  focus = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      statusUrl: e.target.value,
    });
  };

  clearTweet = () => {
    this.setState(INITIAL_STATE);
    this.props.onChange(PatchEvent.from(unset()));
  };

  fetchTweet = async () => {
    this.setState({
      ...this.state,
      status: 'loading',
    });
    const statusUrl = this.state.statusUrl;

    if (!isTweetValid(statusUrl)) {
      return;
    }

    const res = await fetch(`https://www.sanity.work/api/get-tweet-data?statusUrl=${statusUrl}`);
    const json = await res.json();

    if (json?.data) {
      const patch = PatchEvent.from(
        set({
          ...json,
          statusUrl,
          _type: this.props.type.name,
          _key: this.props.value?._key || Math.random().toString().replace('.', ''),
        })
      );
      this.props.onChange(patch);
      this.setState({
        ...this.state,
        status: 'idle',
        statusUrl,
        data: json.data,
        includes: json.includes,
      });
    } else {
      this.setState({
        ...this.state,
        status: 'error',
        errorTitle: json?.title,
      });
    }
  };

  render() {
    const {type} = this.props;

    return (
      <Fieldset
        legend={type.title}
        description={type.description}
        level={this.props.level}
        // Necessary for validation warnings to show up contextually
        markers={this.props.markers}
        // Necessary for presence indication
        presence={this.props.presence}
      >
        {this.state.status === 'error' && (
          <div>{this.state.errorTitle || "We couldn't fetch this tweet"}</div>
        )}
        <StaticTweet {...this.state} />
        <DefaultFormField
          label={'Status / tweet URL'}
          description={'Example: https://twitter.com/sanity_io/status/1354031530528694274'}
          level={this.props.level + 1}
          // Necessary for validation warnings to show up contextually
          markers={this.props.markers}
          // Necessary for presence indication
          presence={this.props.presence}
        >
          <DefaultTextInput
            type={'string'}
            value={this.state.statusUrl || ''}
            onChange={this.handleInputChange}
            ref={this.inputRef}
          />
        </DefaultFormField>

        <ButtonGrid>
          <Button
            onClick={this.clearTweet}
            disabled={this.state.status === 'loading'}
            color="white"
            icon={TrashIcon}
          >
            Clear
          </Button>
          <Button
            onClick={this.fetchTweet}
            loading={this.state.status === 'loading'}
            color="success"
            icon={PublishIcon}
            disabled={!isTweetValid(this.state.statusUrl)}
          >
            Fetch tweet
          </Button>
        </ButtonGrid>
      </Fieldset>
    );
  }
}
