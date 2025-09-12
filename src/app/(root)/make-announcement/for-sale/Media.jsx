import React, { useState, useRef, useCallback, useEffect } from 'react'
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const Media = ({ 
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating 
}) => {
  // Local state for UI
  const [isDragOver, setIsDragOver] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState([])
  const fileInputRef = useRef(null)

  // Local errors fallback when parent doesn't provide setStepErrors
  const [localErrors, setLocalErrors] = useState({});

  // Helper to clear a single field error
  const clearErrorForField = useCallback((fieldName) => {
    if (typeof setStepErrors === 'function') {
      setStepErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setLocalErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [setStepErrors]);

  // Generic input change handler
  const handleInputChange = useCallback((fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    clearErrorForField(fieldName);
  }, [formik, clearErrorForField]);

  // Blur handler with validation
  const handleBlur = useCallback(async (fieldName) => {
    const currentValues = formik.values;
    const schema = getValidationSchema(5, 'default', currentValues); // Assuming step 3 for media

    try {
      await schema.validateAt(fieldName, currentValues);
      clearErrorForField(fieldName);
    } catch (err) {
      const message = err.message;
      setStepErrors
        ? setStepErrors((p) => ({ ...p, [fieldName]: message }))
        : setLocalErrors((p) => ({ ...p, [fieldName]: message }));
    }
  }, [formik, clearErrorForField, setStepErrors]);

  // Media type change handler
  const handleMediaChange = useCallback((event) => {
    const { value, checked } = event.target;
    const currentMedia = formik.values.selectedMedia || [];
    
    let newSelectedMedia;
    if (checked) {
      newSelectedMedia = [...currentMedia, value];
    } else {
      newSelectedMedia = currentMedia.filter(media => media !== value);
    }
    
    handleInputChange('selectedMedia', newSelectedMedia);
    
    // Clear uploaded files if media type changes
    if (!checked) {
      if (value === 'picture') {
        handleInputChange('images', []);
      } else if (value === 'video') {
        handleInputChange('videos', []);
      }
      // Update uploadedFiles array
      const currentUploadedFiles = formik.values.uploadedFiles || [];
      const filteredFiles = currentUploadedFiles.filter(file => {
        if (value === 'picture') return !file.type.startsWith('image/');
        if (value === 'video') return !file.type.startsWith('video/');
        return true;
      });
      handleInputChange('uploadedFiles', filteredFiles);
    }
  }, [formik.values.selectedMedia, formik.values.uploadedFiles, handleInputChange]);

  const handleFileSelect = useCallback(async (files) => {
    const selectedMedia = formik.values.selectedMedia || [];
    
    const validFiles = Array.from(files).filter(file => {
      const isValidImage = file.type === 'image/jpeg' || file.type === 'image/png';
      const isValidVideo = file.type === 'video/mp4' || file.type === 'video/avi' || file.type.startsWith('video/');
      
      let isValid = false;
      
      if (selectedMedia.includes('picture') && selectedMedia.includes('video')) {
        isValid = isValidImage || isValidVideo;
      } else if (selectedMedia.includes('picture')) {
        isValid = isValidImage;
      } else if (selectedMedia.includes('video')) {
        isValid = isValidVideo;
      }
      
      return isValid;
    });

    if (validFiles.length > 0) {
      const loadingEntries = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isLoading: true
      }));
      
      setLoadingFiles(prev => [...prev, ...loadingEntries]);
      
      for (const loadingEntry of loadingEntries) {
        const file = loadingEntry.file;
        
        if (file.type.startsWith('video/')) {
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        }
        
        const newFile = {
          id: loadingEntry.id,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          isLoading: false
        };
        
        setLoadingFiles(prev => prev.filter(f => f.id !== loadingEntry.id));
        
        // Update formik values
        const currentUploadedFiles = formik.values.uploadedFiles || [];
        const currentImages = formik.values.images || [];
        const currentVideos = formik.values.videos || [];
        
        const newUploadedFiles = [...currentUploadedFiles, newFile];
        handleInputChange('uploadedFiles', newUploadedFiles);
        
        if (file.type.startsWith('image/')) {
          handleInputChange('images', [...currentImages, newFile]);
        } else if (file.type.startsWith('video/')) {
          handleInputChange('videos', [...currentVideos, newFile]);
        }
      }
    }
  }, [formik.values.selectedMedia, formik.values.uploadedFiles, formik.values.images, formik.values.videos, handleInputChange]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (event) => {
    handleFileSelect(event.target.files);
    event.target.value = '';
  };

  const removeFile = useCallback((fileId) => {
    const currentUploadedFiles = formik.values.uploadedFiles || [];
    const currentImages = formik.values.images || [];
    const currentVideos = formik.values.videos || [];
    
    const fileToRemove = currentUploadedFiles.find(f => f.id === fileId);
    
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const newUploadedFiles = currentUploadedFiles.filter(f => f.id !== fileId);
    const newImages = currentImages.filter(f => f.id !== fileId);
    const newVideos = currentVideos.filter(f => f.id !== fileId);
    
    handleInputChange('uploadedFiles', newUploadedFiles);
    handleInputChange('images', newImages);
    handleInputChange('videos', newVideos);
  }, [formik.values.uploadedFiles, formik.values.images, formik.values.videos, handleInputChange]);

  const cancelLoading = (fileId) => {
    setLoadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Combine parent stepErrors and localErrors for display
  const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };

  // Helper functions
  const getErrorMessage = (fieldName) => displayedErrors[fieldName];
  const hasError = (fieldName) => !!displayedErrors[fieldName];

  // Get current values with fallbacks
  const selectedMedia = formik.values.selectedMedia || [];
  const uploadedFiles = formik.values.uploadedFiles || [];

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

          .error-field {
            border-color: #ef4444 !important;
          }
          
          .error-text {
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
          }
        `}
      </style>
      
      <div className="w-full h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]">
        <div className="flex items-start justify-start">
          <form className="w-full">
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Media</h5>
              {hasError('selectedMedia') && <p className="error-text">{getErrorMessage('selectedMedia')}</p>}
              <div className='flex flex-row items-center justify-center gap-12 mt-[9px]'>
                <div className='flex items-center'>
                  <input 
                    type="checkbox" 
                    id="picture" 
                    name="media" 
                    value="picture" 
                    className='svg-checkbox'
                    checked={selectedMedia.includes('picture')}
                    onChange={handleMediaChange}
                    onBlur={() => handleBlur('selectedMedia')}
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
                    checked={selectedMedia.includes('video')}
                    onChange={handleMediaChange}
                    onBlur={() => handleBlur('selectedMedia')}
                  />
                  <label htmlFor="video" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Video</label>
                </div>
              </div>
            </div>
            
            <div 
              className={`w-[736px] h-auto px-5 py-5 rounded-[13px] border-2 border-dashed transition-all duration-200 ${
                isDragOver ? 'drag-over' 
                : hasError('uploadedFiles') || hasError('images') || hasError('videos') 
                  ? 'border-[#ef4444]' 
                  : 'border-[rgba(0,0,0,0.20)]'
              } flex flex-col items-start justify-center mt-[28px]`}
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

            {/* Error messages for file validation */}
            {hasError('uploadedFiles') && <p className="error-text mt-2">{getErrorMessage('uploadedFiles')}</p>}
            {hasError('images') && <p className="error-text mt-2">{getErrorMessage('images')}</p>}
            {hasError('videos') && <p className="error-text mt-2">{getErrorMessage('videos')}</p>}

            {(uploadedFiles.length > 0 || loadingFiles.length > 0) && (
              <div className='mt-6'>
                <h6 className='text-[#000] text-[18px]/[22px] font-medium mb-4'>
                  {loadingFiles.length > 0 ? 'Fayllar yüklənir...' : 'Yüklənmiş fayllar'}
                </h6>
                <div className='space-y-3'>

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
          </form>
        </div>
      </div>
    </>
  )
}

export default Media