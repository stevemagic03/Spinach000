import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
    WelcomeScreen,
    Header,
    DirectorConsole,
    Monitor,
    Footer,
    BackgroundAtmosphere,
    MoviePosterOverlay
} from './components';
import {
    generateSetPhoto,
    editSetPhoto,
    getMoviePosterImpression,
    buildPrompt,
    fileToBase64
} from './services/geminiService';

// 类型定义
interface AppState {
    apiKey: string | null;
    hasApiKey: boolean;
    uploadedImage: string | null;
    movieName: string;
    aspectRatio: string;
    dof: string;
    prompt: string;
    isGenerating: boolean;
    generatedImages: string[];
    selectedImageIndex: number;
    isEditing: boolean;
    editPrompt: string;
    posterImpression: string | null;
    imageCount: number;
}

export default function App() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [movieName, setMovieName] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [dof, setDof] = useState<string>('f/1.2');
    const [prompt, setPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editPrompt, setEditPrompt] = useState<string>('');
    const [posterImpression, setPosterImpression] = useState<string | null>(null);
    const [imageCount, setImageCount] = useState<number>(1);

    // API Key 检测和保存
    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            setHasApiKey(true);
        }
    }, []);

    const saveApiKey = (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
        setHasApiKey(true);
    };

    const resetApiKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
        setHasApiKey(false);
    };

    // 背景海报印象图生成（防抖）
    const posterDebounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (posterDebounceRef.current) {
            clearTimeout(posterDebounceRef.current);
        }

        posterDebounceRef.current = setTimeout(async () => {
            if (movieName.length >= 2 && apiKey) {
                try {
                    const poster = await getMoviePosterImpression(apiKey, movieName);
                    setPosterImpression(poster);
                } catch (error) {
                    console.error('Failed to generate poster impression:', error);
                }
            } else {
                setPosterImpression(null);
            }
        }, 1200);

        return () => {
            if (posterDebounceRef.current) {
                clearTimeout(posterDebounceRef.current);
            }
        };
    }, [movieName, apiKey]);

    // 生成图片
    const handleGenerate = async () => {
        if (!apiKey) return;

        setIsGenerating(true);
        setGeneratedImages([]);

        try {
            const finalPrompt = prompt || buildPrompt(movieName, dof, aspectRatio);
            const images = await generateSetPhoto(
                apiKey,
                finalPrompt,
                uploadedImage,
                aspectRatio,
                imageCount
            );
            setGeneratedImages(images);
            setSelectedImageIndex(0);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('生成失败，请检查 API Key 或稍后重试');
        } finally {
            setIsGenerating(false);
        }
    };

    // 后期编辑
    const handleEdit = async () => {
        if (!apiKey || generatedImages.length === 0 || !editPrompt) return;

        setIsEditing(true);

        try {
            const editedImage = await editSetPhoto(
                apiKey,
                generatedImages[selectedImageIndex],
                editPrompt
            );
            const newImages = [...generatedImages];
            newImages[selectedImageIndex] = editedImage;
            setGeneratedImages(newImages);
            setEditPrompt('');
        } catch (error) {
            console.error('Edit failed:', error);
            alert('编辑失败，请重试');
        } finally {
            setIsEditing(false);
        }
    };

    // 处理图片上传
    const handleImageUpload = async (file: File) => {
        try {
            const base64 = await fileToBase64(file);
            setUploadedImage(base64);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('图片上传失败');
        }
    };

    // 生成默认 Prompt
    const generateDefaultPrompt = () => {
        const defaultPrompt = buildPrompt(movieName, dof, aspectRatio);
        setPrompt(defaultPrompt);
    };

    const appState: AppState = {
        apiKey,
        hasApiKey,
        uploadedImage,
        movieName,
        aspectRatio,
        dof,
        prompt,
        isGenerating,
        generatedImages,
        selectedImageIndex,
        isEditing,
        editPrompt,
        posterImpression,
        imageCount,
    };

    const handlers = {
        setApiKey: saveApiKey,
        resetApiKey,
        setUploadedImage,
        setMovieName,
        setAspectRatio,
        setDof,
        setPrompt,
        handleGenerate,
        setSelectedImageIndex,
        setEditPrompt,
        handleEdit,
        handleImageUpload,
        generateDefaultPrompt,
        setImageCount,
    };

    if (!hasApiKey) {
        return (
            <>
                <BackgroundAtmosphere />
                <WelcomeScreen onAuth={saveApiKey} />
            </>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-canvas">
            <BackgroundAtmosphere />
            <MoviePosterOverlay image={posterImpression} />

            <div className="relative z-10 pb-20">
                <Header onReset={resetApiKey} />

                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <DirectorConsole state={appState} handlers={handlers} />
                        <Monitor state={appState} handlers={handlers} />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

// 挂载应用
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
