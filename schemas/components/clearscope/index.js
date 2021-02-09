import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PortableText from '@sanity/block-content-to-hyperscript'
import {
  Card,
  Button,
  Container,
  Inline,
  Flex,
  Badge,
  Label,
  TextInput,
  Stack,
  Spinner,
  Text,
  Heading
} from '@sanity/ui'
import TermAnalysis from './TermAnalysis'

const CLEARSCOPE_API_URL =
  'https://www.clearscope.io/api/addons/v1/wp_report_links/'
const GUIDE_URL_ROOT = 'https://www.sanity.io/guides/'
const headers = new Headers({
  Accept: 'application/json',
  'Content-Type': 'application/json'
})

const serializers = {
  marks: {
    internalLink: ({ node }) =>
      `<a href="${node?.slug?.current}">${node?.text}</a>`
  }
}

function Clearscope({ document }) {
  const { displayed } = document
  const { _id, _type, slug, title, body, clearscope } = displayed

  if (!clearscope) {
    return (
      <Container padding={4}>
        <Card padding={4}>
          The SEO report requires a shared Clearscope Report URL. If you are in{' '}
          <a href="http://sanity.io/guest-authorship?utm_source=studio&utm_medium=community&utm_campaign=guest-authorship" rel="noreferer" target="_blank">
            the Guest Authorship program
          </a>
          , you will get this from your editor.
        </Card>
      </Container>
    );
  }

  const [report, setReport] = useState(null)
  const [evaluation, setEvaluation] = useState({})

  const debouncedEvaluation = useDebounce(displayed, 500) // change this number if too (in)frequent

  function handleFetchReport({ method = 'POST' }) {
    const [, , , , , id] = clearscope.split('/') // Only works if Clearscope URL is correct
    const post_guid = slug => GUIDE_URL_ROOT + slug?.current
    const blocks = body.filter(({ _type }) => _type == 'block') // only analyze paragraphs (for now)
    const html = `<h1>${title}</h1>${
      PortableText({ blocks, serializers }).outerHTML
    }`

    const payload =
      method === 'PATCH'
        ? {
            evaluation_html: html,
            post_title: title,
            post_url: post_guid(slug)
          }
        : {
            report_slug: id,
            post_guid: post_guid(slug),
            post_url: `https://community.sanity.tools/desk/__edit__${
              _id
            }%2Ctype%3D${_type}`,
            post_title: title
          }

    const url =
      method === 'PATCH'
        ? CLEARSCOPE_API_URL + encodeURIComponent(post_guid(slug))
        : CLEARSCOPE_API_URL

    fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        // deal with the two types of responses
        const { report: reportData, evaluation: evaluationData } = data

        if (reportData) {
          setReport(reportData)
        }

        if (evaluationData) {
          setEvaluation(evaluationData)
        }
      })
      .catch(err => console.error(err))
  }

  async function handleInitialFetchReport() {
    await handleFetchReport({ method: 'POST' })
    await handleFetchReport({ method: 'PATCH' })
  }

  useEffect(
    () => {
      if (!report) {
        handleInitialFetchReport({ method: 'POST' })
      }
      if (debouncedEvaluation) {
        handleFetchReport({ method: 'PATCH' })
      }
    },
    [debouncedEvaluation]
  )
  if (!report?.overview_url) {
    return (
      <Container margin={4}>
        <Card height="fill" padding={[3, 4, 5, 6]} sizing="border">
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        </Card>
      </Container>
    )
  }
  console.log({report})
  return (
    <Container margin={4}>
      <Stack space={2}>
        {report?.overview_url && (
          <Card padding={2}>
            <Text style={{cursor: 'pointer'}}>
              <a
                target="_blank"
                href={report?.overview_url}
                rel="noreferrer"
              >
                Open in Clearscope
              </a>
            </Text>
          </Card>
        )}
        <Card padding={2}>
          <Stack space={2}>
            <Heading as="h1">{report?.query}</Heading>
            <Inline space={2}>
              <Text muted>
                {report?.country_google_domain}: {report?.language_name}
              </Text>
            </Inline>
            <Inline space={2}>
              <Text muted>Current Content Grade: </Text>
              <Badge>{report?.front_page_evaluation?.display_content_grade_letter}</Badge>
            </Inline>
            <Inline space={2}>
              <Text muted>Suggested Content Grade:</Text>
              <Badge>{report?.suggested_content_grade}</Badge>
            </Inline>
            <Inline space={2}>
              <Text muted>Word count: {report?.front_page_evaluation?.display_word_count}</Text>
            </Inline>
            <Inline space={2}>
              <Text muted>
                Readability: {report?.front_page_evaluation?.display_fk_grade_level}
              </Text>
            </Inline>
          </Stack>
        </Card>
        <Card padding={2}>
          <Stack space={4}>
            {report?.terms?.map((term) => (
              <TermAnalysis
                key={term.id}
                evaluation={evaluation?.scanned_terms?.find(({id}) => id === term.id)}
                {...term}
              />
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )

  return debouncedValue
}

Clearscope.propTypes = {
  document: PropTypes.shape({
    displayed: PropTypes.shape({
      _id: PropTypes.string,
      _type: PropTypes.string,
      slug: PropTypes.shape({
        current: PropTypes.string
      }),
      title: PropTypes.string,
      body: PropTypes.arrayOf(PropTypes.object),
      clearscope: PropTypes.string
    })
  })
}

export default Clearscope
