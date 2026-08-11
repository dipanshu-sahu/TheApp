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

/** Read the persisted site from MMKV on app boot. */
export const loadPersistedSite = createAsyncThunk<Site | null, void>(
  'site/loadPersistedSite',
  (): Site | null => {
    // `getStorage` overload for 'string' returns `string | undefined`
    const raw = getStorage(SELECTED_SITE_KEY, 'string');
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
    /**
     * Synchronously selects a site and persists the choice to MMKV.
     * Previously implemented as an AsyncThunk despite being synchronous —
     * converted to a plain reducer to eliminate unnecessary async overhead.
     */
    selectSite: (state, action: PayloadAction<Site>) => {
      state.selectedSite = action.payload;
      setStorage(SELECTED_SITE_KEY, JSON.stringify(action.payload));
    },
  },
  extraReducers: builder => {
    addAsyncCases(
      builder,
      fetchSitesByUser,
      'fetchSitesApi',
      undefined,
      (state, action) => {
        const sites = action.payload;
        state.sites = sites;

        // Auto-select the first site if nothing is currently selected
        if (!state.selectedSite && sites.length > 0) {
          state.selectedSite = sites[0];
          setStorage(SELECTED_SITE_KEY, JSON.stringify(sites[0]));
        }
      },
    );

    addAsyncCases(builder, createSite, 'createSiteApi', 'currentSite');

    builder.addCase(loadPersistedSite.fulfilled, (state, action) => {
      if (action.payload) {
        state.selectedSite = action.payload;
      }
    });
  },
});

export const { clearCurrentSite, setSelectedSite, selectSite } = siteSlice.actions;

export default siteSlice.reducer;
