import { mocked } from "ts-jest/utils";

import { useRouter } from "next/router";

jest.mock("next/router");

const useRouterMocked = mocked(useRouter);

const changeRouterProperties = ({query, pathname, push }: { query?: object, pathname?: string, push?: Function }) => {
  useRouterMocked.mockImplementation(() => ({
    query: query ?? {},
    pathname: pathname ?? "/test/",
    push: push ?? jest.fn()
  } as any));
}

beforeEach(() => useRouterMocked.mockReset());

global.changeRouterProperties = changeRouterProperties;
