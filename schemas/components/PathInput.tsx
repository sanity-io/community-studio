import React, { useCallback } from 'react';
import speakingurl from 'speakingurl';
import {PatchEvent, set, unset, SlugInputProps, StringInputProps, FormPatch} from 'sanity';
import { Container, Inline, Text,Card } from '@sanity/ui';


type Slug = {
  _type: string;
  current: string;
};

//V3FIXME
// @TODO: generate button (?); proper validation highlighting
export function PathInput(props: SlugInputProps|StringInputProps) {
  const {onChange, value, schemaType} = props;
  // @ts-expect-error
  const {basePath, formatSlugOnBlur} = schemaType.options;

  // @ts-expect-error
  const isSlug = !!value?.current;


  const handleChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    let currentValue = value;
    // @ts-expect-error
    const customFormat = schemaType.options?.customFormat;
    console.log('customFormat', customFormat)
    if (customFormat) {
      currentValue  = customFormat(currentValue)
    }
    if (formatSlugOnBlur) {
      // Removing special characters, spaces, slashes, etc.
      currentValue = speakingurl(currentValue, {symbols: true});
    }

    const patchValue = isSlug ? {_type: schemaType.name, current: currentValue} : currentValue;

  onChange(PatchEvent.from(value ? set(patchValue) : unset()));
}, [onChange, isSlug, schemaType.name]);



  return (
    <Inline>
      <Card padding={3} style={{backgroundColor: '#e6e8ec'}} >
        <Text size={1}>{basePath}</Text>
      </Card>
      {/* @ts-expect-error */}
      {props.renderDefault({...props, elementProps: {...props.elementProps, onChange: handleChange, }})}
    </Inline>
  );
}
