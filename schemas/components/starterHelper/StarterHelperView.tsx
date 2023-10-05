import {Image, Reference, SanityDocument} from '@sanity/types';
import {Box, Button, Card, Flex, Stack, Text, TextArea, useToast} from '@sanity/ui';
import React, {useCallback, useMemo} from 'react';
// @ts-expect-error types not installed
import styled from 'styled-components';
// @ts-expect-error types not installed
import {CopyToClipboard} from 'react-copy-to-clipboard';
import imageUrlBuilder from '@sanity/image-url';
import { useClient } from 'sanity'
import {CopyIcon} from '@sanity/icons';

const client = useClient({
  apiVersion: '2023-01-01',
});

const urlBuilder = imageUrlBuilder(client);

interface StarterTemplateDoc extends SanityDocument {
  studioVersion?: number;
  warningv2?: string;
  title?: string;
  description?: string;
  slug?: {current?: string};
  repository?: string;
  demoURL?: string;
  image?: Image;
  authors?: Reference[];

  //not used for studio v3
  deploymentType?: string;
  vercelDeployLink?: string;
  repoId?: string;
}

export interface StarterHelperViewProps {
  document?: {
    displayed?: StarterTemplateDoc;
  };
}

const RootBox = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export function StarterHelperView({document}: StarterHelperViewProps) {
  const doc = document?.displayed;

  if (!doc || doc.studioVersion !== 3) {
    return (
      <RootBox padding={4}>
        <Card padding={4}>Nothing of relevance to show.</Card>
      </RootBox>
    );
  }

  return (
    <RootBox>
      <Card padding={4}>
        <VercelHelper doc={doc} />
      </Card>
    </RootBox>
  );
}

export function VercelHelper({doc}: {doc: StarterTemplateDoc}) {
  const toast = useToast();
  const emitCopyToast = useCallback(() => {
    toast.push({
      status: 'info',
      title: 'Vercel deploy link copied',
    });
  }, []);

  const {title, description, repository, demoURL, image} = doc;

  const vercelDeployLink = useMemo(() => {
    let splitRepo = repository?.split('/');
    const templateRepoName = splitRepo?.[splitRepo.length - 1];
    const projectName = repository?.replace(/(template-|sanity-template-)/g, '');

    const props = {
      'repository-url': repository,
      'project-name': projectName,
      'repository-name': projectName,
      'demo-title': title,
      'demo-description': description,
      'demo-url': demoURL,
      'demo-image': image?.asset ? urlBuilder.image(image).url() : undefined,
      'integration-ids': 'oac_hb2LITYajhRQ0i4QznmKH7gx',
      // we might want to include framework ids in the external-id in the future, but for now we dont.
      // It is therefore left as an empty string, hence the leading ;
      // (with framework it would be `${frameworkId};template=${templateRepoName}`)
      'external-id': `;template=${templateRepoName}`,
    };

    const hasUndefinedProps = Object.entries(props).find(([key, value]) => value === undefined);

    if (hasUndefinedProps) {
      return undefined;
    }

    const searchParams = new URLSearchParams();
    Object.entries(props).forEach(([key, value]) => {
      searchParams.set(key, value ?? '');
    });

    return `https://vercel.com/new/clone?${searchParams.toString()}`;
  }, [doc]);

  if (!vercelDeployLink) {
    return (
      <Card tone="critical" padding={2} border>
        <Text>Missing required fields to generate deploy link.</Text>
      </Card>
    );
  }

  return (
    <Stack space={2}>
      <Flex gap={4}>
        <Box>
          <Button as={'a'} href={vercelDeployLink} tone="primary" text="Vercel deploy" />
        </Box>
        <Flex flex={1} gap={1}>
          <Box flex={1}>
            <TextArea size={1} rows={3} fontSize={0} padding={2} value={vercelDeployLink} muted />
          </Box>
          <Box>
            <CopyToClipboard text={vercelDeployLink} onCopy={emitCopyToast}>
              <Button mode="ghost" icon={CopyIcon} padding={3} title="Copy link" />
            </CopyToClipboard>
          </Box>
        </Flex>
      </Flex>
    </Stack>
  );
}
