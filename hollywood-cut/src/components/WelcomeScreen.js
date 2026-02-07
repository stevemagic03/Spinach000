import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';

export function WelcomeScreen({ onAuth }) {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onAuth(apiKey.trim());
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-4 border-primary max-w-md w-full p-8 relative"
            >
                {/* 场记板图标 */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                            <Clapperboard size={40} className="text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-accent rounded-full -z-10 opacity-30 blur-md" />
                    </div>
                </motion.div>

                {/* 标题 */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-cinematic text-4xl text-center mb-2 text-primary"
                >
                    HOLLYWOOD <span className="text-accent">CUT</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-ui text-secondary text-center mb-8 text-sm"
                >
                    JAZZ & WESTERN EDITION
                </motion.p>

                {/* 表单 */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onSubmit={handleSubmit}
                >
                    <div className="mb-6">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="输入 Google Gemini API Key"
                            className="w-full px-4 py-3 border-2 border-primary/30 focus:border-accent focus:outline-none text-center font-mono text-sm transition-colors"
                            autoFocus
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full bg-accent text-white font-ui font-semibold py-3 px-6 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <Clapperboard size={20} />
                        进入电影片场
                    </motion.button>
                </motion.form>

                {/* 底部提示 */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="font-mono text-xs text-secondary/60 text-center mt-6"
                >
                    获取 API Key: <a href="https://console.anthropic.com" className="text-primary hover:text-accent underline" target="_blank" rel="noopener noreferrer">console.anthropic.com</a>
                </motion.p>
            </motion.div>
        </div>
    );
}
