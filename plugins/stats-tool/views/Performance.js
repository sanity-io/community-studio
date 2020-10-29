import React from 'react'
import styles from '../StatsTool.css'
import ResponsiveBar from '../components/ResponsiveBar'
import ResponsiveLine from '../components/ResponsiveLine'

const Performance = ({ subset, activeSubset }) => {
  const firstResponseLine = subset.items && [
    {
      "id": "current",
      "color": "hsl(51, 70%, 50%)",
      "data": subset.items.map(item => ({
        "x": item.day,
        "y": item.firstResponse
      }))
    }
  ]

  const responseTimeLine = subset.items && [
    {
      "id": "current",
      "color": "hsl(51, 70%, 50%)",
      "data": subset.items.map(item => ({
        "x": item.day,
        "y": item.threadLength
      }))
    }
  ]
  console.log(responseTimeLine)
  return (
    <>
      <h1>Support performance</h1>

      <div className={styles.row}>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Coverage
            {subset.summary &&
              <span>
                <span>{Math.round(subset.summary.coverage[0].percentage) + '%'}</span>
              </span>
            }
          </h2>
          <div className={styles.statsContainer}>
            <ResponsiveBar
              data={subset.items ? subset.items : []}
              keys={[ 'answered', 'unanswered' ]}
              xLegend={'day'}
              yLegend={'tickets'}
              indexBy={'day'}
              showLegends
            />
          </div>
        </div>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Resolution rate
            {subset.summary &&
              <span>
                <span>{Math.round(subset.summary.resolution[1].percentage) + '%'}</span>
              </span>
            }
          </h2>
          <div className={styles.statsContainer}>
            <ResponsiveBar
              data={subset.items ? subset.items : []}
              keys={[ 'open', 'resolved' ]}
              xLegend={'day'}
              yLegend={'tickets'}
              indexBy={'day'}
              showLegends
            />
          </div>
        </div>

      </div>
      <div className={styles.row}>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Average time to first response</h2>
          <p>Needs calculation fix</p>
        </div>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Average thread length</h2>
          <div className={styles.statsContainer}>
            <ResponsiveLine
              data={responseTimeLine}
            />
          </div>
        </div>

      </div>

      <div className={styles.row}>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Average resolution time</h2>
          <p>Coming soon</p>
        </div>

        <div className={`${styles.widget} ${styles.halfWidth}`}>
          <h2>Cadence</h2>
          <p>Coming soon</p>
        </div>

      </div>
    </>
  )
}

export default Performance
