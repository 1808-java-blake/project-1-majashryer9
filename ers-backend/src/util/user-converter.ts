import { SqlUser } from "../dtos/sql-user";
import { User } from "../models/user";

export function userConverter(u: SqlUser){
    return new User(u.user_id, u.username, u.password, u.first_name, u.last_name,
    u.email, u.user_role);
}