import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, SearchInput } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect } from '@/components/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
    Upload, Image, Video, FileText, Music, Archive, Trash2, Download,
    Eye, Edit, Copy, Share, Grid3X3, List, Filter, SortAsc, SortDesc,
    FolderPlus, Folder, Star, Clock, FileImage, Play, Pause, Volume2,
    MoreHorizontal, Check, X, Search, Plus, Settings, Info, AlertCircle
} from 'lucide-react';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';

interface MediaFile {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'archive';
    size: number;
    url: string;
    thumbnail?: string;
    uploadDate: Date;
    lastModified: Date;
    folder: string;
    tags: string[];
    isStarred: boolean;
    dimensions?: { width: number; height: number };
    duration?: number;
    description?: string;
}

interface MediaFolder {
    id: string;
    name: string;
    itemCount: number;
    size: number;
    color: string;
    createdDate: Date;
}

const MediaPage = () => {
    const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock data
    const mockFolders: MediaFolder[] = [
        { id: 'all', name: 'All Files', itemCount: 24, size: 15728640, color: 'blue', createdDate: new Date() },
        { id: 'images', name: 'Images', itemCount: 12, size: 8388608, color: 'green', createdDate: new Date() },
        { id: 'videos', name: 'Videos', itemCount: 4, size: 5242880, color: 'purple', createdDate: new Date() },
        { id: 'documents', name: 'Documents', itemCount: 6, size: 1572864, color: 'orange', createdDate: new Date() },
        { id: 'audio', name: 'Audio', itemCount: 2, size: 524288, color: 'pink', createdDate: new Date() },
    ];

    const mockFiles: MediaFile[] = [
        {
            id: '1',
            name: 'hero-banner.jpg',
            type: 'image',
            size: 2048576,
            url: '/api/placeholder/800/400',
            thumbnail: '/api/placeholder/200/200',
            uploadDate: new Date('2024-01-15'),
            lastModified: new Date('2024-01-15'),
            folder: 'images',
            tags: ['banner', 'hero', 'marketing'],
            isStarred: true,
            dimensions: { width: 1920, height: 1080 },
            description: 'Main hero banner for homepage'
        },
        {
            id: '2',
            name: 'product-demo.mp4',
            type: 'video',
            size: 15728640,
            url: '/api/placeholder/video',
            thumbnail: '/api/placeholder/200/200',
            uploadDate: new Date('2024-01-14'),
            lastModified: new Date('2024-01-14'),
            folder: 'videos',
            tags: ['demo', 'product', 'tutorial'],
            isStarred: false,
            dimensions: { width: 1280, height: 720 },
            duration: 120,
            description: 'Product demonstration video'
        },
        {
            id: '3',
            name: 'user-guide.pdf',
            type: 'document',
            size: 1048576,
            url: '/api/placeholder/document',
            uploadDate: new Date('2024-01-13'),
            lastModified: new Date('2024-01-13'),
            folder: 'documents',
            tags: ['guide', 'documentation', 'help'],
            isStarred: false,
            description: 'Comprehensive user guide'
        },
        {
            id: '4',
            name: 'notification-sound.mp3',
            type: 'audio',
            size: 262144,
            url: '/api/placeholder/audio',
            uploadDate: new Date('2024-01-12'),
            lastModified: new Date('2024-01-12'),
            folder: 'audio',
            tags: ['notification', 'sound', 'ui'],
            isStarred: false,
            duration: 3,
            description: 'Notification sound effect'
        }
    ];

    if (showWizard) {
        return (
            <SetupWizard
                onComplete={handleWizardComplete}
                onSkip={handleWizardSkip}
            />
        );
    }

    const filteredFiles = mockFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
        const matchesType = selectedType === 'all' || file.type === selectedType;

        return matchesSearch && matchesFolder && matchesType;
    });

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'size':
                comparison = a.size - b.size;
                break;
            case 'type':
                comparison = a.type.localeCompare(b.type);
                break;
            case 'date':
            default:
                comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload({ target: { files } } as any);
        }
    };

    const formatFileSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image': return <Image className="h-4 w-4" />;
            case 'video': return <Video className="h-4 w-4" />;
            case 'audio': return <Music className="h-4 w-4" />;
            case 'document': return <FileText className="h-4 w-4" />;
            case 'archive': return <Archive className="h-4 w-4" />;
            default: return <FileImage className="h-4 w-4" />;
        }
    };

    const folderOptions = mockFolders.map(folder => ({
        value: folder.id,
        label: folder.name,
        description: `${folder.itemCount} items • ${formatFileSize(folder.size)}`
    }));

    const typeOptions = [
        { value: 'all', label: 'All Types', description: 'Show all file types' },
        { value: 'image', label: 'Images', description: 'JPG, PNG, GIF, SVG' },
        { value: 'video', label: 'Videos', description: 'MP4, AVI, MOV, WebM' },
        { value: 'audio', label: 'Audio', description: 'MP3, WAV, OGG' },
        { value: 'document', label: 'Documents', description: 'PDF, DOC, TXT' },
        { value: 'archive', label: 'Archives', description: 'ZIP, RAR, 7Z' }
    ];

    const sortOptions = [
        { value: 'date', label: 'Date', description: 'Sort by upload date' },
        { value: 'name', label: 'Name', description: 'Sort alphabetically' },
        { value: 'size', label: 'Size', description: 'Sort by file size' },
        { value: 'type', label: 'Type', description: 'Sort by file type' }
    ];

    const headerActions = (
        <>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
            </Button>
            <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
            </Button>
        </>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Media Gallery"
                    description="Manage your images, videos, documents and other media files"
                    onSetupWizard={handleStartWizard}
                    actions={headerActions}
                />

                {/* Upload Progress */}
                {isUploading && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <Upload className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Uploading files...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filters and Controls */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <SearchInput
                                    placeholder="Search files by name or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClear={() => setSearchQuery('')}
                                />
                            </div>

                            <div className="flex gap-2">
                                <SearchableSelect
                                    options={folderOptions}
                                    value={selectedFolder}
                                    onValueChange={setSelectedFolder}
                                    placeholder="All Folders"
                                />

                                <SearchableSelect
                                    options={typeOptions}
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                    placeholder="All Types"
                                />

                                <SearchableSelect
                                    options={sortOptions}
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                    placeholder="Sort by"
                                />

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                >
                                    {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="files" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="files" className="flex items-center gap-2">
                            <FileImage className="h-4 w-4" />
                            Files ({sortedFiles.length})
                        </TabsTrigger>
                        <TabsTrigger value="folders" className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            Folders ({mockFolders.length - 1})
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Files Tab */}
                    <TabsContent value="files" className="mt-6">
                        {/* Bulk Actions */}
                        {selectedFiles.size > 0 && (
                            <Card className="mb-6">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                                        </span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy URL
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Share className="h-4 w-4 mr-2" />
                                                Share
                                            </Button>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* File Grid/List */}
                        {sortedFiles.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <div
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No files found</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {searchQuery || selectedFolder !== 'all' || selectedType !== 'all'
                                                ? 'Try adjusting your filters or search terms'
                                                : 'Drag and drop files here or click to upload'
                                            }
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Files
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedFiles.map((file) => (
                                    <Card key={file.id} className="group hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="relative mb-3">
                                                <AspectRatio ratio={16 / 9}>
                                                    {file.type === 'image' ? (
                                                        <img
                                                            src={file.thumbnail || file.url}
                                                            alt={file.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                            {getFileIcon(file.type)}
                                                        </div>
                                                    )}
                                                </AspectRatio>

                                                <div className="absolute top-2 left-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFiles.has(file.id)}
                                                        onChange={(e) => {
                                                            const newSelected = new Set(selectedFiles);
                                                            if (e.target.checked) {
                                                                newSelected.add(file.id);
                                                            } else {
                                                                newSelected.delete(file.id);
                                                            }
                                                            setSelectedFiles(newSelected);
                                                        }}
                                                        className="rounded"
                                                    />
                                                </div>

                                                <div className="absolute top-2 right-2">
                                                    {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                                </div>

                                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-1">
                                                        <Button variant="secondary" size="icon" className="h-6 w-6">
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="secondary" size="icon" className="h-6 w-6">
                                                            <Download className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="secondary" size="icon" className="h-6 w-6">
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm truncate" title={file.name}>
                                                    {file.name}
                                                </h4>

                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    {file.duration && <span>{formatDuration(file.duration)}</span>}
                                                    {file.dimensions && (
                                                        <span>{file.dimensions.width}×{file.dimensions.height}</span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-1">
                                                    {file.tags.slice(0, 2).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {file.tags.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{file.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-b">
                                                <tr className="text-left">
                                                    <th className="p-4 w-12">
                                                        <input type="checkbox" className="rounded" />
                                                    </th>
                                                    <th className="p-4">Name</th>
                                                    <th className="p-4">Type</th>
                                                    <th className="p-4">Size</th>
                                                    <th className="p-4">Modified</th>
                                                    <th className="p-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedFiles.map((file) => (
                                                    <tr key={file.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFiles.has(file.id)}
                                                                onChange={(e) => {
                                                                    const newSelected = new Set(selectedFiles);
                                                                    if (e.target.checked) {
                                                                        newSelected.add(file.id);
                                                                    } else {
                                                                        newSelected.delete(file.id);
                                                                    }
                                                                    setSelectedFiles(newSelected);
                                                                }}
                                                                className="rounded"
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                                                    {getFileIcon(file.type)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{file.name}</div>
                                                                    <div className="text-sm text-gray-500">{file.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="outline">{file.type}</Badge>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-500">
                                                            {formatFileSize(file.size)}
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-500">
                                                            {file.lastModified.toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Folders Tab */}
                    <TabsContent value="folders" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockFolders.slice(1).map((folder) => (
                                <Card key={folder.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 bg-${folder.color}-100 dark:bg-${folder.color}-900 rounded-lg flex items-center justify-center`}>
                                                <Folder className={`h-6 w-6 text-${folder.color}-600`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{folder.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {folder.itemCount} items • {formatFileSize(folder.size)}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upload Settings</CardTitle>
                                    <CardDescription>Configure file upload preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Auto-organize uploads</label>
                                            <p className="text-sm text-muted-foreground">
                                                Automatically sort files into folders by type
                                            </p>
                                        </div>
                                        <Switch defaultChecked={true} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Generate thumbnails</label>
                                            <p className="text-sm text-muted-foreground">
                                                Create thumbnails for images and videos
                                            </p>
                                        </div>
                                        <Switch defaultChecked={true} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Compress images</label>
                                            <p className="text-sm text-muted-foreground">
                                                Optimize images for web use
                                            </p>
                                        </div>
                                        <Switch defaultChecked={false} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Storage Information</CardTitle>
                                    <CardDescription>Current usage and limits</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Used Storage</span>
                                            <span>2.4 GB of 10 GB</span>
                                        </div>
                                        <Progress value={24} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Images</p>
                                            <p className="font-medium">1.2 GB</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Videos</p>
                                            <p className="font-medium">800 MB</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Documents</p>
                                            <p className="font-medium">300 MB</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Other</p>
                                            <p className="font-medium">100 MB</p>
                                        </div>
                                    </div>

                                    <Button className="w-full">
                                        Upgrade Storage
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>
        </DashboardLayout>
    );
};

export default MediaPage; 