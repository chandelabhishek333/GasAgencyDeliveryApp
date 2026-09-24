import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useProfileMain } from './useProfileMain';
import type { ProfileMainScreenProps } from './types';

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

/**
 * Illustrative performance figures — `Driver` (src/types/driver.types.ts)
 * has no stats/hub/vehicle-type fields yet. Swap these for real data once
 * the backend exposes them (likely via `delivery_profile` on GET /me —
 * see useProfileMain.ts / auth.types.ts).
 */
const PLACEHOLDER_STATS = {
  totalDeliveries: '1,420',
  onTimeRate: '98%',
};
const PLACEHOLDER_VEHICLE_TYPE = 'Tata Ace — LPG Carrier';
const PLACEHOLDER_HUB = 'MBGA Central Depot — Gate 2';

/** Screen 12 — My Profile: header, stats, vehicle/hub info, menu groups, logout. */
export const ProfileMainScreen: React.FC<ProfileMainScreenProps> = ({ navigation }) => {
  const {
    driver,
    initials,
    isVerified,
    driverIdLabel,
    handleBack,
    handleEditAvatar,
    handleMyDeliveries,
    handleDeliveryHistory,
    handleHelpSupport,
    handleLogout,
  } = useProfileMain(navigation);

  const menuGroups: MenuGroup[] = [
    {
      title: 'Work & Deliveries',
      items: [
        { icon: '📋', label: 'My Active Deliveries', onPress: handleMyDeliveries },
        { icon: '🕓', label: 'Delivery History & Trips', onPress: handleDeliveryHistory },
      ],
    },
    {
      title: 'Support & Info',
      items: [{ icon: '❓', label: 'Help & Depot Helpline', onPress: handleHelpSupport }],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header title="My Profile" onBackPress={handleBack} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Section A — Profile header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Pressable
              style={styles.avatarEditBadge}
              onPress={handleEditAvatar}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Text style={styles.avatarEditIcon}>📷</Text>
            </Pressable>
          </View>

          <Text style={styles.name}>{driver?.name ?? ''}</Text>

          <View style={styles.badgeRow}>
            {isVerified ? (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>✅ Verified Driver</Text>
              </View>
            ) : null}
            {driverIdLabel ? (
              <View style={styles.idBadge}>
                <Text style={styles.idBadgeText}>ID: {driverIdLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Section B — Quick performance stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={[styles.statValue, styles.statValueBlue]}>{PLACEHOLDER_STATS.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={[styles.statValue, styles.statValueGreen]}>{PLACEHOLDER_STATS.onTimeRate}</Text>
            <Text style={styles.statLabel}>On-Time</Text>
          </View>
        </View>

        {/* Section C — Vehicle & hub info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, styles.infoIconBlue]}>
              <Text style={styles.infoIconText}>📞</Text>
            </View>
            <Text style={styles.infoText}>{driver?.phone ?? ''}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, styles.infoIconOrange]}>
              <Text style={styles.infoIconText}>🚛</Text>
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoText}>Vehicle No. {driver?.vehicleNumber ?? '—'}</Text>
              <Text style={styles.infoSubText}>{PLACEHOLDER_VEHICLE_TYPE}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, styles.infoIconBlue]}>
              <Text style={styles.infoIconText}>🏭</Text>
            </View>
            <Text style={styles.infoText}>{PLACEHOLDER_HUB}</Text>
          </View>
        </View>

        {/* Section D — Categorized menu groups */}
        {menuGroups.map((group) => (
          <View key={group.title} style={styles.menuGroup}>
            <Text style={styles.menuGroupTitle}>{group.title}</Text>
            <View style={styles.menuCard}>
              {group.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[styles.menuRow, index < group.items.length - 1 ? styles.menuRowDivider : null]}
                  onPress={item.onPress}
                  accessibilityRole="button"
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.menuIconBox, styles.menuIconBlue]}>
                      <Text style={styles.menuIconText}>{item.icon}</Text>
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.menuChevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Section E — Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout} accessibilityRole="button">
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutLabel}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};
