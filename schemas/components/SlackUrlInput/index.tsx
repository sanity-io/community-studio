import React, {useCallback} from 'react';
import {Card, Text, Button, TextInput, Tooltip} from '@sanity/ui';
import {set, unset} from 'sanity';
import {SlackLogo} from '../icons/SlackLogo';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const SlackUrlInput = (props) => {
  const {onChange, value = '', id, focusRef, onBlur, onFocus, readOnly} = props;
  const fwdProps = {id, ref: focusRef, onBlur, onFocus, readOnly};

  const handleChange = useCallback(
    (event) => onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset()),
    [onChange]
  );

  return (
    <TextInput
      type="url"
      inputMode="url"
      {...fwdProps}
      value={value || ''}
      readOnly={Boolean(readOnly)}
      onChange={handleChange}
      suffix={
        value && isValidUrl(value) ? (
          <Tooltip
            content={
              <Card padding={2} margin={1}>
                <Text>Open in Slack</Text>
              </Card>
            }
          >
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={value}
              mode="ghost"
              icon={<SlackLogo />}
            />
          </Tooltip>
        ) : null
      }
    />
  );
};
