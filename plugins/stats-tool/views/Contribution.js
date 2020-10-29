import React from 'react'
import styles from '../StatsTool.css'
import ResponsiveBar from '../components/ResponsiveBar'

const Contribution = ({ subset, activeSubset }) => {
  return (
    <>
      <h1>Community contributions</h1>
      <div className={`${styles.widget} ${styles.halfWidth}`}>
        <h2>Dependency: community flywheel project</h2>
        <p>This view will appear when we introduce new data points as part of the community flywheel project.</p>
      </div>
    </>
  )
}

export default Contribution
