import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import type { OrderStatus } from '../../../types';
import { styles } from './styles';
import type { DeliveryStatusProps, DeliveryStatusStep } from './types';

const STATUS_ORDER: OrderStatus[] = ['pending', 'out_for_delivery', 'completed'];

const DEFAULT_STEPS: DeliveryStatusStep[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'completed', label: 'Completed' },
];

/**
 * Connected-dot progress tracker for an order/delivery's status. Not
 * pixel-specced anywhere in the 13 screens — designed to fit the
 * existing visual language for future reuse (e.g. Order Detail).
 */
export const DeliveryStatus: React.FC<DeliveryStatusProps> = ({
  status,
  steps = DEFAULT_STEPS,
  testID,
}) => {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <View style={styles.row} testID={testID}>
      {steps.map((step, index) => {
        const stepIndex = STATUS_ORDER.indexOf(step.key);
        const isDone = stepIndex < currentIndex;
        const isActive = stepIndex === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <Fragment key={step.key}>
            <View style={styles.step}>
              <View style={[styles.dot, isDone && styles.dotDone, isActive && styles.dotActive]} />
              <Text style={[styles.label, (isDone || isActive) && styles.labelActive]}>
                {step.label}
              </Text>
            </View>
            {!isLast ? (
              <View style={[styles.connector, isDone && styles.connectorDone]} />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
};
