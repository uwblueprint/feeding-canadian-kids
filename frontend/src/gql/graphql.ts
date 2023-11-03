/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: { input: any; output: any; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any; }
  /**
   * The `Time` scalar type represents a Time value as
   * specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Time: { input: any; output: any; }
};

export type AspInfo = {
  __typename?: 'ASPInfo';
  numKids?: Maybe<Scalars['Int']['output']>;
};

export type AspInfoInput = {
  numKids?: InputMaybe<Scalars['Int']['input']>;
};

export type ActivateUserById = {
  __typename?: 'ActivateUserByID';
  user?: Maybe<User>;
};

export type ApproveOnboardingRequest = {
  __typename?: 'ApproveOnboardingRequest';
  onboardingRequest?: Maybe<OnboardingRequest>;
};

export type Contact = {
  __typename?: 'Contact';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type ContactInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateMealRequestResponse = {
  __typename?: 'CreateMealRequestResponse';
  description: Scalars['String']['output'];
  dropOffDatetime: Scalars['DateTime']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  mealInfo: MealInfoResponse;
  status: Scalars['String']['output'];
};

export type CreateMealRequests = {
  __typename?: 'CreateMealRequests';
  mealRequests?: Maybe<Array<Maybe<CreateMealRequestResponse>>>;
};

export type CreateOnboardingRequest = {
  __typename?: 'CreateOnboardingRequest';
  onboardingRequest?: Maybe<OnboardingRequest>;
};

export type DeactivateUserById = {
  __typename?: 'DeactivateUserByID';
  user?: Maybe<User>;
};

export type DonationInfo = {
  __typename?: 'DonationInfo';
  additionalInfo?: Maybe<Scalars['String']['output']>;
  commitmentDate?: Maybe<Scalars['DateTime']['output']>;
  donor?: Maybe<User>;
  mealDescription?: Maybe<Scalars['String']['output']>;
};

export type DonorInfo = {
  __typename?: 'DonorInfo';
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type DonorInfoInput = {
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Triggers forgotten password reset link for user with specified email */
export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  success?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Returns access token in response body and sets refreshToken as an
 * httpOnly cookie
 */
export type LoginMutation = {
  __typename?: 'LoginMutation';
  registeredUser?: Maybe<RegisteredUser>;
};

