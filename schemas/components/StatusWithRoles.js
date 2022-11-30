import React, {forwardRef, useCallback, useState, useEffect} from 'react';
import {Card, Inline, Radio, Text} from '@sanity/ui';
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent';
import {FormField} from '@sanity/base/components';
import {withDocument} from 'part:@sanity/form-builder';
import {useId} from '@reach/auto-id';
import client from 'part:@sanity/base/client';

const sanityClient = client.withConfig({apiVersion: '2022-11-30'});

const StatusWithRoles = forwardRef((props, ref) => {
  const [userSlackId, setUserSlackId] = useState({});
  const {
    type,
    value = '',
    markers,
    presence,
    compareValue,
    onFocus,
    onBlur,
    onChange,
    document,
  } = props;

  const {
    options: {list},
  } = type;

  const {role} = window._sanityUser;

  const handleChange = useCallback((event) => {
    const inputValue = event.currentTarget.value;
    onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()));
  }, []);

  const inputId = useId();

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0].slackId`, {
        id: window._sanityUser.id,
      })
      .then(setUserSlackId);
  }, []);

  const isAuthorOrAdmin =
    role == 'administrator' || userSlackId == document.author.slackId ? true : false;

  return (
    <FormField
      description={type.description}
      title={type.title}
      compareValue={compareValue}
      __unstable_markers={markers}
      __unstable_presence={presence}
      inputId={inputId}
    >
      <Card padding={3} shadow={1} onFocus={onFocus} onBlur={onBlur} ref={ref}>
        <Inline space={3}>
          {list.map((listItem) => (
            <Inline space={2}>
              <Radio
                id={inputId}
                checked={value == listItem.value}
                name={listItem.title}
                onChange={handleChange}
                value={listItem.value}
                readOnly={!isAuthorOrAdmin}
              />
              <Text size={1} weight="semibold">
                {listItem.title}
              </Text>
            </Inline>
          ))}
        </Inline>
      </Card>
    </FormField>
  );
});

export default withDocument(StatusWithRoles);
