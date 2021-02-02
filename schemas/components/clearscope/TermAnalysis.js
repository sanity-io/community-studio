/* eslint-disable camelcase */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  Button,
  Box,
  Inline,
  Badge,
  Flex,
  Stack,
  Text,
  Heading
} from '@sanity/ui'

function TermAnalysis ({
  id,
  primary_variant,
  secondary_variants,
  normalized_importance,
  importance_percentage,
  typical_uses,
  relevant,
  heading_presence,
  heading_presence_level,
  heading_presence_color,
  evaluation = {}
}) {
  const [showInfo, setShowInfo] = useState(false)
  const handleInfo = () => {
    setShowInfo(!showInfo)
  }
  const isInUse = evaluation?.uses > 0
  const headingPresence = Math.round(heading_presence * 100) / 100 > 0.5 ? 'high' : 'low'
  return (
    <Card height="fill" padding={4} sizing="border">
      <Stack space={2}>
        <Flex flex={1} marginBottom={2} onClick={handleInfo} style={{cursor: 'pointer'}}>
          <Box flex={1}>
            <Flex flex={1} justify="space-between">
              <Inline space={2}>
                <Text>{isInUse ? '✅' : '🔲'}</Text>
                <Heading as="h4" size={1}>
                  {primary_variant}
                </Heading>
              </Inline>
              {heading_presence_level && (
                <Badge
                  mode="outline"
                  style={{
                    backgroundColor: heading_presence_color,
                    color: '#fff',
                  }}
                >
                  heading
                </Badge>
              )}
            </Flex>
          </Box>
        </Flex>
        <Box>
          <Text size={1} muted>
            Typical: {typical_uses.join('–')}
          </Text>
        </Box>
        <Card tone="positive">
          <Card
            padding={1}
            style={{
              marginRight: `${importance_percentage}%`,
              backgroundColor: 'green',
            }}
          />
        </Card>
        {showInfo && (
          <Card padding={2} tone="transparent">
            <Stack space={3}>
              <Text size={1} muted>
                Alternative variations: {secondary_variants.join(', ')}
              </Text>
              <Inline space={1}>
                <Text size={1}>Importance: </Text>
                <Text size={2} weight="semibold" as="span">
                  {normalized_importance}
                </Text>
                <Text>/10</Text>
              </Inline>
              <Inline space={1}>
                <Text size={1}>Heading presence: </Text>
                <Badge tone={headingPresence === 'high' ? 'positive' : 'caution'}>
                  {headingPresence}
                </Badge>
              </Inline>
              <Inline space={1}>
                <Text size={1}>Typical uses: </Text>
                <Text size={1}>{typical_uses.join('–')}</Text>
              </Inline>
              <Inline space={1}>
                <Text size={1}>Current uses: </Text>
                <Text size={1}>{evaluation?.uses}</Text>
              </Inline>
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
export default TermAnalysis

TermAnalysis.propTypes = {
  id: PropTypes.string.isRequired,
  primary_variant: PropTypes.string.isRequired,
  secondary_variants: PropTypes.arrayOf(PropTypes.string).isRequired,
  normalized_importance: PropTypes.number.isRequired,
  importance_percentage: PropTypes.number.isRequired,
  typical_uses: PropTypes.arrayOf(PropTypes.string).isRequired,
  relevant: PropTypes.bool.isRequired,
  heading_presence: PropTypes.number.isRequired,
  heading_presence_level: PropTypes.number.isRequired
}
