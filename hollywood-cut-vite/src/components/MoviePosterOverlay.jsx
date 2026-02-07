import { AnimatePresence, motion } from 'framer-motion';

export default function MoviePosterOverlay({ image }) {
    return (
        <AnimatePresence>
            {image && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-0 pointer-events-none"
                >
                    <img
                        src={image}
                        alt="电影海报背景"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
