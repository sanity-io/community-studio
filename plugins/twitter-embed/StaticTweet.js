import React from 'react'

import css from './StaticTweet.module.css'

// @TODO: parse text (links and mentions; escaped characters, etc.)
const TweetParagraph = ({paragraph}) => {
  return <p>{paragraph}</p>
}

const TweetMedia = ({type, url, preview_image_url}) => {
  return (
    <div className={css.media}>
      <img src={preview_image_url || url} />
      {type === 'video' && (
        <div className={css.playBtn}>
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M20.436 11.37L5.904 2.116c-.23-.147-.523-.158-.762-.024-.24.132-.39.384-.39.657v18.5c0 .273.15.525.39.657.112.063.236.093.36.093.14 0 .28-.04.402-.117l14.53-9.248c.218-.138.35-.376.35-.633 0-.256-.132-.495-.348-.633z"></path>
            </g>
          </svg>
        </div>
      )}
    </div>
  )
}

const StaticTweet = ({includes, data, statusUrl}) => {
  if (!data?.text) {
    return (
      <div>
        <p>
          Invalid tweet.{' '}
          {statusUrl && (
            <>
              Make sure it's{' '}
              <a href={statusUrl} target="_blank" rel="noopener">
                published on Twitter
              </a>
            </>
          )}
        </p>
      </div>
    )
  }
  return (
    <article className={css.root}>
      {includes?.users?.length > 0 && (
        <div>
          <span className="visually-hidden">Tweet by:</span>
          {includes.users.map((user) => (
            <a
              href={`https://twitter.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={css.authorWrapper}
            >
              <img
                className={css.authorImg}
                src={user.profile_image_url}
                alt={`${user.name || user.username}'s photo`}
              />{' '}
              <div className={css.authorName}>
                {user.name}
                <div style={{color: 'rgb(101, 119, 134)'}}>
                  @{user.username}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      <div>
        {data.text.split('\n').map((paragraph, i) => (
          <TweetParagraph paragraph={paragraph} key={i} />
        ))}
      </div>
      {includes?.media?.length > 0 && (
        <div className={css.mediaWrapper}>
          {includes.media.map((media) => (
            <TweetMedia key={media.media_key} {...media} />
          ))}
        </div>
      )}
      {data.created_at && (
        <div className={css.timestamp}>
          <span className="visually-hidden">Tweet published on: </span>
          {new Date(data.created_at).toLocaleDateString('en', {
            timeZone: 'utc',
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
      {data.public_metrics?.like_count && (
        <footer className={css.footer}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/like?tweet_id=${data.id}`}
            style={{
              '--reaction-fg': 'rgb(224, 36, 94)',
              '--reaction-bg': 'rgba(224, 36, 94, 0.1)',
            }}
            aria-label="Like in Twitter"
          >
            <div className={css.reaction}>
              💜
              {/* <HeartIcon /> */}
            </div>
            <span className="visually-hidden">Liked by: </span>
            {data.public_metrics.like_count}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={statusUrl}
            style={{
              '--reaction-fg': 'rgb(29, 161, 242)',
              '--reaction-bg': 'rgba(29, 161, 242, 0.1)',
            }}
            aria-label="Comment in Twitter"
          >
            <div className={css.reaction}>
              {/* <CommentIcon /> */}
              💬
            </div>
            <span className="visually-hidden">Replied by: </span>
            {data.public_metrics.reply_count}
          </a>
        </footer>
      )}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={statusUrl}
        className={css.twitterLogo}
        title="Open in Twitter"
      >
        {/* <TwitterMonogram /> */}
        🐦
      </a>
    </article>
  )
}

export default StaticTweet
