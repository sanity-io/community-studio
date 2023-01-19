import React from 'react';

export default ({level, type, value}) => {
  console.log(level, type, value, 'TEST');
  return (
    // <Fieldset level={level} legend={type.title} description={type.description}>
    <img src={value} alt={type.title} />
    // </Fieldset>
  );
};
