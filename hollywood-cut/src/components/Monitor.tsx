import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Sparkles, Loader2 } from 'lucide-react';

interface AppState {
    isGenerating: boolean;
    generatedImages: string[];
    selectedImageIndex: number;
    isEditing: boolean;
    editPrompt: string;
}

interface Handlers {
    setSelectedImageIndex: (index: number) => void;
    setEditPrompt: (prompt: string) => void;
    handleEdit: () => void;
}

interface MonitorProps {
    state: AppState;
    handlers: Handlers;
}

export function Monitor({ state, handlers }: MonitorProps) {
    const handleDownload = (image: string) => {
        const link = document.createElement('a');
        link.href = image;
        link.download = `hollywood-cut-${Date.now()}.jpg`;
        link.click();
    };

    return (
        <div className="space-y-6">
            {/* 主显示区 */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border-4 border-primary bg-white/50 backdrop-blur-sm"
            >
                <div className="border-2 border-dashed border-primary/30 p-4 min-h-[500px] flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {/* 空状态 */}
                        {state.generatedImages.length === 0 && !state.isGenerating && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <p className="font-western text-4xl text-primary/50 mb-2">NO SIGNAL</p>
                                <p className="font-ui text-secondary text-sm">Standby for Action</p>
                            </motion.div>
                        )}

                        {/* 加载状态 */}
                        {state.isGenerating && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    {/* 旋转的橙色线条 */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full"
                                    />
                                    {/* 脉冲的蓝色圆圈 */}
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute inset-4 border-2 border-primary rounded-full"
                                    />
                                </div>
                                <p className="font-ui font-semibold text-accent text-lg">DEVELOPING...</p>
                            </motion.div>
                        )}

                        {/* 结果展示 */}
                        {state.generatedImages.length > 0 && !state.isGenerating && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative w-full"
                            >
                                <img
                                    src={state.generatedImages[state.selectedImageIndex]}
                                    alt="生成的片场照"
                                    className="w-full h-auto rounded border-2 border-primary/20"
                                />
                                {/* 下载按钮 */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDownload(state.generatedImages[state.selectedImageIndex])}
                                    className="absolute bottom-4 right-4 bg-accent text-white p-2 rounded-full shadow-lg"
                                >
                                    <Download size={20} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* 画廊 */}
            <AnimatePresence>
                {state.generatedImages.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-2 overflow-x-auto pb-2"
                    >
                        {state.generatedImages.map((img, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlers.setSelectedImageIndex(index)}
                                className={`relative flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 ${
                                    state.selectedImageIndex === index
                                        ? 'border-accent'
                                        : 'border-primary/30'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`缩略图 ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {state.selectedImageIndex === index && (
                                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                        <Check size={16} className="text-white drop-shadow-md" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 后期修图 */}
            <AnimatePresence>
                {state.generatedImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border-2 border-primary/50 p-6 hover:border-accent/50 transition-colors"
                    >
                        <h3 className="font-ui font-semibold text-primary mb-4 flex items-center gap-2">
                            <Sparkles size={20} />
                            Magic Edit
                        </h3>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={state.editPrompt}
                                onChange={(e) => handlers.setEditPrompt(e.target.value)}
                                placeholder="输入修改指令，如：变成黑白、增加颗粒感..."
                                className="flex-1 px-4 py-2 border border-primary/30 focus:border-accent focus:outline-none font-ui text-sm transition-colors"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlers.handleEdit}
                                disabled={state.isEditing || !state.editPrompt}
                                className={`px-6 py-2 font-ui font-semibold text-white flex items-center gap-2 transition-all ${
                                    state.isEditing || !state.editPrompt
                                        ? 'bg-secondary/50 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/90'
                                }`}
                            >
                                {state.isEditing ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Sparkles size={16} />
                                )}
                                APPLY CUT
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
