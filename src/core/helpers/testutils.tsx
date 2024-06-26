import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { faker } from "@faker-js/faker";
import { ByRoleOptions, screen } from "@testing-library/react";
import { MeProvider } from "identity/hooks/useMe";
import { ReactNode } from "react";

type TestAppProps = {
  children: ReactNode;
  mocks?: MockedResponse[];
  me?: any;
};

jest.mock("next/router", () => require("next-router-mock"));
// This is needed for mocking 'next/link':
jest.mock("next/dist/client/router", () => require("next-router-mock"));

export function TestApp(props: TestAppProps) {
  const me = {
    features: [],
    user: LOGGED_IN_USER,
    permissions: {
      adminPanel: true,
    },
    ...(props.me ?? {}),
  };
  return (
    <MockedProvider addTypename={true} mocks={props.mocks ?? []}>
      <MeProvider me={me}>{props.children}</MeProvider>
    </MockedProvider>
  );
}

export const LOGGED_IN_USER = {
  id: faker.string.uuid(),
  firstName: faker.person.firstName,
  lastName: faker.person.lastName,
  avatar: {
    initials: "AE",
    color: "red",
  },
};

export async function waitForDialog(options?: ByRoleOptions) {
  const dialog = await screen.findByRole("dialog", options);
  return dialog;
}
