'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import DocumentUpload, { DocumentFile, DocumentType } from './DocumentUpload';
import { Spinner } from '@/components/ui';

interface DocumentUploadContainerProps {
  entityId?: string;
  entityType: 'loan' | 'member' | 'savings';
  onComplete?: (allDocumentsUploaded: boolean) => void;
  disabled?: boolean;
}

const DocumentUploadContainer: React.FC<DocumentUploadContainerProps> = ({
  entityId,
  entityType,
  onComplete,
  disabled = false,
}) => {
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<Record<string, DocumentFile[]>>({});

  // Fetch document types and existing documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Mock document types based on entityType
        let mockDocumentTypes: DocumentType[] = [];
        
        if (entityType === 'loan') {
          mockDocumentTypes = [
            {
              id: 'valid-id',
              name: 'Valid ID',
              description: 'Upload a government-issued ID (e.g., Driver\'s License, Passport, SSS ID)',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'proof-of-income',
              name: 'Proof of Income',
              description: 'Upload your latest payslip, ITR, or certificate of employment',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'proof-of-billing',
              name: 'Proof of Billing',
              description: 'Upload a recent utility bill (e.g., electricity, water) showing your current address',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'collateral-docs',
              name: 'Collateral Documents',
              description: 'Upload documents related to your collateral (e.g., vehicle OR/CR, land title)',
              required: false,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 10 * 1024 * 1024, // 10MB
            },
          ];
        } else if (entityType === 'member') {
          mockDocumentTypes = [
            {
              id: 'valid-id',
              name: 'Valid ID',
              description: 'Upload a government-issued ID (e.g., Driver\'s License, Passport, SSS ID)',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'proof-of-billing',
              name: 'Proof of Billing',
              description: 'Upload a recent utility bill (e.g., electricity, water) showing your current address',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'profile-photo',
              name: 'Profile Photo',
              description: 'Upload a recent 2x2 ID photo with white background',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png'],
              maxFileSize: 2 * 1024 * 1024, // 2MB
            },
          ];
        } else if (entityType === 'savings') {
          mockDocumentTypes = [
            {
              id: 'valid-id',
              name: 'Valid ID',
              description: 'Upload a government-issued ID (e.g., Driver\'s License, Passport, SSS ID)',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: 'signature-card',
              name: 'Signature Card',
              description: 'Upload a scanned copy of your signature card',
              required: true,
              acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
              maxFileSize: 2 * 1024 * 1024, // 2MB
            },
          ];
        }
        
        setDocumentTypes(mockDocumentTypes);
        
        // Mock existing documents (if entityId is provided)
        if (entityId) {
          // In a real app, this would be another API call
          // For now, we'll use mock data
          const mockDocuments: Record<string, DocumentFile[]> = {};
          
          // Add some mock documents for demonstration
          if (entityType === 'loan' && entityId === 'demo-loan') {
            mockDocuments['valid-id'] = [
              {
                id: 'doc-1',
                name: 'drivers-license.jpg',
                size: 1.2 * 1024 * 1024,
                type: 'image/jpeg',
                url: 'https://example.com/drivers-license.jpg',
                status: 'success',
                createdAt: new Date().toISOString(),
              },
            ];
          }
          
          setDocuments(mockDocuments);
        } else {
          // Initialize empty document arrays for each document type
          const emptyDocuments: Record<string, DocumentFile[]> = {};
          mockDocumentTypes.forEach(type => {
            emptyDocuments[type.id] = [];
          });
          setDocuments(emptyDocuments);
        }
      } catch (err) {
        console.error('Error fetching document data:', err);
        setError('Failed to load document requirements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [entityId, entityType]);

  // Check if all required documents are uploaded
  useEffect(() => {
    if (!loading && onComplete) {
      const requiredDocumentTypes = documentTypes.filter(type => type.required);
      const allRequiredUploaded = requiredDocumentTypes.every(type => 
        documents[type.id] && documents[type.id].length > 0 && 
        documents[type.id].some(doc => doc.status === 'success')
      );
      
      onComplete(allRequiredUploaded);
    }
  }, [loading, documents, documentTypes, onComplete]);

  const handleUpload = async (documentTypeId: string, file: DocumentFile): Promise<void> => {
    try {
      // In a real app, this would be an API call to upload the file
      // For now, we'll simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay
      
      // Generate a mock URL for the uploaded file
      const mockUrl = `https://example.com/${file.name}`;
      
      // Update the document with the URL and success status
      setDocuments(prev => {
        const updatedDocs = { ...prev };
        const docIndex = updatedDocs[documentTypeId].findIndex(doc => doc.id === file.id);
        
        if (docIndex !== -1) {
          updatedDocs[documentTypeId][docIndex] = {
            ...updatedDocs[documentTypeId][docIndex],
            url: mockUrl,
            status: 'success',
          };
        }
        
        return updatedDocs;
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

  const handleDelete = async (documentTypeId: string, fileId: string): Promise<void> => {
    try {
      // In a real app, this would be an API call to delete the file
      // For now, we'll simulate a successful deletion after a delay
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate deletion delay
      
      // Remove the document from the list
      setDocuments(prev => {
        const updatedDocs = { ...prev };
        updatedDocs[documentTypeId] = updatedDocs[documentTypeId].filter(doc => doc.id !== fileId);
        return updatedDocs;
      });
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
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
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Please upload the required documents to complete your {entityType} application. 
                All documents should be clear and legible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {documentTypes.map((documentType) => (
        <div key={documentType.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DocumentUpload
              documentType={documentType}
              existingDocuments={documents[documentType.id] || []}
              onUpload={(file) => handleUpload(documentType.id, file)}
              onDelete={(fileId) => handleDelete(documentType.id, fileId)}
              disabled={disabled}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentUploadContainer;
