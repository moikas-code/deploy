import React, { useContext, useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import Context from '../Context';
import { Button } from '../../common/button';
import {
  dataRUIToBuffer,
  prepareFilesFromZIP,
  validateFiles,
} from '../htmlHelpers';
import { VisuallyHidden } from '../visually-hidden';
import styles from './styles.module.scss';
// import './styles.css'

const uid = Math.round(Math.random() * 100000000).toString();

export const HTMLComponent = (props) => {
  const {
    viewer,
    artifactUri,
    displayUri,
    previewUri,
    creator,
    objkt,
    onDetailView,
    preview,
    displayView,
  } = props;
  const context = useContext(Context);

  let _creator_ = false;
  let _viewer_ = false;
  let _objectId_ = false;

  if (creator && creator.address) {
    _creator_ = creator.address;
  }

  if (viewer && viewer !== undefined) {
    _viewer_ = viewer;
  }

  if (objkt) {
    _objectId_ = String(objkt);
  }

  // preview
  const iframeRef = useRef(null);
  const unpackedFiles = useRef(null);
  const unpacking = useRef(false);
  const [validHTML, setValidHTML] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [contentRef, setContentRef] = useState(null);

  const unpackZipFiles = async () => {
    unpacking.current = true;

    const buffer = dataRUIToBuffer(artifactUri);
    const filesArr = await prepareFilesFromZIP(buffer);
    const files = {};
    filesArr.forEach((f) => {
      files[f.path] = f.blob;
    });

    unpackedFiles.current = files;

    const result = await validateFiles(unpackedFiles.current);
    if (result.error) {
      console.error(result.error);
      setValidationError(result.error);
    } else {
      setValidationError(null);
    }
    setValidHTML(result.valid);

    unpacking.current = false;
  };

  // useEffect(() => {
   
  //   const handler = async (event) => {
  //     unpackZipFiles();

  //     iframeRef.current.contentWindow.postMessage(
  //       {
  //         target: 'hicetnunc-html-preview',
  //         data: unpackedFiles.current,
  //       },
  //       '*'
  //     );
  //   };

  //   window.addEventListener('message', handler);

  //   return () => window.removeEventListener('message', handler);
  // }, [artifactUri]);

  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: true,
  });

  // if (true) {
  // creator is viewer in preview
  _creator_ = _viewer_;

  // }

  return (
    <div>
      <iframe
        allow-downloads="true"
        className={styles.html}
        title="html-embed"
        src={`${artifactUri}`}
        // /?creator=${_creator_}&viewer=${_viewer_}&objkt=${_objectId_}
        sandbox="allow-scripts allow-same-origin allow-modals"
        allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
      />
    </div>
  );
};
