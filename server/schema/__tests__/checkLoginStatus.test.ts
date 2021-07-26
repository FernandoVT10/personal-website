import { checkLoginStatusResolvers } from "../checkLoginStatus";

describe("server/schema/checkLoginStatus", () => {
  describe("query checkLoginStatus", () => {
    it("should return the value of the context.loggedIn", async () => {
      const { checkLoginStatus } = checkLoginStatusResolvers.Query;

      expect(await checkLoginStatus(null, null, { loggedIn: true })).toBeTruthy();

      expect(await checkLoginStatus(null, null, { loggedIn: false })).toBeFalsy();
    });
  });
});
