import { IUser } from "../patreon-data-types/user";
import { IGenericResponse } from "../response";

export type TCurrentUserResponse = IGenericResponse<IUser, void>;
