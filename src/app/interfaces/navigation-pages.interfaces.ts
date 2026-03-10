
import { UserRole } from "@/enums/user-roles.enum";
import { MenuItem } from "primeng/api";

export interface NavigationPages extends MenuItem {
  name: string;
  permission : UserRole[];
}
