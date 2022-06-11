import React, { useContext } from 'react';
import classnames from 'classnames';
import Context from '../Context';
import styles from './styles.module.scss';
// import './index.css';

export const VectorComponent = ({
  viewer,
  artifactUri,
  displayUri,
  previewUri,
  creator,
  objkt,
  onDetailView,
  preview,
  displayView,
  styling
}) => {
  const context = useContext(Context);
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: onDetailView,
  });

  let _creator_ = false;
  let _viewer_ = false;
  let _objkt_ = false;

  if (creator && creator.address) {
    _creator_ = creator.address;
  }

  if (viewer !== undefined) {
    _viewer_ = viewer;
  }

  if (objkt) {
    _objkt_ = objkt;
  }

  let path;
  if (preview) {
    // can't pass creator/viewer query params to data URI
    path = previewUri;
  } else {
    path = `${artifactUri}?creator=${_creator_}&viewer=${_viewer_}&objkt=${_objkt_}`;
  }

  if (displayView) {
    return (
      <div className={styling||classes}>
        <iframe
          title="akkoros SVG renderer"
          src={displayUri}
          sandbox="allow-scripts"
          scrolling="no"
        />
      </div>
    );
  } else {
    return (
      <div className={styles.container + ' vector-container h-100 w-100'}>
        <style jsx>
          {`
            .tag-view .vector {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100%;
              height: 100%;
              transform: translateX(-50%) translateY(-50%);
              border: none;
              min-height: 0;
              min-width: 0;
            }

            .objktview .vector-container {
              pointer-events: all;
            }
          `}
        </style>
        <iframe
          className={styles.vector + ' vector'}
          title="akkoros SVG renderer"
          src={displayUri}
          sandbox="allow-scripts"
          scrolling="no"
          // onLoad={
          //   (function (e) { e.target.style.height = e.target.contentWindow.document.body.scrollHeight + "px"; }(this))
          // }
        />
      </div>
    );
  }
};