export type CreateSiteRequest = {
  userId: string;
  username: string;
  location: string;
};

export type Site = {
  siteId: string;
  userId: string;
  username: string;
  location: string;
  createdOn: string;
};
