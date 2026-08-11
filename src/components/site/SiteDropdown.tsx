import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';

import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { enterUp } from '../ui/motion';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { selectSite } from '../../slices/siteSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Site } from '../../types/site';

type SiteDropdownProps = {
  onAddSite: () => void;
};

const SiteDropdown: React.FC<SiteDropdownProps> = ({ onAddSite }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSite, sites, fetchSitesApi } = useSelector(
    (state: RootState) => state.site,
  );

  const [sheetVisible, setSheetVisible] = useState(false);

  const handleSelectSite = (site: Site) => {
    dispatch(selectSite(site));
    setSheetVisible(false);
  };

  const handleAddSite = () => {
    setSheetVisible(false);
    onAddSite();
  };

  return (
    <>
      <AnimatedPressable
        style={styles.pill}
        onPress={() => setSheetVisible(true)}
        pressScale={0.96}
        enforceTouchTarget={false}
      >
        <Icon name="map" width={16} height={16} fill={colors.primary} />
        <AppText variant="body" color={colors.textPrimary} numberOfLines={1} style={styles.pillLabel}>
          {fetchSitesApi.loading ? 'Loading...' : selectedSite?.location ?? 'No site available'}
        </AppText>
        <Icon name="arrow-down" width={14} height={14} fill={colors.textSecondary} />
      </AnimatedPressable>

      <Modal
        visible={sheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)}>
          <Pressable style={[styles.sheet, shadows.lg]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <AppText variant="title" style={styles.sheetTitle}>
              Select Site
            </AppText>

            {fetchSitesApi.loading ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {sites.length === 0 ? (
                  <AppText variant="bodyLg" color={colors.textSecondary} style={styles.emptyText}>
                    No sites available
                  </AppText>
                ) : (
                  sites.map((site, index) => {
                    const isSelected = selectedSite?.siteId === site.siteId;
                    return (
                      <Animated.View key={site.siteId} entering={enterUp(index, 40)}>
                        <AnimatedPressable
                          style={[styles.siteRow, isSelected && styles.siteRowSelected]}
                          onPress={() => handleSelectSite(site)}
                          pressScale={0.98}
                          enforceTouchTarget={false}
                        >
                          <View style={styles.siteRowLeft}>
                            <Icon
                              name="map"
                              width={18}
                              height={18}
                              fill={isSelected ? colors.primary : colors.textSecondary}
                            />
                            <AppText
                              variant={isSelected ? 'bodyLgStrong' : 'bodyLg'}
                              color={isSelected ? colors.textPrimary : colors.textSecondary}
                              numberOfLines={1}
                              style={styles.siteLabel}
                            >
                              {site.location}
                            </AppText>
                          </View>
                          {isSelected ? (
                            <Icon name="check" width={16} height={16} fill={colors.primary} />
                          ) : null}
                        </AnimatedPressable>
                      </Animated.View>
                    );
                  })
                )}

                <AnimatedPressable
                  style={styles.addSiteRow}
                  onPress={handleAddSite}
                  pressScale={0.98}
                  enforceTouchTarget={false}
                >
                  <Icon name="add-circle" width={18} height={18} fill={colors.primary} />
                  <AppText variant="bodyLg" color={colors.primary}>
                    Add Site
                  </AppText>
                </AnimatedPressable>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.glassStrong,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: colors.glassBorderStrong,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.md,
  },
  pillLabel: {
    maxWidth: 200,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingBottom: spacing.xxl,
    maxHeight: '65%',
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: colors.glassBorder,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxs,
  },
  sheetTitle: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  emptyText: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginHorizontal: spacing.sm,
  },
  siteRowSelected: {
    backgroundColor: colors.primarySoft,
  },
  siteRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  siteLabel: {
    flex: 1,
  },
  addSiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: spacing.xxs,
  },
});

export default SiteDropdown;
