import { UserType } from "./UserTypes";

export type AccountModal = {
    user: UserType;
    loading: boolean;
}

export type updateUserType = {
    dateOfBirth: String;
    displayName: String;
    gender: string;
}
