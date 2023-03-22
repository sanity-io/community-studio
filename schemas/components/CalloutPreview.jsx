import React, {PureComponent} from 'react';
import {BulbOutlineIcon, InfoOutlineIcon, CheckmarkCircleIcon, PlugIcon} from '@sanity/icons';
// import config from 'config:sanity';
import {PortableText} from '@portabletext/react';
import css from './CalloutPreview.css';

/**
 * Adapted from Sanity.io's Protip
 */
export default class CalloutPreview extends PureComponent {
  renderBlockPreview() {
    const {body, calloutType} = this.props || {};
    if (!body) {
      return (
        <div>
          Block <strong>{calloutType}</strong> is empty 😿
        </div>
      );
    }

    try {
      const mapping = {
        protip: {
          Icon: <BulbOutlineIcon />,
          title: 'Protip',
          state: 'success',
        },
        example: {
          Icon: <PlugIcon />,
          title: 'Example',
          state: 'enterprise',
        },
        enterprise: {
          Icon: <CheckmarkCircleIcon />,
          title: 'Example',
          state: 'enterprise',
        },
        gotcha: {
          Icon: <InfoOutlineIcon />,
          title: 'Gotcha',
          state: 'warning',
        },
        editorExperience: {
          Icon: <BulbOutlineIcon />,
          title: 'Editor Experience',
          state: 'success',
        },
      };

      const {Icon, state, title} = mapping[calloutType] || mapping.protip;

      console.log('props', this.props);

      return (
        <div className={css.root} data-state={state}>
          <div className={css.header}>
            <div className={css.icon}>{Icon}</div>
            <h3 className={css.title}>{title}</h3>
          </div>
          <div className={css.body}>
            <PortableText value={body} />
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }

  render() {
    return this.renderBlockPreview();
  }
}
