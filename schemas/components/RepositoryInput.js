import React, {forwardRef, useCallback} from 'react';
import {Card, TextInput, Box, Select, Flex} from '@sanity/ui';
//V3FIXME
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent';
import {FormField} from '@sanity/base/components';
export const RepositoryInput = forwardRef((props, ref) => {
  const {
    type,
    value = '',
    readOnly,
    placeholder,
    markers,
    presence,
    compareValue,
    onFocus,
    onBlur,
    onChange,
  } = props;

  const handleChange = useCallback((event) => {
    const inputValue = event.currentTarget.value;
    onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()));
  }, []);

  return (
    <FormField
      description={type.description}
      title={type.title}
      compareValue={compareValue}
      __unstable_markers={markers}
      __unstable_presence={presence}
    >
      <Card width="100%">
        <Flex>
          <Flex as={Card} align={'center'} paddingRight={2}>
            <Select fontSize={2}>
              <option>{type.options?.prepend}</option>
            </Select>
          </Flex>
          <Box flex={1}>
            <TextInput
              value={value}
              readOnly={readOnly}
              fontSize={2}
              onChange={handleChange}
              placeholder={placeholder}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Box>
        </Flex>
      </Card>
    </FormField>
  );
});
