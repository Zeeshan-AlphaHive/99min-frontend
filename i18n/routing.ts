// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "sq","ast","be","bs","bg","ca","hr","cs","da","nl","en",
    "et","fo","fi","fr","gl","de","el","hu","is","ga","it",
    "la","lv","lt","lb","mk","mt","no","pl","pt","ro","rm",
    "ru","sr","sk","sl","es","sv","uk","cy",
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
});