export type TabKey = 'home' | 'deliveries' | 'notifications' | 'profile';

export interface BottomTabBarProps {
  activeKey: TabKey;
  onTabPress: (key: TabKey) => void;
  testID?: string;
}
