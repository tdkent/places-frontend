import React, { useRef } from 'react'

import Button from './Button'
import './ImageUpload.css'

const ImageUpload = (props) => {
  const imgSelectRef = useRef()
  const selectImgHandler = () => {
    imgSelectRef.current.click()
  }
  const imgSelectedHandler = (e) => {
    console.log('img select', e.target)
  }
  return (
    <div className='form-control'>
      <input type='file' id={props.id} ref={imgSelectRef} style={{ display: 'none' }} accept='.jpg, .jpeg, .png' onChange={imgSelectedHandler} />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          <img src='' alt='Preview' />
        </div>
        <Button type='button' onClick={selectImgHandler}>
          SELECT
        </Button>
      </div>
    </div>
  )
}

export default ImageUpload
