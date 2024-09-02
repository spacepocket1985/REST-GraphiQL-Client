export const add2LocalStorage = (searchParam: string) => {
  const existingUrlsString = localStorage.getItem('RestGraphqlHistoryLogs');

  const existingUrls = existingUrlsString ? JSON.parse(existingUrlsString) : [];

  existingUrls.push(searchParam);

  localStorage.setItem('RestGraphqlHistoryLogs', JSON.stringify(existingUrls));
};
