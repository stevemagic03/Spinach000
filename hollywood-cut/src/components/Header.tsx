import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
    return (
        <header className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
                {/* 标题 */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-cinematic text-6xl md:text-7xl text-primary"
                >
                    Hollywood <span className="text-accent">Cut</span>
                </motion.h1>

                {/* 重置按钮 - 仅桌面端 */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="hidden lg:block px-4 py-2 font-mono text-sm text-primary border border-primary/30 hover:border-accent hover:text-accent transition-all"
                >
                    RESET
                </motion.button>
            </div>
        </header>
    );
}
