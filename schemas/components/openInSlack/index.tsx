import {Button} from '@sanity/ui';

const OpenInSlack = ({value}: any) => (
  <div>
    <Button as="a" href={value} target="_blank" rel="noopener noreferrer">
      Open in Slack
    </Button>
  </div>
);

export default OpenInSlack;
