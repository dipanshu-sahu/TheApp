import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createSiteApi, getSitesByUserApi } from '../apis/siteAPI';
import { CreateSiteRequest, Site } from '../types/site';
import { addAsyncCases, ApiState, createApiState } from '../utils/reduxHelper';
import { getStorage, setStorage } from '../utils/storage';

const SELECTED_SITE_KEY = 'selectedSite';

type SiteState = {
  sites: Site[];
  selectedSite: Site | null;
  currentSite: Site | null;
  fetchSitesApi: ApiState<Site[]>;
  createSiteApi: ApiState<Site>;
};

const initialState: SiteState = {
  sites: [],
  selectedSite: null,
  currentSite: null,
  fetchSitesApi: createApiState<Site[]>(),
  createSiteApi: createApiState<Site>(),
};

export const fetchSitesByUser = createAsyncThunk<Site[], string>(
  'site/fetchSitesByUser',
  async userId => getSitesByUserApi(userId),
);

export const createSite = createAsyncThunk<Site, CreateSiteRequest>(
  'site/createSite',
  async payload => createSiteApi(payload),
);

/** Persist a site selection to MMKV and update Redux state. */
export const selectSite = createAsyncThunk<Site, Site>(
  'site/selectSite',
  site => {
    setStorage(SELECTED_SITE_KEY, JSON.stringify(site));
    return site;
  },
);

/** Read the persisted site from MMKV on app boot. */
export const loadPersistedSite = createAsyncThunk<Site | null, void>(
  'site/loadPersistedSite',
  () => {
    const raw = getStorage(SELECTED_SITE_KEY, 'string') as string | undefined;
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as Site;
    } catch {
      return null;
    }
  },
);

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    clearCurrentSite: state => {
      state.currentSite = null;
    },
    setSelectedSite: (state, action: PayloadAction<Site | null>) => {
      state.selectedSite = action.payload;
    },
  },
  extraReducers: builder => {
    addAsyncCases(builder, fetchSitesByUser, 'fetchSitesApi', undefined, (state, action) => {
      const sites = action.payload as Site[];
      state.sites = sites;

      // Auto-select the first site if nothing is currently selected
      if (!state.selectedSite && sites.length > 0) {
        state.selectedSite = sites[0];
        setStorage(SELECTED_SITE_KEY, JSON.stringify(sites[0]));
      }
    });
    addAsyncCases(builder, createSite, 'createSiteApi', 'currentSite');

    builder
      .addCase(selectSite.fulfilled, (state, action) => {
        state.selectedSite = action.payload;
      })
      .addCase(loadPersistedSite.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSite = action.payload;
        }
      });
  },
});

export const { clearCurrentSite, setSelectedSite } = siteSlice.actions;

export default siteSlice.reducer;
