import React from 'react'

/**
 * Couple of things to note:
 * - width and height is set to 1em
 * - fill is `currentColor` - this will ensure that the icon looks uniform and
 *   that the hover/active state works. You can of course render anything you
 *   would like here, but for plugins that are to be used in more than one
 *   studio, we suggest these rules are followed
 **/
export default () => (
  <svg width="1em" height="1em" viewBox="0 0 94 94" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(1.200000, 1.200000)" fill="currentColor" fillRule="nonzero" stroke="currentColor" strokeWidth="2">
              <path d="M75.96,15.64 C65.9,5.58 52.54,0.04 38.32,0.04 C37.22,0.04 36.32,0.94 36.32,2.04 L36.32,15.06 C16.14,16.1 0.04,32.84 0.04,53.28 C0.04,74.38 17.2,91.56 38.32,91.56 C58.76,91.56 75.5,75.46 76.54,55.28 L89.56,55.28 C90.66,55.28 91.56,54.38 91.56,53.28 C91.56,39.06 86.02,25.7 75.96,15.64 Z M38.32,87.56 C19.42,87.56 4.04,72.18 4.04,53.28 C4.04,35.06 18.34,20.1 36.32,19.06 L36.32,53.28 C36.32,54.38 37.22,55.28 38.32,55.28 L72.54,55.28 C71.5,73.26 56.54,87.56 38.32,87.56 Z M74.58,51.28 L40.32,51.28 L40.32,17.02 L40.32,4.08 C52.72,4.58 64.3,9.64 73.14,18.46 C81.96,27.28 87.02,38.88 87.52,51.28 L74.58,51.28 Z"></path>
          </g>
      </g>
  </svg>
)