/** Revokes all of the specified user's refresh tokens */
export type Logout = {
  __typename?: 'Logout';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type MealInfoResponse = {
  __typename?: 'MealInfoResponse';
  dietaryRestrictions?: Maybe<Scalars['String']['output']>;
  mealSuggestions?: Maybe<Scalars['String']['output']>;
  portions: Scalars['Int']['output'];
};

export type MealRequestResponse = {
  __typename?: 'MealRequestResponse';
  dateCreated?: Maybe<Scalars['DateTime']['output']>;
  dateUpdated?: Maybe<Scalars['DateTime']['output']>;
  deliveryInstructions?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  donationInfo?: Maybe<DonationInfo>;
  dropOffDatetime?: Maybe<Scalars['DateTime']['output']>;
  dropOffLocation?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  mealInfo?: Maybe<MealInfoResponse>;
  onsiteStaff?: Maybe<Array<Maybe<Contact>>>;
  requestor?: Maybe<User>;
  status?: Maybe<Scalars['String']['output']>;
};

/** An enumeration. */
export type MealStatus =
  | 'CANCELLED'
  | 'FULFILLED'
  | 'OPEN';

export type MealTypeInput = {
  dietaryRestrictions?: InputMaybe<Scalars['String']['input']>;
  mealSuggestions?: InputMaybe<Scalars['String']['input']>;
  portions: Scalars['Int']['input'];
};

export type OnboardingRequest = {
  __typename?: 'OnboardingRequest';
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  info?: Maybe<UserInfo>;
  status?: Maybe<Scalars['String']['output']>;
};

/** Returns access token in response body and sets refreshToken as an httpOnly cookie */
export type Refresh = {
  __typename?: 'Refresh';
  accessToken?: Maybe<Scalars['String']['output']>;
};

/** Returns access token & user info, sets refreshToken as httpOnly cookie */
export type Register = {
  __typename?: 'Register';
  registeredUser?: Maybe<RegisteredUser>;
};

export type RegisteredUser = {
  __typename?: 'RegisteredUser';
  accessToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  info?: Maybe<UserInfo>;
};

export type RejectOnboardingRequest = {
  __typename?: 'RejectOnboardingRequest';
  onboardingRequest?: Maybe<OnboardingRequest>;
};

/** Triggers password reset for user with specified email */
export type ResetPassword = {
  __typename?: 'ResetPassword';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RoleInfo = {
  __typename?: 'RoleInfo';
  aspInfo?: Maybe<AspInfo>;
  donorInfo?: Maybe<DonorInfo>;
};

export type RoleInfoInput = {
  aspInfo?: InputMaybe<AspInfoInput>;
  donorInfo?: InputMaybe<DonorInfoInput>;
};

export type RootMutation = {
  __typename?: 'RootMutation';
  activateUserByID?: Maybe<ActivateUserById>;
  approveOnboardingRequest?: Maybe<ApproveOnboardingRequest>;
  createMealRequest?: Maybe<CreateMealRequests>;
  createOnboardingRequest?: Maybe<CreateOnboardingRequest>;
  deactivateUserByID?: Maybe<DeactivateUserById>;
  /** Triggers forgotten password reset link for user with specified email */
  forgotPassword?: Maybe<ForgotPassword>;
  /**
   * Returns access token in response body and sets refreshToken as an
   * httpOnly cookie
   */
  login?: Maybe<LoginMutation>;
  /** Revokes all of the specified user's refresh tokens */
  logout?: Maybe<Logout>;
  /** Returns access token in response body and sets refreshToken as an httpOnly cookie */
  refresh?: Maybe<Refresh>;
  /** Returns access token & user info, sets refreshToken as httpOnly cookie */
  register?: Maybe<Register>;
  rejectOnboardingRequest?: Maybe<RejectOnboardingRequest>;
  /** Triggers password reset for user with specified email */
  resetPassword?: Maybe<ResetPassword>;
  updateUserByID?: Maybe<UpdateUserById>;
};


export type RootMutationActivateUserByIdArgs = {
  id: Scalars['String']['input'];
  requestorId: Scalars['String']['input'];
};


export type RootMutationApproveOnboardingRequestArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationCreateMealRequestArgs = {
  deliveryInstructions?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  dropOffLocation: Scalars['String']['input'];
  dropOffTime: Scalars['Time']['input'];
  mealInfo: MealTypeInput;
  onsiteStaff: Array<InputMaybe<ContactInput>>;
  requestDates: Array<InputMaybe<Scalars['Date']['input']>>;
  requestorId: Scalars['ID']['input'];
};


export type RootMutationCreateOnboardingRequestArgs = {
  userInfo: UserInfoInput;
};


export type RootMutationDeactivateUserByIdArgs = {
  id: Scalars['String']['input'];
  requestorId: Scalars['String']['input'];
};


export type RootMutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationLoginArgs = {
  email: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type RootMutationLogoutArgs = {
  userId: Scalars['String']['input'];
};


export type RootMutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  requestId: Scalars['String']['input'];
};


export type RootMutationRejectOnboardingRequestArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationResetPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationUpdateUserByIdArgs = {
  id: Scalars['String']['input'];
  requestorId: Scalars['String']['input'];
  userInfo: UserInfoInput;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  getAllOnboardingRequests?: Maybe<Array<Maybe<OnboardingRequest>>>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getMealRequestsByRequestorId?: Maybe<Array<Maybe<MealRequestResponse>>>;
  getOnboardingRequestById?: Maybe<OnboardingRequest>;
  getUserById?: Maybe<User>;
};


export type RootQueryGetAllOnboardingRequestsArgs = {
  number?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryGetAllUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryGetMealRequestsByRequestorIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxDropOffDate?: InputMaybe<Scalars['Date']['input']>;
  minDropOffDate?: InputMaybe<Scalars['Date']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  requestorId: Scalars['ID']['input'];
  sortByDateDirection?: InputMaybe<SortDirection>;
  status?: InputMaybe<Array<InputMaybe<MealStatus>>>;
};


export type RootQueryGetOnboardingRequestByIdArgs = {
  id: Scalars['String']['input'];
};


export type RootQueryGetUserByIdArgs = {
  id: Scalars['String']['input'];
};

export type SortDirection =
  | 'ASCENDING'
  | 'DESCENDING';

export type UpdateUserById = {
  __typename?: 'UpdateUserByID';
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['String']['output']>;
  info?: Maybe<UserInfo>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  active?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  onsiteContacts?: Maybe<Array<Maybe<Contact>>>;
  organizationAddress?: Maybe<Scalars['String']['output']>;
  organizationCoordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  organizationDesc?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  primaryContact?: Maybe<Contact>;
  role?: Maybe<Scalars['String']['output']>;
  roleInfo?: Maybe<RoleInfo>;
};

export type UserInfoInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  email: Scalars['String']['input'];
  onsiteContacts: Array<InputMaybe<ContactInput>>;
  organizationAddress: Scalars['String']['input'];
  organizationDesc: Scalars['String']['input'];
  organizationName: Scalars['String']['input'];
  primaryContact: ContactInput;
  role: Scalars['String']['input'];
  roleInfo?: InputMaybe<RoleInfoInput>;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'RootMutation', forgotPassword?: { __typename?: 'ForgotPassword', success?: boolean | null } | null };

export type OnboardRequestMutationVariables = Exact<{
  userInfo: UserInfoInput;
}>;


export type OnboardRequestMutation = { __typename?: 'RootMutation', createOnboardingRequest?: { __typename?: 'CreateOnboardingRequest', onboardingRequest?: { __typename?: 'OnboardingRequest', id?: string | null, dateSubmitted?: any | null, status?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'RootMutation', login?: { __typename?: 'LoginMutation', registeredUser?: { __typename?: 'RegisteredUser', accessToken?: string | null, id?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, active?: boolean | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null } | null };

export type LogoutMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'RootMutation', logout?: { __typename?: 'Logout', success?: boolean | null } | null };

export type RefreshMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshMutation = { __typename?: 'RootMutation', refresh?: { __typename?: 'Refresh', accessToken?: string | null } | null };

export type GetUserByIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserByIdQuery = { __typename?: 'RootQuery', getUserById?: { __typename?: 'User', id?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'RootMutation', resetPassword?: { __typename?: 'ResetPassword', success?: boolean | null } | null };

export type GetOnboardingRequestByIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOnboardingRequestByIdQuery = { __typename?: 'RootQuery', getOnboardingRequestById?: { __typename?: 'OnboardingRequest', id?: string | null, dateSubmitted?: any | null, status?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  requestId: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'RootMutation', register?: { __typename?: 'Register', registeredUser?: { __typename?: 'RegisteredUser', accessToken?: string | null, id?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null } | null };

export type UpdateUserByIdMutationVariables = Exact<{
  requestorId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  userInfo: UserInfoInput;
}>;


export type UpdateUserByIdMutation = { __typename?: 'RootMutation', updateUserByID?: { __typename?: 'UpdateUserByID', user?: { __typename?: 'User', id?: string | null, info?: { __typename?: 'UserInfo', email?: string | null, organizationAddress?: string | null, organizationName?: string | null, organizationDesc?: string | null, role?: string | null, active?: boolean | null, roleInfo?: { __typename?: 'RoleInfo', aspInfo?: { __typename?: 'ASPInfo', numKids?: number | null } | null, donorInfo?: { __typename?: 'DonorInfo', type?: string | null, tags?: Array<string | null> | null } | null } | null, primaryContact?: { __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null, onsiteContacts?: Array<{ __typename?: 'Contact', name?: string | null, phone?: string | null, email?: string | null } | null> | null } | null } | null } | null };


export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const OnboardRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OnboardRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOnboardingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userInfo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardingRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<OnboardRequestMutation, OnboardRequestMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserByID"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const GetOnboardingRequestByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOnboardingRequestById"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOnboardingRequestById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetOnboardingRequestByIdQuery, GetOnboardingRequestByIdQueryVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"userInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userInfo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organizationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDesc"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"roleInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aspInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numKids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onsiteContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserByIdMutation, UpdateUserByIdMutationVariables>;