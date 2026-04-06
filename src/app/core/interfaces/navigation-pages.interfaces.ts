
import { UserRole } from "src/app/core/enums/user-roles.enum";
import { MenuItem } from "primeng/api";

export interface NavigationPages extends MenuItem {
  name: string;
  permission : UserRole[];
  login?: boolean; //true -> necesita estar logueado, false -> no necesita estar logueado, (undefined) -> siempre esta
  needHost?: boolean; //true -> necesita ser host, false -> no necesita ser host
}
