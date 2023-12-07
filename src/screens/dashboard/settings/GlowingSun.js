import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const SIZE = 100;

const GLOW_INITIAL_SCALE = 1.6; //Scale of the glow
const GLOW_MINIMUM_SCALE = 1.2;
const GLOW_DURATION = 3000;

export const GlowingSun = () => {
    const useGlowAnimation = () => {
        return useAnimatedStyle(() => ({
            transform: [
                {
                    scale: withRepeat(
                        withSequence(
                            // Go to minimal value on half scaling duration
                            withTiming(GLOW_MINIMUM_SCALE, { duration: GLOW_DURATION / 2 }),
                            //and go to initial value during other half
                            withTiming(GLOW_INITIAL_SCALE, { duration: GLOW_DURATION / 2 })
                        ),
                        // Loop the animation
                        -1,
                        // Loop in both direction (small=> big, big => small)
                        true
                    ),
                },
            ],
        }));
    };

    const glowAnimation = useGlowAnimation();

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.glowContainer, glowAnimation]}>
                <Image
                    source={require('../../../assets/image-glow.png')}
                    style={styles.image}
                />
            </Animated.View>
            <Image source={require('../../../assets/image.png')} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: SIZE,
        height: SIZE,
    },

    container: {
        alignItems: 'center',
        overflow: 'visible',
    },
    glowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 8, //Top offset to align glow to image
        bottom: 0,
        left: 0,
        right: 4, // Right offset to align glow to image
    },
});