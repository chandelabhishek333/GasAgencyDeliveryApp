import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useSplash } from './useSplash';
import type { SplashScreenProps } from './types';

const LOGO_SOURCE = require('../../../assets/images/logos/mbga-logo.png');
// Same source as the `app_version` sent to the backend (getDeviceInfo),
// so the splash can never show a different version than the API sees.
const { version: APP_VERSION } = require('../../../../package.json') as { version: string };

const DOT_COUNT = 3;
const DOT_SIZE = 5;
const ACTIVE_DOT_WIDTH = 20;
const ACTIVE_DOT_HEIGHT = 6;
const DOT_IDLE_COLOR = '#C8D5E0';
const DOT_STEP_MS = 320;
const DOT_HOLD_MS = 180;

/**
 * Screen 1 — Splash. Branded loading state only; auto-navigates to
 * Login once the session bootstrap + minimum splash duration have both
 * finished. See useSplash for the bootstrap/navigation hand-off design.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useSplash(navigation);

  // 0 = small grey dot, 1 = the wide orange "active" pill.
  const dots = useRef(
    Array.from({ length: DOT_COUNT }, (_, index) => new Animated.Value(index === 0 ? 1 : 0)),
  ).current;

  // Wave: the active pill hands off dot 1 -> 2 -> 3 -> 1. Width and
  // color can't run on the native driver, but these are three tiny views
  // and the splash's JS thread is mostly idle waiting on bootstrap I/O.
  // The outgoing and incoming dot animate together, so the row's total
  // width stays constant and nothing around it shifts.
  useEffect(() => {
    const handOff = (from: number, to: number) =>
      Animated.sequence([
        Animated.delay(DOT_HOLD_MS),
        Animated.parallel(
          [
            [from, 0],
            [to, 1],
          ].map(([index, toValue]) =>
            Animated.timing(dots[index], {
              toValue,
              duration: DOT_STEP_MS,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ),
        ),
      ]);
    const wave = Animated.loop(
      Animated.sequence(
        Array.from({ length: DOT_COUNT }, (_, index) => handOff(index, (index + 1) % DOT_COUNT)),
      ),
    );
    wave.start();
    return () => wave.stop();
  }, [dots]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientSplashStart, Colors.gradientSplashEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
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
            {dots.map((progress, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: progress.interpolate({ inputRange: [0, 1], outputRange: [DOT_SIZE, ACTIVE_DOT_WIDTH] }),
                    height: progress.interpolate({ inputRange: [0, 1], outputRange: [DOT_SIZE, ACTIVE_DOT_HEIGHT] }),
                    backgroundColor: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [DOT_IDLE_COLOR, Colors.secondary],
                    }),
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.version}>v{APP_VERSION} • Commercial LPG Operations</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};
