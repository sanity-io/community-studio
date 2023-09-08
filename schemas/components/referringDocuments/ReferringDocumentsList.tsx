import {Stack, Text} from '@sanity/ui';
import {ComponentType} from 'react';
import {Preview, useSchema} from 'sanity';
import IntentLinkCard from '../../../src/components/IntentLinkCard';

export interface Document {
  _id: string;
  _type: string;
}

interface Props {
  documents: Document[];
}

const ReferringDocumentsList: ComponentType<Props> = ({documents}) => {
  const schema = useSchema();

  return (
    <Stack as="ol" space={1}>
      {documents.map((document) => {
        const schemaType = schema.get(document._type);
        return (
          <li key={document._id}>
            <IntentLinkCard
              link={{
                intent: 'edit',
                params: {
                  id: document._id,
                  type: document._type,
                },
              }}
              padding={2}
              radius={2}
            >
              {schemaType ? (
                <Preview value={document} schemaType={schemaType} />
              ) : (
                <Text as="p">
                  A document of the unknown type <em>{document._type}</em>
                </Text>
              )}
            </IntentLinkCard>
          </li>
        );
      })}
    </Stack>
  );
};

export default ReferringDocumentsList;
