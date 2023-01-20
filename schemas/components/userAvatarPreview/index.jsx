import React from 'react';

//V3FIXME
export default ({level, type, value}) => {
  return (
    <Fieldset level={level} legend={type.title} description={type.description}>
      <img src={value} alt={type.title} />
    </Fieldset>
  );
};
