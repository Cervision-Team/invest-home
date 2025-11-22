import React, { useState, useRef, useCallback } from 'react'
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const Media = ({ 
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const fileInputRef = useRef(null)
  const [localErrors, setLocalErrors] = useState({});

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

  const handleInputChange = useCallback((fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    clearErrorForField(fieldName);
  }, [formik, clearErrorForField]);

  const handleBlur = useCallback(async (fieldName) => {
    const currentValues = formik.values;
    const schema = getValidationSchema(4, 'default', currentValues);
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

  const handleMediaChange = useCallback((event) => {
    const { value, checked } = event.target;
    const currentMedia = formik.values.selectedMedia || [];
    let newSelectedMedia = checked 
      ? [...currentMedia, value]
      : currentMedia.filter(media => media !== value);
    
    handleInputChange('selectedMedia', newSelectedMedia);
    
    if (!checked) {
      if (value === 'picture') handleInputChange('images', []);
      else if (value === 'video') handleInputChange('videos', []);
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
      const isValidVideo = file.type.startsWith('video/');
      if (selectedMedia.includes('picture') && selectedMedia.includes('video')) return isValidImage || isValidVideo;
      if (selectedMedia.includes('picture')) return isValidImage;
      if (selectedMedia.includes('video')) return isValidVideo;
      return false;
    });

    if (validFiles.length > 0) {
      const currentUploadedFiles = formik.values.uploadedFiles || [];
      const startOrder = currentUploadedFiles.length;
      
      const loadingEntries = validFiles.map((file, idx) => ({
        id: Date.now() + Math.random(),
        file, name: file.name, size: file.size, type: file.type,
        isLoading: true, order: startOrder + idx
      }));
      
      setLoadingFiles(prev => [...prev, ...loadingEntries]);
      const processedFiles = [];
      
      for (const loadingEntry of loadingEntries) {
        const file = loadingEntry.file;
        if (file.type.startsWith('video/')) {
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        }
        processedFiles.push({
          id: loadingEntry.id, file, name: file.name, size: file.size, type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          isLoading: false, order: loadingEntry.order
        });
        setLoadingFiles(prev => prev.filter(f => f.id !== loadingEntry.id));
      }
      
      const newUploadedFiles = [...currentUploadedFiles, ...processedFiles];
      const newImages = [...(formik.values.images || []), ...processedFiles.filter(f => f.type.startsWith('image/'))];
      const newVideos = [...(formik.values.videos || []), ...processedFiles.filter(f => f.type.startsWith('video/'))];
      
      handleInputChange('uploadedFiles', newUploadedFiles);
      handleInputChange('images', newImages);
      handleInputChange('videos', newVideos);
    }
  }, [formik.values.selectedMedia, formik.values.uploadedFiles, formik.values.images, formik.values.videos, handleInputChange]);

  // Drag and drop reorder handlers
  const handleReorderDragStart = (e, file) => {
    setDraggedItem(file);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleReorderDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleReorderDragOver = (e, file) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== file.id) {
      setDragOverItem(file);
    }
  };

  const handleReorderDrop = (e, targetFile) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetFile.id) return;

    const currentFiles = [...(formik.values.uploadedFiles || [])];
    const draggedIdx = currentFiles.findIndex(f => f.id === draggedItem.id);
    const targetIdx = currentFiles.findIndex(f => f.id === targetFile.id);

    if (draggedIdx === -1 || targetIdx === -1) return;

    // Remove dragged item and insert at target position
    const [removed] = currentFiles.splice(draggedIdx, 1);
    currentFiles.splice(targetIdx, 0, removed);

    // Update order numbers
    const reorderedFiles = currentFiles.map((file, idx) => ({ ...file, order: idx }));
    
    // Update images and videos arrays with new order
    const reorderedImages = reorderedFiles.filter(f => f.type.startsWith('image/'));
    const reorderedVideos = reorderedFiles.filter(f => f.type.startsWith('video/'));

    handleInputChange('uploadedFiles', reorderedFiles);
    handleInputChange('images', reorderedImages);
    handleInputChange('videos', reorderedVideos);
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleFileDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleFileDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleFileDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };
  const handleButtonClick = () => fileInputRef.current?.click();
  const handleFileInput = (e) => { handleFileSelect(e.target.files); e.target.value = ''; };

  const removeFile = useCallback((fileId) => {
    const currentUploadedFiles = formik.values.uploadedFiles || [];
    const fileToRemove = currentUploadedFiles.find(f => f.id === fileId);
    if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
    
    const newUploadedFiles = currentUploadedFiles
      .filter(f => f.id !== fileId)
      .map((f, idx) => ({ ...f, order: idx }));
    const newImages = newUploadedFiles.filter(f => f.type.startsWith('image/'));
    const newVideos = newUploadedFiles.filter(f => f.type.startsWith('video/'));
    
    handleInputChange('uploadedFiles', newUploadedFiles);
    handleInputChange('images', newImages);
    handleInputChange('videos', newVideos);
  }, [formik.values.uploadedFiles, handleInputChange]);

  const cancelLoading = (fileId) => setLoadingFiles(prev => prev.filter(f => f.id !== fileId));

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };
  const getErrorMessage = (fieldName) => displayedErrors[fieldName];
  const hasError = (fieldName) => !!displayedErrors[fieldName];
  const selectedMedia = formik.values.selectedMedia || [];
  const uploadedFiles = (formik.values.uploadedFiles || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <style>{`
        .svg-checkbox { appearance: none; -webkit-appearance: none; width: 24px; height: 24px; border: 2px solid #d1d5db; border-radius: 6px; background-color: white; cursor: pointer; position: relative; transition: all 0.2s ease; }
        .svg-checkbox:checked { background-color: #1B8F7D; border-color: #1B8F7D; }
        .svg-checkbox:checked::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e"); background-size: contain; background-repeat: no-repeat; }
        .svg-checkbox:hover { border-color: #1B8F7D; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
        .drag-over { border-color: #1B8F7D; background-color: rgba(27, 143, 125, 0.05); }
        .file-preview { max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 8px; }
        .loading-spinner { border: 2px solid #f3f3f3; border-top: 2px solid #1B8F7D; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-bar { width: 100%; height: 4px; background-color: #f3f3f3; border-radius: 2px; overflow: hidden; }
        .loading-bar::after { content: ''; display: block; height: 100%; background-color: #1B8F7D; animation: loading 1.5s ease-in-out infinite; }
        @keyframes loading { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        .error-text { color: #ef4444; font-size: 14px; margin-top: 4px; }
        .draggable-item { cursor: grab; transition: all 0.2s ease; }
        .draggable-item:active { cursor: grabbing; }
        .drag-over-item { border-color: #1B8F7D !important; background-color: rgba(27, 143, 125, 0.1) !important; }
        .order-badge { min-width: 28px; height: 28px; background: #1B8F7D; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
        .drag-handle { cursor: grab; padding: 8px; color: #9ca3af; transition: color 0.2s; }
        .drag-handle:hover { color: #1B8F7D; }
      `}</style>
      
      <div className="w-full h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]">
        <div className="flex items-start justify-start">
          <form className="w-full">
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Media</h5>
              {hasError('selectedMedia') && <p className="error-text">{getErrorMessage('selectedMedia')}</p>}
              <div className='flex flex-row items-center justify-center gap-12 mt-[9px]'>
                <div className='flex items-center'>
                  <input type="checkbox" id="picture" name="media" value="picture" className='svg-checkbox'
                    checked={selectedMedia.includes('picture')} onChange={handleMediaChange} onBlur={() => handleBlur('selectedMedia')} />
                  <label htmlFor="picture" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Şəkil</label>
                </div>
                <div className='flex items-center'>
                  <input type="checkbox" id="video" name="media" value="video" className='svg-checkbox'
                    checked={selectedMedia.includes('video')} onChange={handleMediaChange} onBlur={() => handleBlur('selectedMedia')} />
                  <label htmlFor="video" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Video</label>
                </div>
              </div>
            </div>
            
            <div className={`h-auto px-5 py-5 rounded-[13px] border-2 border-dashed transition-all duration-200 ${
              isDragOver ? 'drag-over' : hasError('uploadedFiles') || hasError('images') || hasError('videos') ? 'border-[#ef4444]' : 'border-[rgba(0,0,0,0.20)]'
            } flex flex-col items-start justify-center mt-[28px]`}
              onDragOver={handleFileDragOver} onDragLeave={handleFileDragLeave} onDrop={handleFileDrop}>
              <p className='text-black text-center text-[16px]/[20px] font-medium'>Fayl seçin və ya bura sürükləyib bura buraxın</p>
              <p className='text-[rgba(0,0,0,0.50)] text-[16px]/[22px] mt-2'>
                {selectedMedia.includes('picture') && selectedMedia.includes('video') ? 'JPG, PNG, MP4, AVI keçərlidir.' 
                  : selectedMedia.includes('picture') ? 'Sadəcə JPG, PNG keçərlidir.'
                  : selectedMedia.includes('video') ? 'MP4, AVI keçərlidir.' : 'Əvvəlcə media növünü seçin.'}
              </p>
              <input ref={fileInputRef} type="file" multiple
                accept={selectedMedia.includes('picture') && selectedMedia.includes('video') ? 'image/jpeg,image/png,video/*' 
                  : selectedMedia.includes('picture') ? 'image/jpeg,image/png' : selectedMedia.includes('video') ? 'video/*' : ''}
                onChange={handleFileInput} className="hidden" disabled={selectedMedia.length === 0} />
              <button type="button" onClick={handleButtonClick} disabled={selectedMedia.length === 0}
                className={`w-[150px] h-[42px] bg-white border border-solid border-[#E1E6EF] rounded-[8px] flex items-center justify-center mt-5 transition-all duration-200 ${
                  selectedMedia.length === 0 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-[#1B8F7D] hover:border-[#1B8F7D] hover:bg-[#1B8F7D] hover:text-white cursor-pointer'}`}>
                <span className='text-[14px]/[22px] font-medium'>
                  {selectedMedia.includes('picture') && selectedMedia.includes('video') ? 'Fayl yüklə' 
                    : selectedMedia.includes('picture') ? 'Şəkil yüklə' : selectedMedia.includes('video') ? 'Video yüklə' : 'Şəkil yüklə'}
                </span>
              </button>
            </div>

            {hasError('uploadedFiles') && <p className="error-text mt-2">{getErrorMessage('uploadedFiles')}</p>}
            {hasError('images') && <p className="error-text mt-2">{getErrorMessage('images')}</p>}
            {hasError('videos') && <p className="error-text mt-2">{getErrorMessage('videos')}</p>}

            {(uploadedFiles.length > 0 || loadingFiles.length > 0) && (
              <div className='mt-6'>
                <h6 className='text-[#000] text-[18px]/[22px] font-medium mb-2'>
                  {loadingFiles.length > 0 ? 'Fayllar yüklənir...' : 'Yüklənmiş fayllar'}
                </h6>
                {uploadedFiles.length > 1 && (
                  <p className='text-[rgba(0,0,0,0.50)] text-[14px]/[20px] mb-4'>
                    Sıralamaq üçün faylları sürükləyin
                  </p>
                )}
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
                      <button type="button" onClick={() => cancelLoading(file.id)}
                        className='text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 border border-gray-200 hover:border-gray-300 rounded transition-colors duration-200'>
                        Ləğv et
                      </button>
                    </div>
                  ))}
                  
                  {uploadedFiles.map((file, index) => (
                    <div key={file.id}
                      draggable onDragStart={(e) => handleReorderDragStart(e, file)} onDragEnd={handleReorderDragEnd}
                      onDragOver={(e) => handleReorderDragOver(e, file)} onDrop={(e) => handleReorderDrop(e, file)}
                      className={`draggable-item flex items-center justify-between p-4 border border-[#E1E6EF] rounded-[8px] bg-white ${
                        dragOverItem?.id === file.id ? 'drag-over-item' : ''}`}>
                      <div className='flex items-center space-x-3'>
                        {/* Order Number */}
                        <div className='order-badge'>{index + 1}</div>
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
                      <button type="button" onClick={() => removeFile(file.id)}
                        className='text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 hover:border-red-300 rounded transition-colors duration-200'>
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