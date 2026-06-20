import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
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
      <TouchableOpacity
        style={styles.pill}
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="map" width={16} height={16} fill={colors.primary} />
        <Text style={styles.pillLabel} numberOfLines={1}>
          {fetchSitesApi.loading
            ? 'Loading...'
            : selectedSite?.location ?? 'No site available'}
        </Text>
        <Icon name="arrow-down" width={14} height={14} fill={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={sheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Site</Text>

            {fetchSitesApi.loading ? (
              <ActivityIndicator
                color={colors.accent}
                style={styles.loader}
              />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              >
                {sites.length === 0 ? (
                  <Text style={styles.emptyText}>No sites available</Text>
                ) : (
                  sites.map(site => {
                    const isSelected = selectedSite?.siteId === site.siteId;
                    return (
                      <TouchableOpacity
                        key={site.siteId}
                        style={[styles.siteRow, isSelected && styles.siteRowSelected]}
                        onPress={() => handleSelectSite(site)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.siteRowLeft}>
                          <Icon
                            name="map"
                            width={18}
                            height={18}
                            fill={isSelected ? colors.primary : colors.textSecondary}
                          />
                          <Text
                            style={[
                              styles.siteLabel,
                              isSelected && styles.siteLabelSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {site.location}
                          </Text>
                        </View>
                        {isSelected ? (
                          <Icon
                            name="check"
                            width={16}
                            height={16}
                            fill={colors.primary}
                          />
                        ) : null}
                      </TouchableOpacity>
                    );
                  })
                )}

                <TouchableOpacity
                  style={styles.addSiteRow}
                  onPress={handleAddSite}
                  activeOpacity={0.85}
                >
                  <Icon
                    name="add-circle"
                    width={18}
                    height={18}
                    fill={colors.primary}
                  />
                  <Text style={styles.addSiteLabel}>Add Site</Text>
                </TouchableOpacity>
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
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.bgSecondary,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 16,
  },
  pillLabel: {
    ...textFont.regularM,
    color: colors.textPrimary,
    maxWidth: 180,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '65%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lineGrey,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetTitle: {
    ...textFont.boldM,
    color: colors.textPrimary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  loader: {
    marginVertical: 24,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyText: {
    ...textFont.regularM,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  siteRowSelected: {
    backgroundColor: `${colors.primary}18`,
  },
  siteRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  siteLabel: {
    ...textFont.regularM,
    color: colors.textSecondary,
    flex: 1,
  },
  siteLabelSelected: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
  addSiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    marginTop: 4,
  },
  addSiteLabel: {
    ...textFont.regularM,
    color: colors.primary,
  },
});

export default SiteDropdown;
