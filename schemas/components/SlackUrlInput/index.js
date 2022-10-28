import React, {useMemo} from 'react';
import {Card, Text, Button, TextInput, Tooltip} from '@sanity/ui';
import {useId} from '@reach/auto-id';
import {FormField} from '@sanity/base/components';
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event';
import {SlackLogo} from '../icon/SlackLogo';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const SlackUrlInput = React.forwardRef(function UrlInput(props, forwardedRef) {
  const {value, readOnly, type, markers, level, onFocus, onBlur, onChange, presence} = props;
  const inputId = useId();

  const errors = useMemo(
    () => markers.filter((marker) => marker.type === 'validation' && marker.level === 'error'),
    [markers]
  );

  const handleChange = React.useCallback(
    (event) => {
      const inputValue = event.currentTarget.value;
      onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()));
    },
    [onChange]
  );
  return (
    <FormField
      level={level}
      __unstable_markers={markers}
      title={type.title}
      description={type.description}
      __unstable_presence={presence}
      inputId={inputId}
    >
      <TextInput
        type="url"
        inputMode="url"
        id={inputId}
        customValidity={errors.length > 0 ? errors[0].item.message : ''}
        value={value || ''}
        readOnly={Boolean(readOnly)}
        placeholder={type.placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={forwardedRef}
        suffix={
          value && isValidUrl(value) && errors.length === 0 ? (
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
    </FormField>
  );
});
