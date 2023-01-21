import React, {useEffect, useState} from 'react';
import {DashboardWidgetContainer} from '@sanity/dashboard';
import {Emoji} from 'emoji-mart';
//V3FIXME
import styles from './Emoji.css';
import {useClient} from 'sanity';
const [year, month, day] = new Date().toISOString().split('T')[0].split('-');
const todayId = `slack-emojis-${day}-${month}-${year}`;

// const query = `*[_id == "${todayId}"].summary[0]`
const query = `*[_type == "emojiTracker"][0...7]`;
function EmojiTracker() {
  const [documents, setDocuments] = useState();
  const client = useClient({apiVersion: '2023-01-01'});

  const getDocuments = async () => await client.fetch(query).then(setDocuments);

  useEffect(() => getDocuments(), []);
  return (
    <DashboardWidgetContainer>
      <div className={styles.container}>
        {documents
          ? documents.map((doc) => (
              <div className={styles.content}>
                <header className={styles.header}>
                  <h2 className={styles.title}>
                    Community Mood: {new Date(doc.date).toLocaleDateString()}
                  </h2>
                </header>
                <main className={styles.main}>
                  {doc.summary.map(({_key, colonCode, count}) => (
                    <Emoji key={_key} emoji={colonCode} size={24 * (count * 0.8)} />
                  ))}
                </main>
              </div>
            ))
          : '...Loading'}
        <div className={styles.footer} />
      </div>
    </DashboardWidgetContainer>
  );
}

export const emojiTracker = (config) => ({
  name: 'emojiTracker',
  component: EmojiTracker,
  layout: config?.layout ?? {width: 'medium'},
});
