export declare global {
  // SERVER
  function setupTestDB(dbname: string): void;
  
  // CLIENT
  function changeRouterProperties({}: { query?: object, pathname?: string, push?: Function }): void;
}
