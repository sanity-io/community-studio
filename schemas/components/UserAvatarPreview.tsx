import {Box} from '@sanity/ui'
import { UrlInputProps } from 'sanity';

export function UserAvatarPreview(props: UrlInputProps) {
  const {value, schemaType} = props
  return (
    <Box>
      <img src={value} alt={schemaType.name} />
    </Box>
  );
};
