/* eslint-disable react-native/no-inline-styles */
import { Canvas, DiffRect, rect, rrect } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { height, width } from '@/constants/theme';
import { useState, useEffect } from 'react';

const innerSize = 280;
const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
    rect(
        width / 2 - innerSize / 2,
        height / 2 - innerSize / 2,
        innerSize,
        innerSize,
    ),
    20,
    20,
);

export const Overlay = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(id);
    }, []);

    if (!ready) return <View style={{ flex: 1 }} />;

    return (
        <Canvas style={{ flex: 1 }}>
            <DiffRect inner={inner} outer={outer} color="black" opacity={0.6} />
        </Canvas>
    );
};
