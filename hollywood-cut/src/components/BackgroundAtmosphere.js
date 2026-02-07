import React from 'react';
import { Music, Star, Circle as CircleIcon } from 'lucide-react';

export function BackgroundAtmosphere() {
    const elements = [
        { icon: Music, size: 40, top: '10%', left: '5%', delay: 0, color: '#002FA7' },
        { icon: Star, size: 32, top: '20%', right: '10%', delay: -1, color: '#FF4500' },
        { icon: CircleIcon, size: 48, top: '60%', left: '15%', delay: -2, color: '#002FA7' },
        { icon: Music, size: 36, bottom: '30%', right: '5%', delay: -3, color: '#FF4500' },
        { icon: Star, size: 28, bottom: '15%', left: '25%', delay: -4, color: '#002FA7' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {elements.map((el, index) => (
                <div
                    key={index}
                    className="float-element absolute"
                    style={{
                        top: el.top,
                        left: el.left,
                        right: el.right,
                        bottom: el.bottom,
                        animationDelay: `${el.delay}s`,
                        opacity: 0.1,
                    }}
                >
                    <el.icon size={el.size} style={{ color: el.color }} />
                </div>
            ))}
        </div>
    );
}
