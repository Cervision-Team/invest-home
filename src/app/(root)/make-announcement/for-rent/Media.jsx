import React, { useState, useRef } from 'react'

const Media = () => {
  const [selectedMedia, setSelectedMedia] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleMediaChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedMedia(prev => [...prev, value])
    } else {
      setSelectedMedia(prev => prev.filter(media => media !== value))
    }
  }

  const handleFileSelect = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isValidVideo = file.type === 'video/mp4' || file.type === 'video/avi' || file.type.startsWith('video/')
      
      let isValid = false
      
      if (selectedMedia.includes('picture') && selectedMedia.includes('video')) {
        isValid = isValidImage || isValidVideo
      } else if (selectedMedia.includes('picture')) {
        isValid = isValidImage
      } else if (selectedMedia.includes('video')) {
        isValid = isValidVideo
      }
      
      return isValid
    })

    if (validFiles.length > 0) {
      // Create loading entries first
      const loadingEntries = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isLoading: true
      }))
      
      setLoadingFiles(prev => [...prev, ...loadingEntries])
      
      // Process files with simulated loading time for videos
      for (const loadingEntry of loadingEntries) {
        const file = loadingEntry.file
        
        // Simulate processing time for videos (2-4 seconds)
        if (file.type.startsWith('video/')) {
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
        }
        
        const newFile = {
          id: loadingEntry.id,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          isLoading: false
        }
        
        // Remove from loading and add to uploaded
        setLoadingFiles(prev => prev.filter(f => f.id !== loadingEntry.id))
        setUploadedFiles(prev => [...prev, newFile])
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    const files = event.dataTransfer.files
    handleFileSelect(files)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (event) => {
    handleFileSelect(event.target.files)
    event.target.value = ''
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const cancelLoading = (fileId) => {
    setLoadingFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <style>
        {`
          .svg-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }
          
          .svg-checkbox:checked {
            background-color: #1B8F7D;
            border-color: #1B8F7D;
          }
          
          .svg-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
            background-size: contain;
            background-repeat: no-repeat;
          }
          
          .svg-checkbox:hover {
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }
          
          .svg-checkbox:focus {
            outline: none;
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
          }

          .drag-over {
            border-color: #1B8F7D;
            background-color: rgba(27, 143, 125, 0.05);
          }

          .file-preview {
            max-width: 100px;
            max-height: 100px;
            object-fit: cover;
            border-radius: 8px;
          }

          .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #1B8F7D;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-bar {
            width: 100%;
            height: 4px;
            background-color: #f3f3f3;
            border-radius: 2px;
            overflow: hidden;
          }

          .loading-bar::after {
            content: '';
            display: block;
            height: 100%;
            background-color: #1B8F7D;
            animation: loading 1.5s ease-in-out infinite;
          }

          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}
      </style>
      
      <div className="w-full h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar">
        <div className="flex items-start justify-start">
          <div>
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Media</h5>
              <div className='flex flex-row items-center justify-center gap-12 mt-[9px]'>
                <div className='flex items-center'>
                  <input 
                    type="checkbox" 
                    id="picture" 
                    name="media" 
                    value="picture" 
                    className='svg-checkbox'
                    onChange={handleMediaChange}
                  />
                  <label htmlFor="picture" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Şəkil</label>
                </div>
                <div className='flex items-center'>
                  <input 
                    type="checkbox" 
                    id="video" 
                    name="media" 
                    value="video" 
                    className='svg-checkbox'
                    onChange={handleMediaChange}
                  />
                  <label htmlFor="video" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Video</label>
                </div>
              </div>
            </div>
            
            <div 
              className={`w-[736px] h-auto px-5 py-5 rounded-[13px] border-2 border-dashed border-[rgba(0,0,0,0.20)] flex flex-col items-start justify-center mt-[28px] transition-all duration-200 ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className='text-black text-center text-[16px]/[20px] font-medium'>Fayl seçin və ya bura sürükləyib bura buraxın</p>
              <p className='text-[rgba(0,0,0,0.50)] text-[16px]/[22px] mt-2'>
                {selectedMedia.includes('picture') && selectedMedia.includes('video') 
                  ? 'JPG, PNG, MP4, AVI keçərlidir.' 
                  : selectedMedia.includes('picture') 
                    ? 'Sadəcə JPG, PNG keçərlidir.'
                    : selectedMedia.includes('video')
                      ? 'MP4, AVI keçərlidir.'
                      : 'Əvvəlcə media növünü seçin.'}
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={selectedMedia.includes('picture') && selectedMedia.includes('video') 
                  ? 'image/jpeg,image/png,video/mp4,video/avi,video/*' 
                  : selectedMedia.includes('picture') 
                    ? 'image/jpeg,image/png'
                    : selectedMedia.includes('video')
                      ? 'video/mp4,video/avi,video/*'
                      : ''}
                onChange={handleFileInput}
                className="hidden"
                disabled={selectedMedia.length === 0}
              />
              
              <button 
                type="button"
                onClick={handleButtonClick}
                disabled={selectedMedia.length === 0}
                className={`w-[150px] h-[42px] bg-white border border-solid border-[#E1E6EF] rounded-[8px] flex items-center justify-center mt-5 transition-all duration-200 ${
                  selectedMedia.length === 0 
                    ? 'opacity-50 cursor-not-allowed text-gray-400' 
                    : 'text-[#1B8F7D] hover:border-[#1B8F7D] hover:bg-[#1B8F7D] hover:text-white cursor-pointer'
                }`}
              >
                <span className='text-[14px]/[22px] font-medium'>
                  {selectedMedia.includes('picture') && selectedMedia.includes('video') 
                    ? 'Fayl yüklə' 
                    : selectedMedia.includes('picture') 
                      ? 'Şəkil yüklə'
                      : selectedMedia.includes('video')
                        ? 'Video yüklə'
                        : 'Şəkil yüklə'}
                </span>
              </button>
            </div>

            {(uploadedFiles.length > 0 || loadingFiles.length > 0) && (
              <div className='mt-6'>
                <h6 className='text-[#000] text-[18px]/[22px] font-medium mb-4'>
                  {loadingFiles.length > 0 ? 'Fayllar yüklənir...' : 'Yüklənmiş fayllar'}
                </h6>
                <div className='space-y-3'>
                  {/* Loading files */}
                  {loadingFiles.map(file => (
                    <div key={file.id} className='flex items-center justify-between p-4 border border-[#E1E6EF] rounded-[8px] bg-gray-50'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-[100px] h-[100px] bg-gray-200 rounded-[8px] flex items-center justify-center'>
                          <div className='loading-spinner'></div>
                        </div>
                        <div className='flex-1'>
                          <p className='text-[#000] text-[14px]/[18px] font-medium'>{file.name}</p>
                          <p className='text-[rgba(0,0,0,0.50)] text-[12px]/[16px] mb-2'>{formatFileSize(file.size)}</p>
                          <div className='loading-bar'></div>
                          <p className='text-[#1B8F7D] text-[12px]/[16px] mt-1'>
                            {file.type.startsWith('video/') ? 'Video yüklənir...' : 'Şəkil yüklənir...'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => cancelLoading(file.id)}
                        className='text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 border border-gray-200 hover:border-gray-300 rounded transition-colors duration-200'
                      >
                        Ləğv et
                      </button>
                    </div>
                  ))}
                  
                  {/* Uploaded files */}
                  {uploadedFiles.map(file => (
                    <div key={file.id} className='flex items-center justify-between p-4 border border-[#E1E6EF] rounded-[8px] bg-white'>
                      <div className='flex items-center space-x-3'>
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} className='file-preview' />
                        ) : (
                          <div className='w-[100px] h-[100px] bg-gray-100 rounded-[8px] flex items-center justify-center'>
                            <span className='text-gray-400 text-sm'>Video</span>
                          </div>
                        )}
                        <div>
                          <p className='text-[#000] text-[14px]/[18px] font-medium'>{file.name}</p>
                          <p className='text-[rgba(0,0,0,0.50)] text-[12px]/[16px]'>{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className='text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 hover:border-red-300 rounded transition-colors duration-200'
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Media