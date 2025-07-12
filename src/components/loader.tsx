'use client';

import { motion, useMotionValue, useAnimationFrame } from 'motion/react';
import Magnifier from '../assets/Magnifier.png'

export function Loader() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useAnimationFrame((t) => {
        const radius = 20;
        const angle = t / 500;
        x.set(Math.cos(angle) * radius);
        y.set(Math.sin(angle) * radius);
    });

    return (
        <motion.div
            style={{x, y}}
            className="max-w-[500px]"
        >
            <img src={Magnifier} alt="Лупа" />
        </motion.div>
    )
}