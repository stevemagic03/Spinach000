import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    WelcomeScreen,
    Header,
    Footer,
    DirectorConsole,
    Monitor,
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

export default function App() {
    const [apiKey, setApiKey] = useState(null);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [movieName, setMovieName] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [dof, setDof] = useState('f/1.2');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [posterImpression, setPosterImpression] = useState(null);
    const [imageCount, setImageCount] = useState(1);
    const posterDebounceRef = useRef(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            setHasApiKey(true);
        }
    }, []);

    const saveApiKey = (key) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
        setHasApiKey(true);
    };

    const resetApiKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
        setHasApiKey(false);
    };

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

    const handleImageUpload = async (file) => {
        try {
            const base64 = await fileToBase64(file);
            setUploadedImage(base64);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('图片上传失败');
        }
    };

    const generateDefaultPrompt = () => {
        const defaultPrompt = buildPrompt(movieName, dof, aspectRatio);
        setPrompt(defaultPrompt);
    };

    const appState = {
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
