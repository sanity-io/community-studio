import {Card, Inline, Radio, Text} from '@sanity/ui';
import React, {useCallback, useState, useEffect} from 'react';
import {set, unset, useClient, useFormValue, useCurrentUser} from 'sanity';

const StatusWithRoles = (props) => {
  const [userSlackId, setUserSlackId] = useState({});
  const sanityClient = useClient({apiVersion: '2022-11-30'});
  const author = useFormValue(['author']);
  const {role, id: userId} = useCurrentUser();

  const {
    onChange,
    value = '',
    id,
    focusRef,
    onBlur,
    onFocus,
    readOnly,
    schemaType: {
      options: {list},
    },
  } = props;

  const fwdProps = {id, ref: focusRef, onBlur, onFocus, readOnly};

  const handleChange = useCallback((event) => {
    const inputValue = event.currentTarget.value;
    onChange(inputValue ? set(inputValue) : unset());
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == 'person' && (_id == $userId || _id == 'drafts.' + $userId)][0].slackId`, {
        userId,
      })
      .then(setUserSlackId);
  }, []);

  const isAuthorOrAdmin = role == 'administrator' || userSlackId == author?.slackId;

  return (
    <Card padding={3} shadow={1}>
      <Inline space={3}>
        {list.map((listItem) => (
          <Inline key={listItem.value} space={2}>
            <Radio
              {...fwdProps}
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
  );
};

export default StatusWithRoles;
