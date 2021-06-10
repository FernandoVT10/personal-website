import React from "react";

import { GraphQLError } from "graphql";
import { MockedProvider } from "@apollo/client/testing";

import { render, fireEvent, screen, act } from "@testing-library/react";

import ContactMe, { SEND_MESSAGE } from "./ContactMe";

jest.mock("@/components/Formulary", () => ({
  Input: ({ prefix, value, setValue }) => {
    return (
      <input
        type="text"
        data-testid={`${prefix}-input`}
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
      />
    );
  },
  TextArea: ({ prefix, value, setValue }) => {
    return (
      <textarea
        data-testid={`${prefix}-textarea`}
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
      />
    );
  }
}));

const REQUEST = {
  query: SEND_MESSAGE,
  variables: {
    name: "test name",
    email: "test@example.com",
    subject: "test subject",
    message: "test message"
  }
}

const changeInputValue = (newValue: string, testId: string) => {
  const input = screen.getByTestId(testId);
  fireEvent.change(input, { target: { value: newValue } });
}

describe("src/domain/Home/ContactMe", () => {
  it("should send a message correctly", async () => {
    const mock = {
      request: REQUEST,
      result: {
        data: { sendMessage: true }
      }
    }

    const { queryByText, getByText, queryByTestId } = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <ContactMe/>
      </MockedProvider>
    );

    changeInputValue("test name", "name-input");
    changeInputValue("test@example.com", "email-input");
    changeInputValue("test subject", "subject-input");
    changeInputValue("test message", "message-textarea");

    expect(queryByTestId("contactme-loader")).not.toBeInTheDocument();

    fireEvent.click(getByText("Send Message"));
    expect(queryByTestId("contactme-loader")).toBeInTheDocument();

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByTestId("contactme-loader")).not.toBeInTheDocument();
    expect(queryByText("Your message has been sent correctly.")).toBeInTheDocument();
    expect(queryByText("Send Message")).not.toBeInTheDocument();
  });
});
