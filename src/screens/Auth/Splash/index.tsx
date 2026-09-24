import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StatusBar, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useSplash } from './useSplash';
import type { SplashScreenProps } from './types';

const LOGO_SOURCE = require('../../../assets/images/logos/mbga-logo.png');

/**
 * Screen 1 — Splash. Branded loading state only; auto-navigates to
 * Login once the session bootstrap + minimum splash duration have both
 * finished. See useSplash for the bootstrap/navigation hand-off design.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useSplash(navigation);

  const dotPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 0.6,
          duration: 550,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 550,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [dotPulse]);

  return (
    <LinearGradient
      colors={[Colors.gradientSplashStart, Colors.gradientSplashEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
          <Text style={styles.wordmark}>MBGA</Text>
          <Text style={styles.subLabel}>Delivery Partner App</Text>
          <Text style={styles.tagline}>{'Speed & Action.\nReliable Fuel Supply.'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🚛</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dotActive, { opacity: dotPulse }]} />
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
          </View>
          <Text style={styles.version}>v2.4 • Commercial LPG Operations</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
