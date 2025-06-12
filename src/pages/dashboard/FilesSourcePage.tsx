import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  File, Upload, Save, RefreshCw, CheckCircle, AlertCircle,
  Settings, Shield, Clock, Zap
} from 'lucide-react';

export const FilesSourcePage = () => {
  const { toast } = useToast();
  const [fileData, setFileData] = useState({
    name: '',
    description: '',
    uploadDate: '',
    status: 'active',
    fileType: '',
    fileSize: '',
    lastModified: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileData(prev => ({
      ...prev,
      name: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      fileType: file.type,
      lastModified: new Date(file.lastModified).toLocaleDateString()
    }));

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded`,
        });
      }
    }, 200);
  };

  const handleSave = () => {
    toast({
      title: "File Source Saved",
      description: "Your file source has been saved to the knowledge base",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Files & Documents"
          description="Upload and manage your document knowledge sources"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  File Upload
                </CardTitle>
                <CardDescription>
                  Upload your documents to use as a knowledge source
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">File Name</Label>
                  <Input
                    id="name"
                    placeholder="Choose a file to upload"
                    value={fileData.name || 'No file selected'}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the contents of this file"
                    value={fileData.description}
                    onChange={(e) => setFileData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileType">File Type</Label>
                    <Input
                      id="fileType"
                      placeholder="N/A"
                      value={fileData.fileType}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input
                      id="fileSize"
                      placeholder="0 KB"
                      value={fileData.fileSize}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastModified">Last Modified</Label>
                    <Input
                      id="lastModified"
                      placeholder="N/A"
                      value={fileData.lastModified}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload">Upload File</Label>
                  <Input
                    id="upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button asChild variant="outline">
                    <Label htmlFor="upload" className="cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Label>
                  </Button>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <Label>Upload Progress</Label>
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save File Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Info & Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Encryption</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retention Policy</span>
                  <span className="text-sm text-muted-foreground">30 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Control</span>
                  <span className="text-sm text-muted-foreground">Private</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 mt-0.5 text-yellow-600" />
                  <span>Ensure files are free of sensitive data</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Files are processed within 24 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Uploaded files are securely stored</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
