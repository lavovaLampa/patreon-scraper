import { IUser } from "../patreon-data-types/user"
import { GenericResponse } from "../response"

export type TCurrentUserResponse = GenericResponse<IUser, void>
