import React, {PropTypes} from 'react';
import {Image} from 'semantic-ui-react';
const ImageView = (props) => {
  return(
    <Image as='a' href={`/api/download/${'image'}/${props.params.url}/${props.params.name}`} src={`/files/${props.params.url}`||'/assets/images/background.png'} download/>
  );
};

ImageView.propTypes = {
  params : PropTypes.object.isRequired,
};

export default ImageView;
