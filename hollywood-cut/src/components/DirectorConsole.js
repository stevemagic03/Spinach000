import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Upload,
    Image as ImageIcon,
    X,
    Sparkles,
    Star,
    Clapperboard
} from 'lucide-react';

const ASPECT_RATIOS = [
    { value: '9:16', label: '抖音 9:16' },
    { value: '3:4', label: '小红书 3:4' },
    { value: '4:3', label: 'B站 4:3' },
    { value: '16:9', label: '宽银幕 16:9' },
];

const DOF_OPTIONS = [
    { value: 'f/1.2', label: '浅景深 f/1.2' },
    { value: 'f/4', label: '标准 f/4' },
    { value: 'f/11', label: '深景深 f/11' },
];

export function DirectorConsole({ state, handlers }) {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handlers.handleImageUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handlers.handleImageUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-6">
            {/* 上传模块 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-primary/50 p-6 hover:border-accent/50 transition-colors"
            >
                <h3 className="font-ui font-semibold text-primary mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    上传人像参考
                </h3>

                {state.uploadedImage ? (
                    <div className="relative">
                        <img
                            src={`data:image/jpeg;base64,${state.uploadedImage}`}
                            alt="参考图"
                            className="w-full h-48 object-cover rounded border-2 border-primary/30"
                        />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlers.setUploadedImage(null)}
                            className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full"
                        >
                            <X size={16} />
                        </motion.button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
                    >
                        <Upload size={32} className="mx-auto text-primary/50 mb-2" />
                        <p className="font-ui text-secondary text-sm">点击或拖拽上传图片</p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </motion.div>

            {/* 场景设定 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-primary/50 p-6 hover:border-accent/50 transition-colors space-y-4"
            >
                <h3 className="font-ui font-semibold text-primary flex items-center gap-2">
                    <Clapperboard size={20} />
                    场景设定
                </h3>

                {/* 电影名称 */}
                <div>
                    <label className="font-ui text-secondary text-sm mb-2 block">电影名称</label>
                    <input
                        type="text"
                        value={state.movieName}
                        onChange={(e) => handlers.setMovieName(e.target.value)}
                        placeholder="例如：La La Land, Django..."
                        className="w-full px-4 py-2 border border-primary/30 focus:border-accent focus:outline-none font-ui text-sm transition-colors"
                    />
                </div>

                {/* 画幅比例 */}
                <div>
                    <label className="font-ui text-secondary text-sm mb-2 block">画幅比例</label>
                    <div className="grid grid-cols-2 gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                            <motion.button
                                key={ratio.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlers.setAspectRatio(ratio.value)}
                                className={`py-2 px-3 text-sm font-ui transition-all ${
                                    state.aspectRatio === ratio.value
                                        ? 'bg-accent text-white'
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                            >
                                {ratio.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* 镜头景深 */}
                <div>
                    <label className="font-ui text-secondary text-sm mb-2 block">镜头景深</label>
                    <div className="flex gap-2">
                        {DOF_OPTIONS.map((opt) => (
                            <motion.button
                                key={opt.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlers.setDof(opt.value)}
                                className={`flex-1 py-2 px-3 text-sm font-ui transition-all ${
                                    state.dof === opt.value
                                        ? 'bg-accent text-white'
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* 导演指令 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border-2 border-primary/50 p-6 hover:border-accent/50 transition-colors"
            >
                <h3 className="font-ui font-semibold text-primary mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    导演指令
                </h3>

                {/* 生成按钮 */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlers.generateDefaultPrompt}
                    className="w-full bg-primary/10 text-primary font-ui py-2 px-4 mb-4 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                    <Sparkles size={16} />
                    自动生成 Prompt
                </motion.button>

                {/* 文本域 */}
                <div className="relative letter-box letter-corner">
                    <textarea
                        value={state.prompt}
                        onChange={(e) => handlers.setPrompt(e.target.value)}
                        placeholder="生成的提示词将显示在这里，你也可以手动编辑..."
                        rows={8}
                        className="w-full px-4 py-3 border border-primary/30 focus:border-accent focus:outline-none font-ui text-sm resize-none bg-transparent"
                    />
                </div>
            </motion.div>

            {/* Action 区域 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border-2 border-primary/50 p-6 hover:border-accent/50 transition-colors"
            >
                <h3 className="font-ui font-semibold text-primary mb-4">Action</h3>

                {/* 数量选择 */}
                <div className="flex gap-2 mb-4">
                    {[1, 2].map((count) => (
                        <motion.button
                            key={count}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlers.setImageCount(count)}
                            className={`flex-1 py-2 px-4 font-ui transition-all ${
                                state.imageCount === count
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-transparent border border-primary/30 text-primary hover:bg-primary/10'
                            }`}
                        >
                            x{count}
                        </motion.button>
                    ))}
                </div>

                {/* ACTION 按钮 */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlers.handleGenerate}
                    disabled={state.isGenerating}
                    className={`w-full py-4 px-6 font-ui font-bold text-white flex items-center justify-center gap-3 transition-all ${
                        state.isGenerating
                            ? 'bg-secondary/50 cursor-not-allowed'
                            : 'bg-accent hover:bg-accent/90'
                    }`}
                >
                    {state.isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            PROCESSING...
                        </>
                    ) : (
                        <>
                            <Star size={24} />
                            ACTION
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}
