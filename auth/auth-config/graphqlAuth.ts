// auth/auth-config/graphqlAuth.ts

import { gql } from 'urql';
// const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;

export const SIGNUP = gql`
  mutation Mutation(
    $name: String!
    $email: String!
    $phone: String!
    $password: String!
  ) {
    registerUser(
      name: $name
      email: $email
      phone: $phone
      password: $password
    ) {
      id
      name
      email
      phone
    }
  }
`;

export const SIGNIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      error
      user {
        id
        name
        email
        phone
      }
    }
  }
`;

export const SEND_RESET_PASSWORD_LINK = gql`
  mutation Mutation($email: String!) {
    sendResetPasswordLink(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation Mutation($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token) {
      status
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation Mutation {
    logout {
      message
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation Mutation($token: String!) {
    verifyEmail(token: $token) {
      status
      message
    }
  }
`;

export const SEND_VERIFICATION_EMAIL = gql`
  mutation Mutation($email: String!) {
    sendVerificationEmail(email: $email) {
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation Mutation($phoneNo: String) {
    sendPhoneOtp(phoneNo: $phoneNo) {
      status
      message
    }
  }
`;
