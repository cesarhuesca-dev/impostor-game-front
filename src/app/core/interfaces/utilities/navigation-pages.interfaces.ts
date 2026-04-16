import { UserRoles } from 'src/app/core/enums/user-roles.enum';
import { MenuItem } from 'primeng/api';

export interface NavigationPages extends MenuItem {
  name: string;
  login?: boolean; //true -> necesita estar logueado, false -> no necesita estar logueado, (undefined) -> siempre esta
  needHost?: boolean; //true -> necesita ser host, false -> no necesita ser host
  overlay?: boolean; //true -> necesita ser host, false -> no necesita ser host
  roles: UserRoles[];
}
