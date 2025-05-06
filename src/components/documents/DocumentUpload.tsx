'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { Spinner } from '@/components/ui';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  createdAt: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFileTypes: string[];
  maxFileSize: number; // in bytes
}

interface DocumentUploadProps {
  documentType: DocumentType;
  existingDocuments?: DocumentFile[];
  onUpload?: (file: DocumentFile) => Promise<void>;
  onDelete?: (fileId: string) => Promise<void>;
  disabled?: boolean;
  maxFiles?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  existingDocuments = [],
  onUpload,
  onDelete,
  disabled = false,
  maxFiles = 5,
}) => {
  const { config } = useWhiteLabel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>(existingDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update documents when existingDocuments changes
  useEffect(() => {
    setDocuments(existingDocuments);
  }, [existingDocuments]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    handleFiles(Array.from(files));
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    handleFiles(Array.from(files));
  };

  const handleFiles = async (files: File[]) => {
    setError(null);
    
    // Check if adding these files would exceed the maximum
    if (documents.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    // Validate and process each file
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const mimeType = file.type.toLowerCase();
      
      const isValidType = documentType.acceptedFileTypes.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return `.${fileExtension}` === type.toLowerCase();
        } else {
          // Check MIME type
          return mimeType === type.toLowerCase() || 
                 (type.includes('*') && mimeType.startsWith(type.split('*')[0].toLowerCase()));
        }
      });
      
      if (!isValidType) {
        errors.push(`"${file.name}" is not a valid file type. Accepted types: ${documentType.acceptedFileTypes.join(', ')}`);
        continue;
      }
      
      // Check file size
      if (file.size > documentType.maxFileSize) {
        const maxSizeMB = (documentType.maxFileSize / (1024 * 1024)).toFixed(2);
        errors.push(`"${file.name}" exceeds the maximum file size of ${maxSizeMB} MB.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
    }
    
    if (validFiles.length === 0) return;
    
    // Process valid files
    setIsUploading(true);
    
    try {
      for (const file of validFiles) {
        const newDocument: DocumentFile = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          status: 'pending',
          uploadProgress: 0,
          createdAt: new Date().toISOString(),
        };
        
        // Add to documents list
        setDocuments(prev => [...prev, newDocument]);
        
        // Start upload if onUpload is provided
        if (onUpload) {
          try {
            // Update status to uploading
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === newDocument.id 
                  ? { ...doc, status: 'uploading' } 
                  : doc
              )
            );
            
            // Simulate upload progress
            const progressInterval = setInterval(() => {
              setDocuments(prev => {
                const docIndex = prev.findIndex(doc => doc.id === newDocument.id);
                if (docIndex === -1) return prev;
                
                const doc = prev[docIndex];
                if (doc.status !== 'uploading' || doc.uploadProgress === undefined || doc.uploadProgress >= 90) {
                  clearInterval(progressInterval);
                  return prev;
                }
                
                const newDocs = [...prev];
                newDocs[docIndex] = {
                  ...doc,
                  uploadProgress: (doc.uploadProgress || 0) + Math.floor(Math.random() * 10) + 5,
                };
                return newDocs;
              });
            }, 500);
            
            // Call the onUpload function
            await onUpload(newDocument);
            
            // Clear interval and update status to success
            clearInterval(progressInterval);
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === newDocument.id 
                  ? { ...doc, status: 'success', uploadProgress: 100 } 
                  : doc
              )
            );
          } catch (err) {
            console.error('Error uploading file:', err);
            
            // Update status to error
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === newDocument.id 
                  ? { 
                      ...doc, 
                      status: 'error', 
                      errorMessage: err instanceof Error ? err.message : 'Failed to upload file' 
                    } 
                  : doc
              )
            );
          }
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (disabled) return;
    
    try {
      // Call onDelete if provided
      if (onDelete) {
        await onDelete(fileId);
      }
      
      // Remove from documents list
      setDocuments(prev => prev.filter(doc => doc.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{documentType.name}</h3>
          <p className="text-sm text-gray-500">{documentType.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Accepted file types: {documentType.acceptedFileTypes.join(', ')}
          </p>
          <p className="text-xs text-gray-500">
            Maximum file size: {formatFileSize(documentType.maxFileSize)}
          </p>
        </div>
        {documentType.required && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Required
          </span>
        )}
      </div>

      {/* File upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4 flex text-sm text-gray-600">
          <label
            htmlFor={`file-upload-${documentType.id}`}
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            style={{ color: config?.primaryColor }}
          >
            <span>Upload a file</span>
            <input
              id={`file-upload-${documentType.id}`}
              name={`file-upload-${documentType.id}`}
              type="file"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={documentType.acceptedFileTypes.join(',')}
              disabled={disabled || documents.length >= maxFiles}
              multiple={maxFiles > 1}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          {documents.length} of {maxFiles} files uploaded
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error uploading file
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File list */}
      {documents.length > 0 && (
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {documents.map((document) => (
            <li key={document.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
              <div className="w-0 flex-1 flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 flex-1 w-0 truncate">{document.name}</span>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                {document.status === 'uploading' && (
                  <div className="w-24">
                    <div className="bg-gray-200 rounded-full h-2.5 w-full">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${document.uploadProgress || 0}%`,
                          backgroundColor: config?.primaryColor 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{document.uploadProgress || 0}%</span>
                  </div>
                )}
                
                {document.status === 'success' && (
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                
                {document.status === 'error' && (
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                
                {document.url && (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    style={{ color: config?.primaryColor }}
                  >
                    View
                  </a>
                )}
                
                <button
                  type="button"
                  className="font-medium text-red-600 hover:text-red-500"
                  onClick={() => handleDeleteFile(document.id)}
                  disabled={disabled || document.status === 'uploading'}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentUpload;
