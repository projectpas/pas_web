// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';

@Injectable()
export class DBkeys {

    public static readonly CURRENT_USER = "current_user";
    public static readonly USER_PERMISSIONS = "user_permissions";
    public static readonly ACCESS_TOKEN = "access_token";
    public static readonly REFRESH_TOKEN = "refresh_token";
    public static readonly TOKEN_EXPIRES_IN = "expires_in";

    public static readonly REMEMBER_ME = "remember_me";
    public static readonly EMPLOYEE = "employee";
    public static readonly MANAGEMENTSTRUCTURE = "management_structure";
    public static readonly LANGUAGE = "language";
    public static readonly HOME_URL = "home_url";
    public static readonly THEME_ID = "themeId";
    public static readonly SHOW_DASHBOARD_STATISTICS = "show_dashboard_statistics";
    public static readonly SHOW_DASHBOARD_NOTIFICATIONS = "show_dashboard_notifications";
    public static readonly SHOW_DASHBOARD_TODO = "show_dashboard_todo";
    public static readonly SHOW_DASHBOARD_BANNER = "show_dashboard_banner";
    public static readonly User_Role_Permission = "user_role_permission";
    public static readonly Module_Hierarchy = "module_hierarchy";
    public static readonly GLOBAL_SETTINGS = "global_settings";
    public static readonly MASTER_COMPANY_ID = 1;
    public static readonly DEFAULT_ROTABLE_ID = 13;
    public static readonly AUTO_COMPLETE_COUNT_LENGTH = 20; //Do Not change It from 20 If require another const.
    public static readonly UPDATED_BY = "admin";
    public static readonly GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_QUOTE = "Create Sales Order Quote";
    public static readonly GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_ORDER = "Create Sales Order";
    public static readonly GLOBAL_CUSTOMER_WARNING_ID_FOR_SALES_ORDER = 618;
    public static readonly DEFAULT_PRIORITY_ID = 2;
    public static readonly DEFAULT_SALES_QUOTE_APPROVAL_ID: number = 4;
    public static readonly DEFAULT_SALES_ORDER_APPROVAL_STATUS_ID: number = 4;
    public static readonly GLOBAL_DATE_FORMAT = 'MM/dd/yyyy';
    public static readonly GLOBAL_LOCAL_ID = "en-US"
    public static readonly GLOBAL_TWO_DIGIT_DEFAULT_NUMBER = 0.00;
    public static readonly WORK_ORDER_TYPE_INTERNAL_ID = 2;
    public static readonly SALES_ORDER_QUOTE_MODULE_ID = 46;
    public static readonly SALES_ORDER__MODULE_ID = 57;
    public static readonly WORK_ORDER_MODULE_ID = 38;
    public static readonly FROM_EMAIL_FOR_SENDING_MAIL = "janadhan@silverxis.com";
    public static readonly DEFAULT_EXCHANGE_QUOTE_APPROVAL_ID: number = 4;
}