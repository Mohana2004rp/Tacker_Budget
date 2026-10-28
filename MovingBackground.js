import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function MovingBackground({ children, style }) {
  const orb1Anim = useRef(new Animated.ValueXY({ x: -20, y: 10 })).current;
  const orb2Anim = useRef(new Animated.ValueXY({ x: width - 140, y: 120 })).current;
  const orbScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating loop for Top Left Ambient Light
    const anim1 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Anim, {
          toValue: { x: 35, y: 45 },
          duration: 10000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: -20, y: 10 },
          duration: 11000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Gentle floating loop for Right Ambient Light
    const anim2 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Anim, {
          toValue: { x: width - 180, y: 80 },
          duration: 12000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: width - 130, y: 150 },
          duration: 13000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Subtle gentle breathing pulse
    const scaleAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, {
          toValue: 1.08,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(orbScale, {
          toValue: 0.94,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Very slow subtle rotation for unique geometric wave
    const spinAnim = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 36000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    anim1.start();
    anim2.start();
    scaleAnim.start();
    spinAnim.start();

    return () => {
      anim1.stop();
      anim2.stop();
      scaleAnim.stop();
      spinAnim.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Background Animated Layer */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* Soft Ambient Light Orb 1 (Emerald Glow) */}
        <Animated.View
          style={[
            styles.orb,
            styles.orb1,
            {
              transform: [
                { translateX: orb1Anim.x },
                { translateY: orb1Anim.y },
                { scale: orbScale },
              ],
            },
          ]}
        />

        {/* Soft Ambient Light Orb 2 (Sky Cyan Glow) */}
        <Animated.View
          style={[
            styles.orb,
            styles.orb2,
            {
              transform: [
                { translateX: orb2Anim.x },
                { translateY: orb2Anim.y },
              ],
            },
          ]}
        />

        {/* Unique Artistic Geometric Wave Overlay (Concentric Fintech Curves) */}
        <Animated.View
          style={[
            styles.geometricArtWrap,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <Svg width={360} height={360} viewBox="0 0 360 360">
            <Defs>
              <SvgGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#00C48C" stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0.03" />
              </SvgGradient>
            </Defs>
            {/* Concentric Modern Wave Lines */}
            <Circle cx="180" cy="180" r="160" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
            <Circle cx="180" cy="180" r="120" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            <Circle cx="180" cy="180" r="80" stroke="url(#grad1)" strokeWidth="1" fill="none" />
            <Path
              d="M 40 180 Q 110 90, 180 180 T 320 180"
              stroke="#00C48C"
              strokeWidth="1.2"
              strokeOpacity="0.08"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Foreground Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 280,
    height: 280,
    backgroundColor: '#00C48C',
    opacity: 0.09,
    top: -50,
    left: -40,
  },
  orb2: {
    width: 260,
    height: 260,
    backgroundColor: '#38BDF8',
    opacity: 0.08,
    top: 150,
    right: -50,
  },
  geometricArtWrap: {
    position: 'absolute',
    right: -80,
    top: 40,
    opacity: 0.7,
  },
});
