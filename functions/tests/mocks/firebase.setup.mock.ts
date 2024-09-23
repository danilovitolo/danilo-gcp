import firebaseFunctionsTest from "firebase-functions-test";

const testEnv = firebaseFunctionsTest();

export const setupFirebaseTestEnv = () => {
  beforeEach(() => {
    testEnv.mockConfig({});
  });

  afterEach(() => {
    testEnv.cleanup();
  });
};
