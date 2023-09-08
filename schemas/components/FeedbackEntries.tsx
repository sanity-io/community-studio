import {OkHandIcon, CommentIcon} from '@sanity/icons';
import {Container, Stack, Text, Spinner, Card, Grid, Inline, Label, Flex} from '@sanity/ui';
import React from 'react';
import {useClient} from 'sanity';
import {ratings} from '../documents/feedback';

const FeedbackCard = ({feedback}) => {
  return (
    <Card padding={3} border radius={2}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text size={4}>{ratings[String(feedback.rating)]}</Text>
          <Label size={3}>{feedback._createdAt.split('T')[0]}</Label>
        </Flex>
        {feedback.comment ? (
          <Text>{feedback.comment}</Text>
        ) : (
          <Text style={{fontStyle: 'italic'}} muted>
            No comment given
          </Text>
        )}
      </Stack>
    </Card>
  );
};

const QUERY = /* groq */ `
{
  "upvoteCount": coalesce(
    count(*[_id == $curatedId].upvotes),
    0
  ),
  "feedback": *[
    _type == "feedback" &&
    !(_id in path("drafts.**")) &&
    contribution._ref == $contributionId
  ] {
    _id,
    _createdAt,
    rating,
    comment,
  }
}
`;

const FeedbackEntries = ({documentId, document}) => {
  const client = useClient({
    apiVersion: '2021-03-25',
  });
  const [data, setData] = React.useState(); // { upvoteCount: number; feedback: Object[] }
  const [status, setStatus] = React.useState('loading'); // error | success
  const {displayed} = document;

  async function fetchData() {
    try {
      const data = await client.fetch(QUERY, {
        curatedId: `curated.${documentId}`,
        contributionId: documentId,
      });
      if (typeof data.upvoteCount === 'number' && Array.isArray(data.feedback)) {
        setData(data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  }
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container width={3} padding={4} sizing="border">
      <Stack space={5}>
        <Stack space={3}>
          <Text size={4} weight="bold">
            Feedback for {displayed.title || 'untitled contribution'}
          </Text>
          <Text size={3}>
            Don't be disheartened by low numbers. We've only added reactions to the Sanity Exchange
            recently.
          </Text>
        </Stack>
        {status === 'loading' && <Spinner size={3} />}
        {status === 'error' && (
          <Stack space={2}>
            <Text>Something went wrong.</Text>
            <Text>
              Please try reloading this view or get in touch in the{' '}
              <a href="https://slack.sanity.io/" target="_blank" rel="noopener">
                community Slack
              </a>
              .
            </Text>
          </Stack>
        )}
        {status === 'success' && (
          <>
            <Text size={3}>
              <Inline space={2}>
                <OkHandIcon />
                <span>
                  <strong>{String(data?.upvoteCount || 0)}</strong> upvote
                  {(data?.upvoteCount || 0) !== 1 ? 's' : ''}
                </span>
              </Inline>
            </Text>
            <Stack space={4} marginTop={3}>
              <Text size={3}>
                <Inline space={2}>
                  <CommentIcon />
                  Feedback
                </Inline>
              </Text>
              {data?.feedback?.length > 0 ? (
                <Grid columns={[1, 2, 3]} gap={3} sizing="border">
                  {data.feedback.map((feedback) => (
                    <FeedbackCard key={feedback._id} feedback={feedback} />
                  ))}
                </Grid>
              ) : (
                <Text size={2}>No feedback received yet</Text>
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default FeedbackEntries;
