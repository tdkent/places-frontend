import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'
import './ImageUpload.css'

const ImageUpload = (props) => {
  const [file, setFile] = useState()
  const [previewUrl, setPreviewUrl] = useState()
  const [isValid, setIsValid] = useState(false)
  const imgSelectRef = useRef()
  // generate preview image
  useEffect(() => {
    if (!file) return
    // FileReader is a baked-in browser API: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [file])
  const selectImgHandler = (e) => {
    // opens file selection window
    imgSelectRef.current.click()
  }
  const selectedHandler = (e) => {
    let selectedImg
    let fileIsValid = isValid
    if (e.target.files && e.target.files.length === 1) {
      selectedImg = e.target.files[0]
      setFile(selectedImg)
      setIsValid(true)
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
    }
    props.onInput(props.id, selectedImg, fileIsValid)
  }
  return (
    <div className='form-control'>
      <label>Add an Image</label>
      <input type='file' id={props.id} ref={imgSelectRef} style={{ display: 'none' }} accept='.jpg, .jpeg, .png' onChange={selectedHandler} />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Image preview:</p>}
        </div>
        <Button type='button' onClick={selectImgHandler}>
          New Pic
        </Button>
      </div>
      {!isValid && <p>{props.error}</p>}
    </div>
  )
}

export default ImageUpload
