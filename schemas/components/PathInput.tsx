import { Container, Inline, Text, Card } from '@sanity/ui'
import React, { useCallback } from 'react'
import { PatchEvent, set, unset, SlugInputProps, StringInputProps, FormPatch } from 'sanity'
import speakingurl from 'speakingurl'

type Slug = {
  _type: string
  current: string
}

//V3FIXME
// @TODO: generate button (?); proper validation highlighting
export function PathInput(props: SlugInputProps | StringInputProps) {
  const { onChange, value, schemaType } = props
  // @ts-expect-error
  const { basePath, formatSlugOnBlur } = schemaType.options

  const isSlug = schemaType.jsonType === 'object' && schemaType.name === 'slug'

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value
      let currentValue = value
      // @ts-expect-error
      const customFormat = schemaType.options?.customFormat

      if (customFormat) {
        currentValue = customFormat(currentValue)
      }
      if (formatSlugOnBlur) {
        // Removing special characters, spaces, slashes, etc.
        currentValue = speakingurl(currentValue, { symbols: true })
      }

      const patchValue = isSlug ? { _type: schemaType.name, current: currentValue } : currentValue

      onChange(PatchEvent.from(value ? set(patchValue) : unset()))
    },
    [onChange, isSlug, schemaType.name],
  )

  return (
    <Inline>
      <Card padding={3} style={{ backgroundColor: 'var(--card-border-color)', border: '1px solid var(--card-border-color)' }}>
        <Text size={1}>{basePath}</Text>
      </Card>
      {props.renderDefault({
        ...props,
        /* @ts-expect-error */
        elementProps: { ...props.elementProps, onChange: handleChange },
      })}
    </Inline>
  )
}
