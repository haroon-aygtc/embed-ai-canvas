
import React, { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, File, FileText, Image, Archive, X, CheckCircle,
  AlertCircle, Folder, HardDrive, Clock, Zap
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  pages?: number;
  extractedText?: string;
}

export const FilesSourcePage = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const supportedTypes = [
    { type: 'pdf', label: 'PDF Documents', icon: FileText, accept: '.pdf' },
    { type: 'doc', label: 'Word Documents', icon: FileText, accept: '.doc,.docx' },
    { type: 'txt', label: 'Text Files', icon: File, accept: '.txt,.md' },
    { type: 'img', label: 'Images', icon: Image, accept: '.jpg,.jpeg,.png,.gif' },
    { type: 'archive', label: 'Archives', icon: Archive, accept: '.zip,.rar' }
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('zip') || type.includes('archive')) return Archive;
    if (type.includes('text') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateFileProcessing = (fileId: string) => {
    const updateProgress = () => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId && file.progress < 100) {
          const newProgress = Math.min(file.progress + 10, 100);
          const newStatus = newProgress === 100 ? 'completed' : file.status;
          
          if (newProgress === 100) {
            // Simulate extraction results
            setTimeout(() => {
              setUploadedFiles(current => current.map(f => 
                f.id === fileId ? {
                  ...f,
                  pages: Math.floor(Math.random() * 50) + 1,
                  extractedText: 'Sample extracted text from the document...'
                } : f
              ));
            }, 500);
          }
          
          return { ...file, progress: newProgress, status: newStatus };
        }
        return file;
      }));
    };

    const interval = setInterval(() => {
      setUploadedFiles(current => {
        const file = current.find(f => f.id === fileId);
        if (!file || file.progress >= 100) {
          clearInterval(interval);
          return current;
        }
        updateProgress();
        return current;
      });
    }, 500);
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing', progress: 10 } : f
        ));
        simulateFileProcessing(file.id);
      }, 1000);
    });

    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'uploading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Files & Documents"
          description="Upload and process files as knowledge sources"
          icon={Upload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  File Upload
                </CardTitle>
                <CardDescription>
                  Drag and drop files or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop files here to upload</p>
                  <p className="text-muted-foreground mb-4">
                    or click to browse your computer
                  </p>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Browse Files
                    </Button>
                  </Label>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Supported file types:</p>
                  <div className="flex flex-wrap gap-2">
                    {supportedTypes.map((type) => (
                      <Badge key={type.type} variant="secondary" className="flex items-center gap-1">
                        <type.icon className="h-3 w-3" />
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    Uploaded Files ({uploadedFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              {file.pages && (
                                <>
                                  <span>•</span>
                                  <span>{file.pages} pages</span>
                                </>
                              )}
                            </div>
                            {file.status !== 'completed' && (
                              <div className="mt-2">
                                <Progress value={file.progress} className="h-1" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(file.status)}>
                              {file.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {file.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {file.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Used Storage:</span>
                  <span>2.4 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span>7.6 GB</span>
                </div>
                <Progress value={24} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  24% of 10 GB plan used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Processing Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Automatic text extraction</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>OCR for scanned documents</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Image content analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Archive extraction</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Max file size:</span>
                  <span>100 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Max files per upload:</span>
                  <span>50 files</span>
                </div>
                <div className="flex justify-between">
                  <span>Concurrent uploads:</span>
                  <span>5 files</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
